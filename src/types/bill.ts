export interface BillParticipant {
    id: string;
    name: string;
    amount_owed: string;
    paid: boolean;
}

export interface BillProduct {
    id: string;
    name: string;
    quantity: number;
    unit_price: string;
    total_price: string;
    participant_ids: string[];
}

export interface Bill {
    id: string;
    title: string;
    total_amount: string;
    created_at?: string | null;
    products: BillProduct[];
    participants: BillParticipant[];
}

export interface BillSummary {
    id: string;
    title: string;
    total_amount: string;
    created_at?: string | null;
    participants_count: number;
    paid_count: number;
}

export interface CreateBillProductRequest {
    name: string;
    quantity: number;
    unit_price: number;
    participant_names: string[];
}

export interface CreateBillRequest {
    title: string;
    products: CreateBillProductRequest[];
}

export interface SetPaymentRequest {
    paid: boolean;
}

export interface ScannedProduct {
    name: string;
    quantity: number;
    unit_price: string;
}
