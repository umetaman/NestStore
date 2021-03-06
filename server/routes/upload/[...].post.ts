import { Storage } from '~~/utils/Storage'

export default defineEventHandler(async (handler) => {
  console.log('Hello.')
  console.log(handler.req.url)
  try {
    const url = handler.req.url
    if (url) {
      if (url.endsWith('/')) {
        throw new Error('[server/upload] Invalid Url with filename.')
      }
    } else {
      return {
        isSucceeded: false,
        message: 'Invalid Url.'
      }
    }
  } catch (e) {
    console.error(e)
  }

  await Storage.savePostFiles(handler.req)

  console.log('Posted')

  return {
    isSucceeded: true
  }
})
