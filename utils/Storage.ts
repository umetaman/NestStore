import * as path from 'path'
import * as fs from 'fs'
import { IncomingMessage } from 'http'
import formidable from 'formidable'
import { waitUntil } from './Task'
import { MessageFile } from '~~/types/Message'

export class Storage {
  static async getFile (message: MessageFile): Promise<Buffer | null> {
    const config = useRuntimeConfig()
    const url = message.content.url.startsWith('/') ? message.content.url.slice(1) : message.content.url
    const filePath = path.resolve(config.storageDir, 'upload/', url, message.content.filename)

    let isComplete = false
    let buffer: Buffer | null = null
    fs.readFile(filePath, (error, data) => {
      if (error) {
        console.error(error)
        isComplete = true
        return
      }

      buffer = data
      isComplete = true
    })

    await waitUntil(() => isComplete)
    return buffer
  }

  static async savePostFiles (request: IncomingMessage) {
    const requestRawUrl = request.url as string
    const url = requestRawUrl.startsWith('/') ? requestRawUrl.slice(1) : requestRawUrl
    if (!url) {
      throw new Error('[Storage::savePostFiles] Invalid Url.')
    }

    if (url.endsWith('/')) {
      throw new Error('[Storage::savePostFiles] Invalid Url with filename')
    }

    const config = useRuntimeConfig()

    const filePath = decodeURI(path.resolve(config.storageDir, url))
    const targetDir = path.dirname(filePath)

    let isComplete = false
    const form = new formidable.IncomingForm()

    form.parse(request, (error, _fields, files: formidable.Files) => {
      if (error) {
        console.error(`[Storage::savePostFiles] ${error}`)
      }

      const f = files.uploadFile as formidable.File

      try {
        fs.statSync(targetDir)
      } catch (e: any) {
        if (e.code === 'ENOENT') {
          fs.mkdirSync(targetDir, { recursive: true })
        }
      }

      fs.copyFile(f.filepath, filePath, () => {
        isComplete = true
      })
    })

    await waitUntil(() => isComplete)
  }
}
