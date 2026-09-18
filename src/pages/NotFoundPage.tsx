import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.tsx';

export default function NotFoundPage() {
    return (
        <div className="page">
            <div className="empty-state">
                <h2>Página não encontrada</h2>
                <p>O endereço acessado não existe.</p>

                <Link to="/">
                    <Button>Voltar para minhas contas</Button>
                </Link>
            </div>
        </div>
    );
}
