import { ServerResponse } from 'http'
import Database from '~~/utils/Database'
import { Message, MessageText, MessageFile, MessageType } from '~~/types/Message'
import { Storage } from '~~/utils/Storage'

function write404Error (response: ServerResponse) {
  response.writeHead(404)
  response.end()
}

function writeRedirect (response: ServerResponse, url: string) {
  response.writeHead(302, {
    Location: url
  })
  response.end()
}

function writePlainText (response: ServerResponse, text: string) {
  response.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' })
  response.end(text)
}

async function writeFile (response: ServerResponse, message: MessageFile) {
  // パスの作成
  const buffer = await Storage.getFile(message)

  if (buffer) {
    response.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Disposition': `inline; filename="${encodeURI(message.content.filename)}"` })
    response.write(buffer)
  } else {
    response.writeHead(404)
  }

  response.end()
}

export default defineEventHandler(async (handler) => {
  try {
    const url = handler.req.url
    if (url) {
      if (url.endsWith('/')) {
        throw new Error('[server/routes] Invalid Url')
      }
    } else {
      return []
    }

    // GUIDと完全に一致したMessagerを取得する
    const guid = url.replace('/guid/', '')
    const db = new Database('database.db')
    const results: Message[] = await db.pullMessagesByGuid(guid)

    console.log(results)

    if (results.length < 1) {
      write404Error(handler.res)
    }

    // もったいないけど先頭のみ
    // というか同じGUIDは複数存在しない
    const message = results[0]

    switch (message.getType()) {
      case MessageType.File:{
        const messageFile = message as MessageFile
        await writeFile(handler.res, messageFile)
        break
      }
      case MessageType.Text:{
        const messageText = message as MessageText
        if (messageText.content.text.startsWith('http')) {
          writeRedirect(handler.res, messageText.content.text)
        } else {
          writePlainText(handler.res, messageText.content.text)
        }
        break
      }
    }
  } catch (e) {
    console.error(e)
  }

  // ここまで来てしまったら404
  write404Error(handler.res)
})
