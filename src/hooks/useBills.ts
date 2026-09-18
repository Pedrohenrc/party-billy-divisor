import { useCallback, useEffect, useState } from 'react';
import { billService } from '../services/bill.service.ts';
import type { Bill, BillSummary, CreateBillRequest } from '../types/bill.ts';

export function useBills() {
    const [bills, setBills] = useState<BillSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        billService
            .list()
            .then((data) => {
                if (!cancelled) {
                    setBills(data);
                    setError(null);
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Não foi possível carregar suas contas'
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [reloadKey]);

    const refetch = useCallback(() => {
        setIsLoading(true);
        setError(null);
        setReloadKey((current) => current + 1);
    }, []);

    return { bills, isLoading, error, refetch };
}

export function useBill(billId: string | undefined) {
    const [bill, setBill] = useState<Bill | null>(null);
    const [isLoading, setIsLoading] = useState(!!billId);
    const [error, setError] = useState<string | null>(
        billId ? null : 'Conta não encontrada'
    );
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!billId) {
            return;
        }

        let cancelled = false;

        billService
            .getById(billId)
            .then((data) => {
                if (!cancelled) {
                    setBill(data);
                    setError(null);
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setError(
                        err instanceof Error ? err.message : 'Não foi possível carregar a conta'
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [billId, reloadKey]);

    const refetch = useCallback(() => {
        if (!billId) {
            return;
        }

        setIsLoading(true);
        setError(null);
        setReloadKey((current) => current + 1);
    }, [billId]);

    const setParticipantPayment = useCallback(
        async (participantId: string, paid: boolean) => {
            if (!billId) {
                return;
            }

            const updated = await billService.setParticipantPayment(billId, participantId, paid);

            setBill((current) =>
                current
                    ? {
                          ...current,
                          participants: current.participants.map((participant) =>
                              participant.id === updated.id ? updated : participant
                          ),
                      }
                    : current
            );
        },
        [billId]
    );

    return { bill, isLoading, error, refetch, setParticipantPayment };
}

export function useCreateBill() {
    const [isCreating, setIsCreating] = useState(false);

    const createBill = useCallback(async (payload: CreateBillRequest): Promise<Bill> => {
        setIsCreating(true);

        try {
            return await billService.create(payload);
        } finally {
            setIsCreating(false);
        }
    }, []);

    return { createBill, isCreating };
}
