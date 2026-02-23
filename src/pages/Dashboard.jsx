import { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/dashboardService';
import StatCard from '../components/StatCard';
import { Trophy, BookOpen, Clock } from 'lucide-react';

function Dashboard() {
    const [stats, setStats] = useState({
        currentBook: null,
        totalBooksFinished: 0,
        averageReadingDays: null,
        favoriteGenre: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("No se pudieron cargar las estadísticas", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-full"><p>Cargando tu biblioteca...</p></div>;

    const daysReading = stats.currentBook?.startDate
        ? Math.floor((new Date() - new Date(stats.currentBook.startDate)) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hola, Lector 👋</h2>
                <p style={{ color: 'var(--text-muted)' }}>Aquí tienes el resumen de tu actividad literaria.</p>
            </header>

            <section style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Tu Lectura Actual</h3>
                {stats.currentBook ? (
                    <div className="card hero-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: '2rem', alignItems: 'center', background: 'var(--card-bg)', backdropFilter: 'blur(10px)', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ flexShrink: 0, width: '150px', margin: '0 auto' }}>
                            <img
                                src={stats.currentBook.coverUrl || '/placeholder-cover.jpg'}
                                alt={stats.currentBook.title}
                                style={{ width: '100%', borderRadius: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', objectFit: 'cover', aspectRatio: '2/3' }}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: '250px' }}>
                            <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-color)', fontWeight: 'bold' }}>{stats.currentBook.title}</h3>
                            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>por {stats.currentBook.author?.name || 'Autor Desconocido'}</p>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '2rem', fontWeight: 'bold' }}>
                                <Clock size={20} />
                                <span>Llevas {daysReading} {daysReading === 1 ? 'día' : 'días'} leyendo este libro</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card hero-fallback" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--card-bg)', backdropFilter: 'blur(10px)', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text-color)' }}>¿Buscando tu próxima aventura? 🚀</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Ve a la biblioteca y elige tu siguiente historia.</p>
                    </div>
                )}
            </section>

            <section>
                <h3 style={{ marginBottom: '1.5rem' }}>Tus Estadísticas Reales</h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    <StatCard
                        icon={BookOpen}
                        label="Libros Terminados"
                        value={stats.totalBooksFinished}
                        color="#3b82f6"
                    />
                    <StatCard
                        icon={Clock}
                        label="Ritmo de Lectura"
                        value={stats.averageReadingDays ? `${stats.averageReadingDays} días/libro` : '-'}
                        color="#10b981"
                    />
                    <StatCard
                        icon={Trophy}
                        label="Género Favorito"
                        value={stats.favoriteGenre || 'N/A'}
                        color="#8b5cf6"
                    />
                </div>
            </section>
        </div>
    );
}

export default Dashboard;