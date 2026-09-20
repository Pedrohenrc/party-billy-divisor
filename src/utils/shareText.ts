import type { Bill } from '../types/bill.ts';
import type { SplitSuccess } from '../types/split.ts';
import { formatDate, formatMoney, splitEvenly } from './utils.ts';

export interface ShareItem {
    label: string;
    value: number;
}

export interface ShareParticipantData {
    name: string;
    total: number;
    paid?: boolean;
    items: ShareItem[];
}

export interface ShareBillData {
    title: string;
    createdAt?: string | null;
    totalAmount: number;
    participants: ShareParticipantData[];
}

export function buildBillShareData(bill: Bill): ShareBillData {
    const participants: ShareParticipantData[] = bill.participants.map((participant) => {
        const items: ShareItem[] = [];

        for (const product of bill.products) {
            const participantIndex = product.participant_ids.indexOf(participant.id);

            if (participantIndex === -1) {
                continue;
            }

            const shares = splitEvenly(Number(product.total_price), product.participant_ids.length);

            items.push({
                label: `${product.name} ÷ ${product.participant_ids.length}`,
                value: shares[participantIndex],
            });
        }

        return {
            name: participant.name,
            total: Number(participant.amount_owed),
            paid: participant.paid,
            items,
        };
    });

    return {
        title: bill.title,
        createdAt: bill.created_at,
        totalAmount: Number(bill.total_amount),
        participants,
    };
}

export function buildSplitShareData(title: string, result: SplitSuccess): ShareBillData {
    const trimmedTitle = title.trim();

    return {
        title: trimmedTitle.length > 0 ? trimmedTitle : 'Nova conta',
        totalAmount: result.totalBill,
        participants: result.splits.map((split) => ({
            name: split.personName,
            total: split.total,
            items: split.items.map((item) => ({
                label: `${item.productName} ÷ ${item.participantsCount}`,
                value: item.shareValue,
            })),
        })),
    };
}

export function formatShareText(data: ShareBillData): string {
    const lines: string[] = [];
    const separator = '—'.repeat(24);

    lines.push(`*${data.title}*`);

    const dateLabel = formatDate(data.createdAt);

    if (dateLabel) {
        lines.push(dateLabel);
    }

    lines.push('');
    lines.push(`Total da conta: *R$ ${formatMoney(data.totalAmount)}*`);
    lines.push(separator);

    data.participants.forEach((participant, index) => {
        lines.push(`*${participant.name}* - R$ ${formatMoney(participant.total)}`);

        if (participant.items.length > 0) {
            for (const item of participant.items) {
                lines.push(`  - ${item.label} = R$ ${formatMoney(item.value)}`);
            }
        } else {
            lines.push('  - Nenhum item vinculado');
        }

        if (participant.paid !== undefined) {
            lines.push(
                `  Status: ${participant.paid ? '✅ Pago' : '⏳ Pendente'}`
            );
        }

        if (index < data.participants.length - 1) {
            lines.push('');
        }
    });

    lines.push(separator);
    lines.push('_Gerado com https://rachabilly.vercel.app/_');

    return lines.join('\n');
}
