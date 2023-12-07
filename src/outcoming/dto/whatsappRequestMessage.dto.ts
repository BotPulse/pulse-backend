export class WhatsappRequestMessage {
  messaging_product: string;
  recipient_type: string;
  to: string;
  from: string;
  type: string;
  text: Text;
}

export class Text {
  preview_url: boolean;
  body: string;
}
