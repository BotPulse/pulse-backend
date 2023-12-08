export interface BotInterface {
  getAnswer(user: string, input: string): Promise<string>;
  setPhoneNumber(phoneNumber: string): void;
  getPhoneNumber(): string;
}
