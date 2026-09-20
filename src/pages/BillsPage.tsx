import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.tsx';
import { Loading } from '../components/ui/Loading.tsx';
import { CheckCircleIcon, ClockIcon } from '../components/ui/icons.tsx';
import { useBills } from '../hooks/useBills.ts';
import type { BillSummary } from '../types/bill.ts';
import { formatAmount, formatDate } from '../utils/utils.ts';

type TabKey = 'pending' | 'settled';

export default function BillsPage() {
    const { bills, isLoading, error, refetch } = useBills();
    const [tab, setTab] = useState<TabKey>('pending');

    const { pending, settled } = useMemo(() => {
        const pending: BillSummary[] = [];
        const settled: BillSummary[] = [];

        for (const bill of bills) {
            const isSettled =
                bill.participants_count > 0 && bill.paid_count === bill.participants_count;

            (isSettled ? settled : pending).push(bill);
        }

        return { pending, settled };
    }, [bills]);

    const visible = tab === 'pending' ? pending : settled;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Suas contas</h1>
                    <p className="page-subtitle">
                        {bills.length > 0
                            ? `${bills.length} conta${bills.length > 1 ? 's' : ''} ao todo`
                            : 'Nenhuma conta por aqui ainda'}
                    </p>
                </div>

                <Link to="/bills/new" className="hide-on-mobile">
                    <Button size="lg">Nova conta</Button>
                </Link>
            </div>

            {isLoading && <Loading label="Carregando suas contas..." />}

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
                    <h2>Bora dividir a primeira conta?</h2>

                    <p>
                        Fotografe a nota com o botão de escanear ou cadastre as pessoas e os
                        itens na mão. Depois é só ir marcando quem já acertou.
                    </p>

                    <Link to="/bills/new">
                        <Button>Criar conta</Button>
                    </Link>
                </div>
            )}

            {!isLoading && !error && bills.length > 0 && (
                <>
                    <div className="tabs" role="tablist">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={tab === 'pending'}
                            className={tab === 'pending' ? 'tab is-active' : 'tab'}
                            onClick={() => setTab('pending')}
                        >
                            <ClockIcon size={16} />
                            Pendentes
                            <span className="tab-count">{pending.length}</span>
                        </button>

                        <button
                            type="button"
                            role="tab"
                            aria-selected={tab === 'settled'}
                            className={tab === 'settled' ? 'tab is-active' : 'tab'}
                            onClick={() => setTab('settled')}
                        >
                            <CheckCircleIcon size={16} />
                            Quitadas
                            <span className="tab-count">{settled.length}</span>
                        </button>
                    </div>

                    {visible.length === 0 ? (
                        <div className="empty-state empty-state-compact">
                            <p>
                                {tab === 'pending'
                                    ? 'Nenhuma conta pendente. Tudo certo por aqui! 🎉'
                                    : 'Nenhuma conta quitada ainda.'}
                            </p>
                        </div>
                    ) : (
                        <div className="bill-grid">
                            {visible.map((bill) => {
                                const isSettled =
                                    bill.participants_count > 0 &&
                                    bill.paid_count === bill.participants_count;

                                const progress =
                                    bill.participants_count > 0
                                        ? (bill.paid_count / bill.participants_count) * 100
                                        : 0;

                                return (
                                    <Link className="bill-tile" to={`/bills/${bill.id}`} key={bill.id}>
                                        <div className="bill-tile-header">
                                            <h3>{bill.title}</h3>

                                            <span
                                                className={
                                                    isSettled ? 'badge badge-paid' : 'badge badge-pending'
                                                }
                                            >
                                                {isSettled ? 'Quitada' : 'Em aberto'}
                                            </span>
                                        </div>

                                        <p className="bill-tile-total">R$ {formatAmount(bill.total_amount)}</p>

                                        <div className="progress">
                                            <div className="progress-bar" style={{ width: `${progress}%` }} />
                                        </div>

                                        <div className="bill-tile-footer">
                                            <span>
                                                {bill.paid_count}/{bill.participants_count} acertaram
                                            </span>

                                            <span>{formatDate(bill.created_at)}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
