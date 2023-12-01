import { MessageStatusEnum } from '../schemas/conversations.schema';

export class CreateConversationDto {
  _id: string;
  whatsapp_business_account_id: string;
  display_phone_number: string;
  phone_number_id: string;
  contacts: Contact[];
  messages: Message[];
}

export class MessageStatus {
  status: MessageStatusEnum;
  timestamp: number;
}

export class WhatsappMessageID {
  id: string;
  timestamp: number;
}

export class Contact {
  wa_id: string;
  profile_name: string;
}

export class Message {
  _id: string;
  from: string;
  wamid: WhatsappMessageID;
  timestamp: number;
  text: string;
  type: string;
  status: MessageStatus;
}
