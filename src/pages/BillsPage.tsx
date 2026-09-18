import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.tsx';
import { Loading } from '../components/ui/Loading.tsx';
import { useBills } from '../hooks/useBills.ts';
import { formatAmount, formatDate } from '../utils/utils.ts';

export default function BillsPage() {
    const { bills, isLoading, error, refetch } = useBills();

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Minhas contas</h1>
                    <p className="page-subtitle">
                        {bills.length > 0
                            ? `${bills.length} conta(s) salva(s)`
                            : 'Nenhuma conta salva ainda'}
                    </p>
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
                <div className="bill-grid">
                    {bills.map((bill) => {
                        const isSettled =
                            bill.participants_count > 0 && bill.paid_count === bill.participants_count;

                        const progress =
                            bill.participants_count > 0
                                ? (bill.paid_count / bill.participants_count) * 100
                                : 0;

                        return (
                            <Link className="bill-tile" to={`/bills/${bill.id}`} key={bill.id}>
                                <div className="bill-tile-header">
                                    <h3>{bill.title}</h3>

                                    <span
                                        className={isSettled ? 'badge badge-paid' : 'badge badge-pending'}
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
                                        {bill.paid_count}/{bill.participants_count} pagaram
                                    </span>

                                    <span>{formatDate(bill.created_at)}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
