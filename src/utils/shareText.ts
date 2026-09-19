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
    /** undefined quando ainda é só uma prévia (conta não salva) */
    paid?: boolean;
    items: ShareItem[];
}

export interface ShareBillData {
    title: string;
    createdAt?: string | null;
    totalAmount: number;
    participants: ShareParticipantData[];
}

/** Monta os dados de compartilhamento a partir de uma conta já salva. */
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

/** Monta os dados de compartilhamento a partir da prévia de divisão (conta ainda não salva). */
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

/** Gera o texto formatado, pensado para ficar legível quando colado no WhatsApp. */
export function formatShareText(data: ShareBillData): string {
    const lines: string[] = [];

    lines.push(`🧾 *${data.title}*`);

    const dateLabel = formatDate(data.createdAt);

    if (dateLabel) {
        lines.push(`📅 ${dateLabel}`);
    }

    lines.push('');
    lines.push(`💵 Total da conta: *R$ ${formatMoney(data.totalAmount)}*`);

    for (const participant of data.participants) {
        lines.push('');
        lines.push(`👤 *${participant.name}* — R$ ${formatMoney(participant.total)}`);

        if (participant.items.length > 0) {
            for (const item of participant.items) {
                lines.push(`   • ${item.label} = R$ ${formatMoney(item.value)}`);
            }
        } else {
            lines.push('   • Nenhum item vinculado');
        }

        if (participant.paid !== undefined) {
            lines.push(participant.paid ? '   ✅ Pago' : '   ⏳ Pendente');
        }
    }

    lines.push('');
    lines.push('_Feito com Party Billy Divisor 🎉_');

    return lines.join('\n');
}
