import * as path from 'path'
import * as fs from 'fs'
import { IncomingMessage } from 'http'
import formidable from 'formidable'
import { waitUntil } from './Task'

export class Storage {
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

    const filePath = path.resolve(config.storageDir, url)
    const targetDir = path.dirname(filePath)

    let isComplete = false
    const form = formidable({})

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
