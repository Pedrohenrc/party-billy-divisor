import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';

export function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = window.localStorage.getItem('billy-theme');
        return savedTheme === 'dark' ? 'dark' : 'light';
    });

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        window.localStorage.setItem('billy-theme', theme);
    }, [theme]);

    function handleLogout() {
        logout();
        navigate('/login', { replace: true });
    }

    const initial = (user?.name ?? user?.email ?? '?').trim().charAt(0).toUpperCase();

    return (
        <div className="app-shell">
            <header className="app-topbar">
                <Link className="brand" to="/">
                    <span className="brand-name">Billy</span>
                </Link>

                <nav className="app-nav">
                    <NavLink to="/" end>
                        Minhas contas
                    </NavLink>

                    <NavLink to="/bills/new">Nova conta</NavLink>
                </nav>

                <div className="profile-menu">
                    <button
                        className="profile-trigger"
                        type="button"
                        aria-expanded={isProfileOpen}
                        onClick={() => setIsProfileOpen((current) => !current)}
                    >
                        <span className="avatar" title={user?.email ?? ''}>{initial}</span>
                        <span className="app-user-name">{user?.name ?? user?.email}</span>
                        <span className="profile-chevron" aria-hidden="true">⌄</span>
                    </button>

                    {isProfileOpen && (
                        <div className="profile-dropdown">
                            <div className="profile-dropdown-user">
                                <strong>{user?.name ?? user?.email}</strong>
                                <span>{user?.email}</span>
                            </div>
                            <button
                                className="profile-dropdown-action"
                                type="button"
                                onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
                            >
                                <span>{theme === 'light' ? '☾' : '☀'}</span>
                                {theme === 'light' ? 'Modo escuro' : 'Modo claro'}
                            </button>
                            <button className="profile-dropdown-action is-danger" type="button" onClick={handleLogout}>
                                <span>↪</span>
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="app-main">
                <Outlet />
            </main>

            <Link className="scan-fab" to="/bills/new?scan=1" aria-label="Escanear nota fiscal">
                <span className="scan-fab-icon">+</span>
                <span>Escanear nota</span>
            </Link>

            <nav className="mobile-nav" aria-label="Navegação principal">
                <NavLink to="/" end>
                    <span className="mobile-nav-icon">⌂</span>
                    <span>Início</span>
                </NavLink>
                <NavLink to="/bills/new">
                    <span className="mobile-nav-icon">＋</span>
                    <span>Nova conta</span>
                </NavLink>
            </nav>

            <footer className="app-footer">
                <span>Billy · divisão simples</span>
            </footer>
        </div>
    );
}
