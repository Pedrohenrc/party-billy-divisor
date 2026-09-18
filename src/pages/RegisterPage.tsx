import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import { useToast } from '../hooks/useToast.ts';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (password.length < 8) {
            toast.error('A senha precisa ter no mínimo 8 caracteres');
            return;
        }

        setIsSubmitting(true);

        try {
            await register({ name: name.trim(), email: email.trim(), password });

            toast.success('Conta criada com sucesso!');
            navigate('/', { replace: true });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Não foi possível criar a conta');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <span className="brand-mark">B</span>
                    <h1>Criar conta</h1>
                    <p>Guarde suas contas e acompanhe os pagamentos.</p>
                </div>

                <form className="stacked-form" onSubmit={handleSubmit}>
                    <Input
                        label="Nome"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Seu nome"
                        autoComplete="name"
                        minLength={2}
                        required
                    />

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
                        placeholder="Mínimo de 8 caracteres"
                        autoComplete="new-password"
                        minLength={8}
                        hint="Use ao menos 8 caracteres."
                        required
                    />

                    <Button type="submit" size="lg" loading={isSubmitting}>
                        Criar conta
                    </Button>
                </form>

                <p className="auth-footer">
                    Já tem conta? <Link to="/login">Entrar</Link>
                </p>
            </div>
        </div>
    );
}
