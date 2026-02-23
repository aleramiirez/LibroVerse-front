import { useEffect, useState } from 'react';
import { getAllSagas, createSaga, updateSaga, deleteSaga, getSagaById } from '../services/sagaService';
import SagaDetailsModal from '../components/SagaDetailsModal';
import SagaCard from '../components/SagaCard';
import { Layers, Plus, X } from 'lucide-react';

const Sagas = () => {
    const [sagas, setSagas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSaga, setSelectedSaga] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newSagaName, setNewSagaName] = useState('');
    const [newSagaCover, setNewSagaCover] = useState('');

    const fetchSagas = async () => {
        try {
            const data = await getAllSagas();
            setSagas(data);
        } catch (error) {
            console.error(error);
            // alert("Error cargando sagas"); // Suppress initial load error if desired
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSagas();
    }, []);

    const handleCreateSaga = async (e) => {
        e.preventDefault();
        try {
            await createSaga({ name: newSagaName, coverUrl: newSagaCover });
            setIsCreateModalOpen(false);
            setNewSagaName('');
            setNewSagaCover('');
            fetchSagas();
        } catch (error) {
            alert("Error al crear la saga");
        }
    };

    const handleUpdateSaga = async (id, data) => {
        try {
            await updateSaga(id, data);
            fetchSagas();
            if (selectedSaga) setSelectedSaga({ ...selectedSaga, ...data });
        } catch (error) {
            console.error(error);
            alert("Error al actualizar la saga");
        }
    };

    const handleDeleteSaga = async (id) => {
        try {
            await deleteSaga(id);
            setSelectedSaga(null);
            fetchSagas();
        } catch (error) {
            console.error(error);
            alert("Error al eliminar la saga");
        }
    };

    if (loading) return <div className="flex items-center justify-center h-full"><p>Cargando sagas...</p></div>;

    return (
        <div className="container" style={{ position: 'relative', minHeight: '80vh' }}>
            <header className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                        <div style={{ padding: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', display: 'flex' }}>
                            <Layers size={28} style={{ color: 'var(--accent-primary)' }} />
                        </div>
                        Sagas
                    </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{sagas.length} colecciones</span>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn-primary desktop-only"
                        style={{ display: window.innerWidth > 768 ? 'flex' : 'none', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={20} /> Nueva Saga
                    </button>
                </div>
            </header>

            {/* Mobile FAB */}
            <button
                onClick={() => setIsCreateModalOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                    display: window.innerWidth <= 768 ? 'flex' : 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 50,
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                <Plus size={28} />
            </button>

            {sagas.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Layers size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <p>No tienes sagas registradas aún.</p>
                    <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary" style={{ marginTop: '1rem' }}>
                        Crear mi primera saga
                    </button>
                </div>
            ) : (
                <div className="responsive-grid">
                    {sagas.map(saga => (
                        <SagaCard
                            key={saga.id}
                            saga={saga}
                            onClick={async () => {
                                try {
                                    const fullSaga = await getSagaById(saga.id);
                                    setSelectedSaga(fullSaga);
                                } catch (error) {
                                    console.error("Error loading saga details:", error);
                                    alert("Error cargando detalles de la saga");
                                }
                            }}
                        />
                    ))}
                </div>
            )}

            <SagaDetailsModal
                isOpen={!!selectedSaga}
                onClose={() => setSelectedSaga(null)}
                saga={selectedSaga}
                onUpdate={handleUpdateSaga}
                onDelete={handleDeleteSaga}
            />

            {/* Create Saga Modal */}
            {isCreateModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        width: '100%',
                        maxWidth: '500px',
                        padding: '2rem',
                        boxShadow: 'var(--shadow-xl)',
                        border: '1px solid var(--border-color)',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Nueva Saga</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSaga}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nombre</label>
                                <input
                                    className="input-field"
                                    value={newSagaName}
                                    onChange={e => setNewSagaName(e.target.value)}
                                    placeholder="Ej. Harry Potter"
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>URL Portada (Opcional)</label>
                                <input
                                    className="input-field"
                                    value={newSagaCover}
                                    onChange={e => setNewSagaCover(e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-primary" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    Crear Saga
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sagas;
