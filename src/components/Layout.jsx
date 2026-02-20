import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) {
                setIsSidebarOpen(false); // Close mobile menu if switching to desktop
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
            {isMobile && (
                <header style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 40,
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <button
                        onClick={toggleSidebar}
                        style={{
                            color: 'var(--text-primary)',
                            display: 'flex',
                            padding: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--bg-tertiary)',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <Menu size={20} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h1 style={{
                            fontSize: '1.2rem',
                            margin: 0,
                            background: 'linear-gradient(to right, var(--accent-primary), var(--text-primary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: '700',
                            letterSpacing: '-0.5px'
                        }}>
                            LibroVerse
                        </h1>
                        <img
                            src="/LibroVerse-Logo.png"
                            alt="LibroVerse"
                            style={{
                                height: '32px',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                            }}
                        />
                    </div>
                </header>
            )}

            <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
                <Sidebar
                    isOpen={isSidebarOpen}
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                    closeMobileSidebar={() => setIsSidebarOpen(false)}
                />

                <main className="main-content" style={{
                    marginLeft: isMobile ? 0 : (isCollapsed ? '80px' : '260px'),
                }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
