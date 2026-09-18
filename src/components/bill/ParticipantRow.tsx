import { useState } from 'react';
import type { BillParticipant } from '../../types/bill.ts';
import { formatAmount } from '../../utils/utils.ts';

interface ParticipantRowProps {
    participant: BillParticipant;
    onTogglePaid: (participantId: string, paid: boolean) => Promise<void>;
}

export default function ParticipantRow({ participant, onTogglePaid }: ParticipantRowProps) {
    const [isSaving, setIsSaving] = useState(false);

    async function handleToggle() {
        setIsSaving(true);

        try {
            await onTogglePaid(participant.id, !participant.paid);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className={participant.paid ? 'participant is-paid' : 'participant'}>
            <label className="participant-main">
                <input
                    type="checkbox"
                    checked={participant.paid}
                    disabled={isSaving}
                    onChange={handleToggle}
                />

                <span className="participant-name">{participant.name}</span>
            </label>

            <div className="participant-side">
                <span className="participant-amount">R$ {formatAmount(participant.amount_owed)}</span>

                <span className={participant.paid ? 'badge badge-paid' : 'badge badge-pending'}>
                    {participant.paid ? 'Pago' : 'Pendente'}
                </span>
            </div>
        </div>
    );
}
