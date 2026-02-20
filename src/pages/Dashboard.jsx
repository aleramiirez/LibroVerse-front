import { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/dashboardService';
import StatCard from '../components/StatCard';
import BookCard from '../components/BookCard';
import { Trophy, BookOpen, Clock } from 'lucide-react';

function Dashboard() {
    const [stats, setStats] = useState({
        currentBook: null,
        booksReadThisYear: 0,
        nextBookInSaga: null
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

    return (
        <div className="container">
            <header style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hola, Lector 👋</h2>
                <p>Aquí tienes el resumen de tu actividad literaria.</p>
            </header>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard
                    icon={Trophy}
                    label="Reto Anual"
                    value={stats.booksReadThisYear}
                    color="#f59e0b"
                />
                <StatCard
                    icon={BookOpen}
                    label="Libros en total"
                    value="42"
                    color="#3b82f6"
                />
                <StatCard
                    icon={Clock}
                    label="Tiempo de lectura"
                    value="120h"
                    color="#10b981"
                />
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <section>
                    <h3 style={{ marginBottom: '1.5rem' }}>📖 Leyendo ahora</h3>
                    {stats.currentBook ? (
                        <div style={{ height: '300px' }}>
                            <BookCard
                                title={stats.currentBook.title}
                                author={stats.currentBook.author}
                                coverUrl={stats.currentBook.coverUrl}
                                genres={stats.currentBook.genres}
                            />
                        </div>
                    ) : (
                        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <p>No estás leyendo ningún libro ahora mismo.</p>
                        </div>
                    )}
                </section>

                <section>
                    <h3 style={{ marginBottom: '1.5rem' }}>⏭️ Siguiente en la lista</h3>
                    {stats.nextBookInSaga ? (
                        <div style={{ height: '300px' }}>
                            <BookCard
                                title={stats.nextBookInSaga.title}
                                author={stats.nextBookInSaga.author}
                                // coverUrl={stats.nextBookInSaga.coverUrl}
                                genres={stats.nextBookInSaga.genres}
                            />
                        </div>
                    ) : (
                        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <p>No hay próximos libros pendientes.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Dashboard;