export class WebhookPayload {
  object: string;
  entry: Entry[];
}

export class Entry {
  id: string;
  changes: Change[];
}

export class Change {
  value: Value;
  field: string;
}

export class Value {
  messaging_product: string;
  metadata: Metadata;
  contacts?: Contact[];
  errors?: any;
  messages?: Messages[];
  statuses?: Statuses[];
}

export class Metadata {
  display_phone_number: string;
  phone_number_id: string;
}

export class Contact {
  profile: Profile;
  wa_id: string;
}

export class Profile {
  name: string;
}

export enum ValueKeys {
  MESSAGES = 'messages',
  STATUSES = 'statuses',
  ERRORS = 'errors',
}

export class Messages {
  from: string;
  id: string;
  timestamp: string;
  text?: Text;
  audio?: Audio
  type: MessagesType;
}

export class Text {
  body: string;
}

export class Audio {
  id: string;
}

export class Error {
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

export class Statuses {
  id: string;
  status: StatusType;
  timestamp: number;
  recipient_id: string;
  conversation: Conversation;
  pricing: Pricing;
}

export class Conversation {
  id: string;
  expiration_timestamp: number;
  origin: Origin;
}

export class Origin {
  type: string;
}

export class Pricing {
  billable: boolean;
  pricing_model: string;
  category: string;
}

export type StatusType = 'delivered' | 'read' | 'sent';