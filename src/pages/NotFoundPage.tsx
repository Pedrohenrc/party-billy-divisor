import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.tsx';

export default function NotFoundPage() {
    return (
        <div className="page">
            <div className="empty-state">
                <h2>Essa página não existe</h2>
                <p>Deve ter clicado em algum link quebrado. Vamos te levar de volta.</p>

                <Link to="/">
                    <Button>Voltar para suas contas</Button>
                </Link>
            </div>
        </div>
    );
}
