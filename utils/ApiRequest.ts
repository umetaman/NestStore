import * as fs from 'fs'
import axios from 'axios'
import * as FormData from 'form-data'
import { Message, MessageFile } from '~~/types/Message'

export class Request {
  static async uploadMessage (messages: Array<Message>) {
    if (messages.length < 1) {
      throw new Error('[Request::uploadMessage] messages are empty.')
    }

    const message = messages[0]
    return await axios.post(message.getApiUrl(), messages)
  }

  static async uploadFile (message: MessageFile, file: File) {
    const form = new FormData()
    form.append('uploadFile', file)

    const url = `/upload${message.contentCommon.url}/${message.content.filename}`

    const messageResponse = await axios.post(message.getApiUrl(), [message])
    const uploadResponse = await axios.post(url, form, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })

    return {
      message: messageResponse,
      upload: uploadResponse
    }
  }

  static async getMessages (url: string) {
    return await axios.get(`/api${url}`)
  }
}
