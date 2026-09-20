import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import { useToast } from '../hooks/useToast.ts';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            await login({ email: email.trim(), password });

            const from = (location.state as { from?: string } | null)?.from ?? '/';

            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Não foi possível entrar');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <span className="brand-mark" aria-hidden="true">
                        <span className="brand-mark-half brand-mark-a" />
                        <span className="brand-mark-half brand-mark-b" />
                    </span>
                    <h1>Racha</h1>
                    <p>Fotografe a nota, divida com a galera e veja quem já acertou.</p>
                </div>

                <form className="stacked-form" onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        label="E-mail"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="voce@email.com"
                        autoComplete="email"
                        required
                    />

                    <Input
                        type="password"
                        label="Senha"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                    />

                    <Button type="submit" size="lg" loading={isSubmitting}>
                        Entrar
                    </Button>
                </form>

                <p className="auth-footer">
                    Ainda não tem conta? <Link to="/register">Criar agora</Link>
                </p>
            </div>
        </div>
    );
}
