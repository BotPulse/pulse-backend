import { Statuses } from '../interfaces/statuses';
import { Messages } from '../interfaces/messages';
export interface WebhookPayload {
  object: string;
  entry: Entry[];
}

export interface Entry {
  id: string;
  changes: Change[];
}

export interface Change {
  value: Value;
  field: string;
}

export interface Value {
  messaging_product: string;
  metadata: Metadata;
  contacts?: Contact[];
  errors?: any;
  messages?: Messages[];
  statuses?: Statuses[];
}

export interface Metadata {
  display_phone_number: string;
  phone_number_id: string;
}

export interface Contact {
  profile: Profile;
  wa_id: string;
}

export interface Profile {
  name: string;
}

export enum ValueKeys {
  MESSAGES = 'messages',
  STATUSES = 'statuses',
  ERRORS = 'errors',
}
