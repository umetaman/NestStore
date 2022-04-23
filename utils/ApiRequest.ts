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
    return await axios.post(`/api/${message.contentCommon.url}`, messages)
  }

  static async uploadFile (message: MessageFile, stream: fs.ReadStream) {
    const form = new FormData()
    form.append('uploadFile', stream)

    const config = {
      headers: { ...form.getHeaders() }
    }

    const url = `/upload${message.contentCommon.url}`

    return await axios.post(url, form, config)
  }

  static async getMessages (url: string) {
    return await axios.get(`/api${url}`)
  }
}
