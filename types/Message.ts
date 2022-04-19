import lodash from 'lodash'

export enum MessageType {
    None = 0,
    File = 1,
    Text = 2,
}

export interface ContentCommon {
    type: MessageType
    guid: string,
    url: string
}

export interface ContentFile extends ContentCommon {
    filename: string
}

export interface ContentText extends ContentCommon {
    text: string
}

export abstract class Message {
  public abstract get contentCommon (): Readonly<ContentCommon>;

  /** GUIDを作る */
  public static createGuid (): string {
    let uuid = ''
    let i
    let random
    for (i = 0; i < 32; i++) {
      random = (Math.random() * 16) | 0

      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-'
      }
      uuid += (
        i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random
      ).toString(16)
    }
    return uuid
  }

  public static objectToMessage (obj: ContentCommon | ContentFile | ContentText): Message {
    switch (obj.type) {
      case MessageType.File:
        return new MessageFile(obj)
      case MessageType.Text:
        return new MessageText(obj)
      default:
        throw new Error('[Message::objectToMessage] Invalid type.')
    }
  }

  /** メッセージの種別を取得する */
  public getType (): MessageType {
    return this.contentCommon.type
  }
}

export class MessageFile extends Message {
  private _content: ContentFile = {
    type: MessageType.File,
    guid: '',
    url: '',
    filename: ''
  }

  constructor (content: Partial<ContentFile>) {
    super()
    this._content = lodash.cloneDeep({ ...this._content, ...content })
  }

  public override get contentCommon (): Readonly<ContentCommon> {
    return this._content
  }

  public get content (): Readonly<ContentFile> {
    return this._content
  }
}

export class MessageText extends Message {
  private _content: ContentText = {
    type: MessageType.Text,
    guid: '',
    url: '',
    text: ''
  }

  constructor (content: Partial<ContentText>) {
    super()
    this._content = lodash.cloneDeep({ ...this._content, ...content })
  }

  public override get contentCommon (): Readonly<ContentCommon> {
    return this._content
  }

  public get content (): Readonly<ContentText> {
    return this._content
  }
}
