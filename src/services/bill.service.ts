import { httpClient } from '../utils/http-client.ts';
import type {
    Bill,
    BillParticipant,
    BillSummary,
    CreateBillRequest,
    SetPaymentRequest,
} from '../types/bill.ts';

export const billService = {
    list: async (): Promise<BillSummary[]> => {
        const response = await httpClient.get<BillSummary[]>('/bills');

        return response.data ?? [];
    },

    getById: async (billId: string): Promise<Bill> => {
        const response = await httpClient.get<Bill>(`/bills/${billId}`);

        return response.data!;
    },

    create: async (payload: CreateBillRequest): Promise<Bill> => {
        const response = await httpClient.post<Bill>('/bills', payload);

        return response.data!;
    },

    setParticipantPayment: async (
        billId: string,
        participantId: string,
        paid: boolean
    ): Promise<BillParticipant> => {
        const payload: SetPaymentRequest = { paid };

        const response = await httpClient.patch<BillParticipant>(
            `/bills/${billId}/participants/${participantId}/payment`,
            payload,
            { skipToast: true }
        );

        return response.data!;
    },
};
