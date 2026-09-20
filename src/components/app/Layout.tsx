import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';
import { Button } from '../ui/Button.tsx';
import { HomeIcon, ListIcon, LogoutIcon } from '../ui/icons.tsx';
import { QuickScanFab } from './QuickScanFab.tsx';

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
                    <span className="brand-mark" aria-hidden="true">
                        <span className="brand-mark-half brand-mark-a" />
                        <span className="brand-mark-half brand-mark-b" />
                    </span>
                    <span className="brand-name">Racha</span>
                </Link>

                <nav className="app-nav app-nav-desktop">
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

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="app-logout-desktop"
                    >
                        Sair
                    </Button>
                </div>
            </header>

            <main className="app-main">
                <Outlet />
            </main>

            <QuickScanFab />

            <nav className="app-bottom-nav" aria-label="Navegação principal">
                <NavLink to="/" end className="app-bottom-nav-item">
                    <HomeIcon size={22} />
                    <span>Início</span>
                </NavLink>

                <NavLink to="/bills/new" className="app-bottom-nav-item">
                    <ListIcon size={22} />
                    <span>Nova conta</span>
                </NavLink>

                <button
                    type="button"
                    className="app-bottom-nav-item"
                    onClick={handleLogout}
                >
                    <LogoutIcon size={22} />
                    <span>Sair</span>
                </button>
            </nav>
        </div>
    );
}
