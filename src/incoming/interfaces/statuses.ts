export interface Statuses {
  id: string;
  status: StatusType;
  timestamp: number;
  recipient_id: string;
  conversation: Conversation;
  pricing: Pricing;
}

export interface Conversation {
  id: string;
  expiration_timestamp: number;
  origin: Origin;
}

export interface Origin {
  type: string;
}

export interface Pricing {
  billable: boolean;
  pricing_model: string;
  category: string;
}

export type StatusType = 'delivered' | 'read' | 'sent';
