export class WhatsappCloudAPIResponse {
  messaging_product: string;
  contacts: Contact[];
  messages: Message[];
}

export class Contact {
  input: string;
  wa_id: string;
}

export class Message {
  id: string;
}
