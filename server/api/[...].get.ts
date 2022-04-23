import Database from '~~/utils/Database'

export default defineEventHandler(async (handler) => {
  try {
    const url = handler.req.url.replace('/api', '')
    if (url) {
      if (url.endsWith('/')) {
        throw new Error('[server/api] Invalid Url.')
      }
    } else {
      return []
    }

    // URLに応じて、関連するMessageをDBから取得する
    const db = new Database('database.db')
    const data = await db.pullMessages(url)
    const messages = []
    for (const d of data) {
      messages.push(d)
    }
    return messages
  } catch (e) {
    console.error(e)
  }

  // 必ず配列を返す
  return []
})
