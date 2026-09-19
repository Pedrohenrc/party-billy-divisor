import { Link, useParams } from 'react-router-dom';
import ParticipantRow from '../components/bill/ParticipantRow.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Loading } from '../components/ui/Loading.tsx';
import { useBill } from '../hooks/useBills.ts';
import { useToast } from '../hooks/useToast.ts';
import { formatAmount, formatDate } from '../utils/utils.ts';

export default function BillDetailPage() {
    const { billId } = useParams<{ billId: string }>();
    const { bill, isLoading, error, refetch, setParticipantPayment } = useBill(billId);
    const toast = useToast();

    async function handleTogglePaid(participantId: string, paid: boolean) {
        try {
            await setParticipantPayment(participantId, paid);

            toast.success(paid ? 'Pagamento confirmado' : 'Pagamento desmarcado');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Não foi possível atualizar');
        }
    }

    if (isLoading) {
        return <Loading full label="Carregando conta..." />;
    }

    if (error || !bill) {
        return (
            <div className="page">
                <div className="alert alert-error">
                    <p>{error ?? 'Conta não encontrada'}</p>

                    <div className="alert-actions">
                        <Button size="sm" variant="secondary" onClick={refetch}>
                            Tentar novamente
                        </Button>

                        <Link to="/">
                            <Button size="sm" variant="ghost">
                                Voltar
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const paidCount = bill.participants.filter((participant) => participant.paid).length;

    const pendingAmount = bill.participants
        .filter((participant) => !participant.paid)
        .reduce((sum, participant) => sum + Number(participant.amount_owed), 0);

    const participantNameById = new Map(
        bill.participants.map((participant) => [participant.id, participant.name])
    );

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <Link className="back-link" to="/">
                        ← Minhas contas
                    </Link>

                    <h1>{bill.title}</h1>

                    <p className="page-subtitle">{formatDate(bill.created_at)}</p>
                </div>

                <div className="summary-tiles">
                    <div className="summary-tile">
                        <span>Total</span>
                        <strong>R$ {formatAmount(bill.total_amount)}</strong>
                    </div>

                    <div className="summary-tile">
                        <span>Pagaram</span>
                        <strong>
                            {paidCount}/{bill.participants.length}
                        </strong>
                    </div>

                    <div className="summary-tile">
                        <span>Falta receber</span>
                        <strong>R$ {formatAmount(pendingAmount)}</strong>
                    </div>
                </div>
            </div>

            <div className="detail-grid">
                <section className="panel">
                    <h2>Participantes</h2>

                    <div className="participant-list">
                        {bill.participants.map((participant) => (
                            <ParticipantRow
                                key={participant.id}
                                participant={participant}
                                onTogglePaid={handleTogglePaid}
                            />
                        ))}
                    </div>
                </section>

                <section className="panel">
                    <h2>Itens</h2>

                    <div className="card-list">
                        {bill.products.map((product) => (
                            <div className="card" key={product.id}>
                                <div className="card-header">
                                    <div>
                                        <h3>{product.name}</h3>

                                        <p className="card-meta">
                                            {product.quantity} × R$ {formatAmount(product.unit_price)}
                                        </p>
                                    </div>

                                    <span className="card-price">
                                        R$ {formatAmount(product.total_price)}
                                    </span>
                                </div>

                                <div className="chip-list">
                                    {product.participant_ids.map((participantId) => (
                                        <span className="chip" key={participantId}>
                                            {participantNameById.get(participantId) ?? 'Removido'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
