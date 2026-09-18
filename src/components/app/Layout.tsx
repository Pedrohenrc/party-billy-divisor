import { Link, NavLink, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';
import { Button } from '../ui/Button.tsx';

export function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/login', { replace: true });
    }

    const initial = (user?.name ?? user?.email ?? '?').trim().charAt(0).toUpperCase();

    return (
        <div className="app-shell">
            <header className="app-topbar">
                <Link className="brand" to="/">
                    <span className="brand-mark">B</span>
                    <span className="brand-name">Billy</span>
                </Link>

                <nav className="app-nav">
                    <NavLink to="/" end>
                        Minhas contas
                    </NavLink>

                    <NavLink to="/bills/new">Nova conta</NavLink>
                </nav>

                <div className="app-user">
                    <span className="avatar" title={user?.email ?? ''}>
                        {initial}
                    </span>

                    <span className="app-user-name">{user?.name ?? user?.email}</span>

                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        Sair
                    </Button>
                </div>
            </header>

            <main className="app-main">
                <Outlet />
            </main>

            <footer className="app-footer">
                <span>Billy · divisor de contas</span>
            </footer>
        </div>
    );
}
