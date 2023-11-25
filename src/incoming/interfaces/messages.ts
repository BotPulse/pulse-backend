export interface Messages {
  from: string;
  id: string;
  timestamp: string;
  text: Text;
  type: MessagesType;
}

export interface Text {
  body: string;
}

export interface Error {
  code: number;
  details: string;
  title: string;
}

export enum MessagesType {
  AUDIO = 'audio',
  BUTTON = 'button',
  DOCUMENT = 'document',
  INTERACTIVE = 'interactive',
  ORDER = 'order',
  SYSTEM = 'system',
  VIDEO = 'video',
  TEXT = 'text',
  REACTION = 'reaction',
  IMAGE = 'image',
  STICKER = 'sticker',
  UNKNOWN = 'unknown',
}
