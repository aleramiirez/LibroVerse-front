import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, LogOut, ChevronLeft, ChevronRight, X, Layers } from 'lucide-react';

const Sidebar = ({ isOpen, isCollapsed, toggleCollapse, closeMobileSidebar }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/biblioteca', label: 'Mi Colección', icon: BookOpen },
        { path: '/sagas', label: 'Mis Sagas', icon: Layers },
    ];

    const isActive = (path) => location.pathname === path;

    // Width based on state
    const sidebarWidth = isCollapsed ? '80px' : '260px';

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`mobile-overlay ${isOpen ? 'open' : ''}`}
                onClick={closeMobileSidebar}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 40,
                    display: isOpen ? 'block' : 'none',
                    backdropFilter: 'blur(2px)' // Glass effect
                }}
            />

            <aside
                className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isOpen ? 'mobile-open' : ''}`}
                style={{
                    width: window.innerWidth > 768 ? sidebarWidth : '260px',
                    height: '100vh',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRight: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 50,
                    transition: 'width 0.3s ease, transform 0.3s ease',
                    transform: window.innerWidth <= 768 && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
                    overflowX: 'hidden' // Prevent horizonatal scroll when collapsing
                }}
            >
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    minHeight: '80px'
                }}>
                    {!isCollapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                                src="/LibroVerse-Logo.png"
                                alt="LibroVerse"
                                style={{
                                    height: '40px',
                                    width: 'auto',
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                }}
                            />
                            <h1 style={{
                                color: 'var(--text-primary)',
                                fontSize: '1.4rem',
                                background: 'linear-gradient(to right, var(--accent-primary), var(--text-primary))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                margin: 0,
                                fontWeight: '700',
                                letterSpacing: '-0.5px'
                            }}>
                                LibroVerse
                            </h1>
                        </div>
                    )}

                    {/* Mobile Close Button */}
                    <button
                        onClick={closeMobileSidebar}
                        className="mobile-only"
                        style={{
                            display: window.innerWidth <= 768 ? 'block' : 'none',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        <X size={24} />
                    </button>

                    {/* Desktop Collapse Button */}
                    {window.innerWidth > 768 && isCollapsed && (
                        <img
                            src="/LibroVerse-Logo.png"
                            alt="LV"
                            style={{
                                height: '32px',
                                width: 'auto',
                                objectFit: 'contain',
                                marginLeft: '8px'
                            }}
                        />
                    )}
                </div>

                <nav style={{ flex: 1, padding: '1rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                                    <Link
                                        to={item.path}
                                        onClick={() => window.innerWidth <= 768 && closeMobileSidebar()}
                                        title={isCollapsed ? item.label : ''}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                                            gap: '12px',
                                            padding: '12px 16px',
                                            borderRadius: 'var(--radius-sm)',
                                            color: active ? 'white' : 'var(--text-secondary)',
                                            backgroundColor: active ? 'var(--accent-primary)' : 'transparent',
                                            fontWeight: active ? '600' : '400',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Icon size={20} style={{ flexShrink: 0 }} />
                                        {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    {/* Desktop Toggle Button */}
                    <button
                        onClick={toggleCollapse}
                        className="desktop-only"
                        style={{
                            display: window.innerWidth > 768 ? 'flex' : 'none',
                            alignItems: 'center',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            gap: '12px',
                            width: '100%',
                            padding: '12px',
                            color: 'var(--text-muted)',
                            marginBottom: '1rem'
                        }}
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        {!isCollapsed && <span>Contraer</span>}
                    </button>

                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        gap: '12px',
                        color: 'var(--text-muted)',
                        width: '100%',
                        padding: '12px',
                        textAlign: 'left'
                    }}>
                        <LogOut size={20} />
                        {!isCollapsed && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
