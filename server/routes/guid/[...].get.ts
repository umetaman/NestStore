import { ServerResponse } from 'http'
import Database from '~~/utils/Database'
import { Message, MessageText, MessageType } from '~~/types/Message'

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

    if (results.length < 1) {
      write404Error(handler.res)
    }

    // もったいないけど先頭のみ
    const message = results[0]

    switch (message.getType()) {
      case MessageType.File:
        break
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
