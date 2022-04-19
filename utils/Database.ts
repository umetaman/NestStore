import sqlite3 from 'sqlite3'
import { waitUntil } from './Task'
import { ContentFile, ContentText, Message, MessageFile, MessageText, MessageType } from '~~/types/Message'

interface MessageRow extends ContentFile, ContentText {

}

export default class Database {
  private database: sqlite3.Database = null

  constructor (path: string) {
    this.database = new sqlite3.Database(path)
    this.database.serialize(() => {
      this.database.run('create table if not exists messages(type,guid,url primary key,filename,text)')
    })
  }

  public async pullMessages (url: string) {
    let isComplete = false
    const messages: Message[] = []

    this.database.all(`select * from messages where url glob '${url}*'`, (error, rows) => {
      console.error(`[Database] ${error}`)

      for (const row of rows) {
        const messageRow = row as MessageRow
        switch (row.type) {
          case MessageType.File:
            messages.push(new MessageFile(messageRow))
            break
          case MessageType.Text:
            messages.push(new MessageText(messageRow))
            break
        }
      }
      isComplete = true
    })

    await waitUntil(() => isComplete)
    return messages
  }

  public async pullFilesByGuid (guid: string) {
    let isComplete = false
    const messages: MessageFile[] = []

    this.database.all(`select * from messages where guid = '${guid}'`, (error, rows) => {
      if (error) {
        console.error(`[Database::pullFiles] ${error}`)
      }

      for (const row of rows) {
        messages.push(new MessageFile({
          guid: row.guid,
          url: row.url,
          filename: row.filename
        }))
      }

      isComplete = true
    })

    await waitUntil(() => isComplete)
    return messages
  }

  public async pullTextsByGuid (guid: string) {
    let isComplete = false
    const messages: MessageText[] = []

    this.database.all(`select * from messages where guid = '${guid}'`, (error, rows) => {
      console.error(error)

      for (const row of rows) {
        messages.push(new MessageText({
          guid: row.guid,
          url: row.url,
          text: row.text
        }))
      }

      isComplete = true
    })

    await waitUntil(() => isComplete)
    return messages
  }

  public async pullMessagesByGuid (guid: string) {
    let isComplete = false
    const messages: Message[] = []

    this.database.all(`select * from messages where guid = '${guid}'`, (error, rows) => {
      console.error(`[Database] ${error}`)

      for (const row of rows) {
        const messageRow = row as MessageRow
        switch (row.type) {
          case MessageType.File:
            messages.push(new MessageFile(messageRow))
            break
          case MessageType.Text:
            messages.push(new MessageText(messageRow))
            break
        }
      }
      isComplete = true
    })

    await waitUntil(() => isComplete)
    return messages
  }

  public pushFile (message: MessageFile) {
    this.database.run('replace into messages(type,guid,url,filename) values(?,?,?,?)',
      message.content.type,
      message.content.guid,
      message.content.url,
      message.content.filename)
  }

  public pushText (message: MessageText) {
    this.database.run('replace into messages(type,guid,url,text) values(?,?,?,?)',
      message.content.type,
      message.content.guid,
      message.content.url,
      message.content.text)
  }

  public pushMessages (messages: Message[]) {
    for (const message of messages) {
      switch (message.getType()) {
        case MessageType.File:
          this.pushFile(message as MessageFile)
          break
        case MessageType.Text:
          this.pushText(message as MessageText)
          break
      }
    }
  }

  public close () {
    if (this.database === null) {
      this.database.close()
    }
  }
}
