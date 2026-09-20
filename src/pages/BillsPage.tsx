import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Button } from '../components/ui/Button.tsx';
import { Loading } from '../components/ui/Loading.tsx';
import { useBills } from '../hooks/useBills.ts';
import { formatAmount, formatDate } from '../utils/utils.ts';

export default function BillsPage() {
    const { bills, isLoading, error, refetch } = useBills();
    const [view, setView] = useState<'pending' | 'paid'>('pending');

    const groupedBills = useMemo(
        () => ({
            pending: bills.filter(
                (bill) => bill.participants_count === 0 || bill.paid_count < bill.participants_count
            ),
            paid: bills.filter(
                (bill) => bill.participants_count > 0 && bill.paid_count === bill.participants_count
            ),
        }),
        [bills]
    );

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Minhas contas</h1>
                    <p className="page-subtitle">Acompanhe o que falta receber e o que já foi resolvido.</p>
                </div>

                <Link to="/bills/new">
                    <Button size="lg">Nova conta</Button>
                </Link>
            </div>

            {isLoading && <Loading label="Carregando contas..." />}

            {!isLoading && error && (
                <div className="alert alert-error">
                    <p>{error}</p>

                    <Button size="sm" variant="secondary" onClick={refetch}>
                        Tentar novamente
                    </Button>
                </div>
            )}

            {!isLoading && !error && bills.length === 0 && (
                <div className="empty-state">
                    <h2>Comece dividindo sua primeira conta</h2>

                    <p>
                        Cadastre as pessoas, os itens, marque quem dividiu o quê e salve. Depois é só
                        ir marcando quem já pagou.
                    </p>

                    <Link to="/bills/new">
                        <Button>Criar conta</Button>
                    </Link>
                </div>
            )}

            {!isLoading && !error && bills.length > 0 && (
                <>
                    <div className="bill-tabs" role="tablist" aria-label="Status das contas">
                        <button className={view === 'pending' ? 'is-active' : ''} onClick={() => setView('pending')}>
                            Em aberto <span>{groupedBills.pending.length}</span>
                        </button>
                        <button className={view === 'paid' ? 'is-active' : ''} onClick={() => setView('paid')}>
                            Quitadas <span>{groupedBills.paid.length}</span>
                        </button>
                    </div>

                    <section className="bill-section">
                        <div className="section-heading">
                            <div>
                                <p className="eyebrow">{view === 'pending' ? 'A receber' : 'Histórico'}</p>
                                <h2>{view === 'pending' ? 'Contas em aberto' : 'Contas quitadas'}</h2>
                            </div>
                            <span className="section-count">{groupedBills[view].length}</span>
                        </div>

                        {groupedBills[view].length === 0 ? (
                            <div className="section-empty">
                                {view === 'pending' ? 'Tudo certo por aqui.' : 'Nenhuma conta quitada ainda.'}
                            </div>
                        ) : (
                            <div className="bill-grid">
                                {groupedBills[view].map((bill) => {
                                    const progress = bill.participants_count > 0
                                        ? (bill.paid_count / bill.participants_count) * 100
                                        : 0;
                                    const isSettled = view === 'paid';

                                    return (
                                        <Link className="bill-tile" to={`/bills/${bill.id}`} key={bill.id}>
                                            <div className="bill-tile-header">
                                                <h3>{bill.title}</h3>
                                                <span className={isSettled ? 'badge badge-paid' : 'badge badge-pending'}>
                                                    {isSettled ? 'Quitada' : 'Em aberto'}
                                                </span>
                                            </div>
                                            <p className="bill-tile-total">R$ {formatAmount(bill.total_amount)}</p>
                                            <div className="progress"><div className="progress-bar" style={{ width: `${progress}%` }} /></div>
                                            <div className="bill-tile-footer">
                                                <span>{bill.paid_count}/{bill.participants_count} pagaram</span>
                                                <span>{formatDate(bill.created_at)}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}
