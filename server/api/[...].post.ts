import { ContentCommon, Message } from '~~/types/Message'
import Database from '~~/utils/Database'

export default defineEventHandler(async (handler) => {
  // BodyにくっついてきたJSONを解釈する
  const body = await useBody(handler)
  const rawContents = body as Array<ContentCommon>
  const messages: Array<Message> = []

  // Messageオブジェクトに変換する
  for (const rawContent of rawContents) {
    try {
      messages.push(Message.objectToMessage(rawContent))
    } catch (_e) {
      // :)
    }
  }

  // 保存する
  const db = new Database('database.db')
  db.pushMessages(messages)

  return body
})
