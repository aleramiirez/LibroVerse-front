import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Lock, Mail } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar la cuenta. Asegúrate de rellenar todos los campos correctamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px', margin: '1rem', borderRadius: '16px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        backgroundColor: 'var(--bg-tertiary)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <UserPlus size={32} style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>Crea tu Biblioteca</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Regístrate para comenzar a guardar tus libros</p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                        padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem',
                        fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nombre completo</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-input"
                                placeholder="Nombre Apellido"
                                style={{ paddingLeft: '40px', width: '100%' }}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="tu@email.com"
                                style={{ paddingLeft: '40px', width: '100%' }}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••"
                                style={{ paddingLeft: '40px', width: '100%' }}
                                required
                            />
                        </div>
                    </div>

                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={loading}
                        style={{ marginTop: '0.5rem', width: '100%', padding: '0.75rem' }}
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'bold' }}>Inicia sesión aquí</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
