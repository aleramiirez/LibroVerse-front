import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Mail, BookOpen } from 'lucide-react';

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Determine initial state based on the URL
    const [isLogin, setIsLogin] = useState(location.pathname === '/login' || location.pathname === '/');

    // Sync state if URL changes (e.g. via back button)
    useEffect(() => {
        if (location.pathname === '/login') setIsLogin(true);
        if (location.pathname === '/register') setIsLogin(false);
    }, [location.pathname]);

    const handleToggle = (e) => {
        e.preventDefault();
        const nextIsLogin = !isLogin;
        setIsLogin(nextIsLogin);
        // Cleanly update URL without triggering a full remount visually if possible
        navigate(nextIsLogin ? '/login' : '/register', { replace: true });
    };

    // --- Login State ---
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // --- Register State ---
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regError, setRegError] = useState('');
    const [regLoading, setRegLoading] = useState(false);

    const { login, register } = useAuth();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);
        try {
            await login(loginEmail, loginPassword);
            navigate('/');
        } catch (err) {
            setLoginError(err.response?.data?.message || 'Error al iniciar sesión. Comprueba tus credenciales.');
        } finally {
            setLoginLoading(false);
        }
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setRegError('');

        if (!validateEmail(regEmail)) {
            setRegError('Por favor, introduce un correo electrónico válido');
            return;
        }

        setRegLoading(true);
        try {
            await register(regName, regEmail, regPassword);
            navigate('/');
        } catch (err) {
            setRegError(err.response?.data?.message || 'Error al registrar la cuenta.');
        } finally {
            setRegLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: 'var(--bg-primary)',
            padding: '2rem'
        }}>
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '1000px',
                minHeight: '600px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'stretch'
            }}>

                {/* ---------- FORMS CONTAINER ---------- */}
                {/* Desktop: width 50% and translates. Mobile: 100% width. */}
                <div
                    className="auth-forms-container"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: window.innerWidth > 768 ? '50%' : '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '3rem',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
                        transform: window.innerWidth > 768
                            ? `translateX(${isLogin ? '0%' : '100%'})`
                            : 'translateX(0)',
                        backgroundColor: 'var(--bg-secondary)',
                        zIndex: 10
                    }}
                >
                    {/* Top Logo */}
                    <div style={{
                        position: 'absolute',
                        top: '2rem',
                        left: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <img
                            src="/LibroVerse-Logo.png"
                            alt="Logo"
                            style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div style={{ display: 'none', color: 'var(--accent-primary)' }}>
                            <BookOpen size={28} />
                        </div>
                        <span style={{
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            color: 'var(--text-primary)',
                            background: 'linear-gradient(to right, var(--accent-primary), var(--text-primary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            LibroVerse
                        </span>
                    </div>

                    <div style={{ maxWidth: '360px', width: '100%', margin: '0 auto', position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>

                        {/* --- LOGIN FORM --- */}
                        <div style={{
                            width: '100%',
                            position: 'absolute',
                            transition: 'all 0.5s ease-in-out',
                            opacity: isLogin ? 1 : 0,
                            visibility: isLogin ? 'visible' : 'hidden',
                            transform: `translateX(${isLogin ? '0' : '-20px'})`,
                            pointerEvents: isLogin ? 'auto' : 'none'
                        }}>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                    Log in
                                </h2>
                            </div>

                            {loginError && (
                                <div style={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                                    padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem',
                                    fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)'
                                }}>
                                    {loginError}
                                </div>
                            )}

                            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                    <input
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        placeholder="Correo electrónico"
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        required
                                    />
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                    <input
                                        type="password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        placeholder="Contraseña"
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loginLoading}
                                    className="auth-btn"
                                >
                                    {loginLoading ? 'Logging in...' : 'Log in'}
                                </button>
                            </form>

                            <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-primary)', textAlign: 'center' }}>
                                ¿Aún no tienes cuenta? <button onClick={handleToggle} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    onMouseOver={e => e.target.style.textDecoration = 'underline'} onMouseOut={e => e.target.style.textDecoration = 'none'}
                                >Regístrate</button>
                            </div>
                        </div>

                        {/* --- REGISTER FORM --- */}
                        <div style={{
                            width: '100%',
                            position: 'absolute',
                            transition: 'all 0.5s ease-in-out',
                            opacity: !isLogin ? 1 : 0,
                            visibility: !isLogin ? 'visible' : 'hidden',
                            transform: `translateX(${!isLogin ? '0' : '20px'})`,
                            pointerEvents: !isLogin ? 'auto' : 'none'
                        }}>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                    Sign up
                                </h2>
                            </div>

                            {regError && (
                                <div style={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                                    padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem',
                                    fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)'
                                }}>
                                    {regError}
                                </div>
                            )}

                            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                    <input
                                        type="text"
                                        value={regName}
                                        onChange={(e) => setRegName(e.target.value)}
                                        placeholder="Nombre"
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        required
                                    />
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                    <input
                                        type="email"
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        placeholder="Correo electrónico"
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        required
                                    />
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                    <input
                                        type="password"
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        placeholder="Contraseña"
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={regLoading}
                                    className="auth-btn"
                                    style={{ marginTop: '1rem' }}
                                >
                                    {regLoading ? 'Signing up...' : 'Sign up'}
                                </button>
                            </form>

                            <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-primary)', textAlign: 'center' }}>
                                ¿Ya tienes cuenta? <button onClick={handleToggle} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    onMouseOver={e => e.target.style.textDecoration = 'underline'} onMouseOut={e => e.target.style.textDecoration = 'none'}
                                >Inicia sesión</button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ---------- DECORATIVE PANEL ---------- */}
                <div
                    className="desktop-only auth-overlay-container"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        width: '50%',
                        height: '100%',
                        backgroundColor: 'var(--accent-primary)',
                        overflow: 'hidden',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
                        transform: `translateX(${isLogin ? '0%' : '-100%'})`,
                        zIndex: 20,
                        display: window.innerWidth > 768 ? 'block' : 'none',
                        boxShadow: isLogin ? '-10px 0 30px rgba(0,0,0,0.1)' : '10px 0 30px rgba(0,0,0,0.1)'
                    }}
                >
                    {/* Background shapes logic */}
                    <div style={{
                        position: 'absolute',
                        top: '-10%',
                        right: '-20%',
                        width: '150%',
                        height: '150%',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                        transform: 'rotate(45deg)',
                        transformOrigin: 'center'
                    }} />

                    <div style={{
                        position: 'absolute',
                        top: '-20%',
                        left: '10%',
                        width: '300px',
                        height: '1000px',
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderRadius: '150px',
                        transform: 'rotate(45deg)'
                    }} />

                    <div style={{
                        position: 'absolute',
                        top: '10%',
                        left: '40%',
                        width: '300px',
                        height: '1000px',
                        backgroundColor: 'rgba(0,0,0,0.15)',
                        borderRadius: '150px',
                        transform: 'rotate(45deg)'
                    }} />

                    <div style={{
                        position: 'absolute',
                        bottom: '-40%',
                        left: '-10%',
                        width: '400px',
                        height: '1000px',
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        borderRadius: '200px',
                        transform: 'rotate(45deg)'
                    }} />

                    {/* Welcome content that alternates with transitions */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                        color: 'white', textAlign: 'center', padding: '3rem',
                        transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
                        opacity: isLogin ? 1 : 0,
                        transform: `translateX(${isLogin ? '0' : '50px'})`,
                        pointerEvents: isLogin ? 'auto' : 'none'
                    }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>¡Bienvenido de Nuevo!</h2>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '80%' }}>
                            Para mantenerte conectado con nosotros, por favor inicia sesión con tu información personal
                        </p>
                    </div>

                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                        color: 'white', textAlign: 'center', padding: '3rem',
                        transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
                        opacity: !isLogin ? 1 : 0,
                        transform: `translateX(${!isLogin ? '0' : '-50px'})`,
                        pointerEvents: !isLogin ? 'auto' : 'none'
                    }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>¡Hola, Amigo!</h2>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '80%' }}>
                            Regístrate para comenzar tu aventura literaria con nosotros
                        </p>
                    </div>

                </div>
            </div>

            {/* Global style injection for hover/focus effects since inline is hard for pseudo-classes */}
            <style>{`
                .auth-btn {
                    width: 100%;
                    padding: 12px;
                    border-radius: 30px;
                    background-color: var(--accent-primary);
                    color: white;
                    font-weight: bold;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .auth-btn:hover:not(:disabled) {
                    filter: brightness(1.1);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .auth-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                @media (max-width: 768px) {
                    .desktop-only { display: none !important; }
                    .auth-forms-container { width: 100% !important; transform: none !important; }
                }
            `}</style>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 44px',
    borderRadius: '30px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
};

const handleFocus = (e) => {
    e.target.style.borderColor = 'var(--accent-primary)';
    e.target.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.2)';
};

const handleBlur = (e) => {
    e.target.style.borderColor = 'var(--border-color)';
    e.target.style.boxShadow = 'none';
};

export default AuthPage;
