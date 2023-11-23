export class WhatsappCloudAPIRequest {
  messaging_product: string;
  to: string;
  type: string;
  template: Template;
}

export class Template {
  name: string;
  language: Language;
  components: Component[];
}

export class Component {
  type: string;
  parameters: Parameter[];
}

export class Parameter {
  type: string;
  text: string;
}

export class Language {
  code: string;
}
