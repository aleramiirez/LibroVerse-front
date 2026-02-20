import { useRef, useEffect, useState } from 'react';
import { X, BookOpen, Layers, Edit2, Trash2, Save, Upload, Plus, CheckCircle } from 'lucide-react';
import { updateSaga, deleteSaga } from '../services/sagaService';
import { uploadImage } from '../services/api';

const SagaDetailsModal = ({ isOpen, onClose, saga, onUpdate, onDelete }) => {
    const modalRef = useRef();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [showCoverMenu, setShowCoverMenu] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            if (saga) {
                setFormData({
                    name: saga.name,
                    coverUrl: saga.coverUrl || ''
                });
            }
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, saga]);

    if (!isOpen || !saga) return null;

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const url = await uploadImage(file);
            setFormData(prev => ({ ...prev, coverUrl: url }));
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error al subir la imagen");
        }
    };

    const handleSave = async () => {
        if (!formData.name) return alert("El nombre es obligatorio");
        try {
            await onUpdate(saga.id, formData);
            setIsEditing(false);
        } catch (error) {
            alert("Error al actualizar la saga");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("¿Seguro que quieres eliminar esta saga?")) {
            try {
                await onDelete(saga.id);
                onClose();
            } catch (error) {
                alert("Error al eliminar la saga");
            }
        }
    };

    return (
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
            <div ref={modalRef} style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                width: '100%',
                maxWidth: '900px',
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)',
                position: 'relative',
                overflow: 'hidden'
            }}>

                {/* Header with Background Blur */}
                <div style={{
                    height: '200px',
                    position: 'relative',
                    flexShrink: 0
                }}>
                    {/* Background Image */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${formData.coverUrl || saga.coverUrl || 'https://via.placeholder.com/800x400'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(10px) brightness(0.5)'
                    }} />

                    {/* Content over background */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '2rem',
                        gap: '1.5rem',
                        zIndex: 1
                    }}>
                        {/* Cover Image */}
                        <div style={{
                            width: '120px',
                            height: '180px',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                            backgroundColor: 'var(--bg-tertiary)',
                            position: 'relative',
                            top: '40px' // Push it down a bit to overlap with body
                        }}>
                            <img
                                src={formData.coverUrl || saga.coverUrl || 'https://via.placeholder.com/150x200?text=No+Cover'}
                                alt="Cover"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {isEditing && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background-color 0.2s'
                                }}>
                                    {!showCoverMenu ? (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setShowCoverMenu(true); }}
                                            className="btn-primary"
                                            style={{
                                                borderRadius: '50%',
                                                width: '32px',
                                                height: '32px',
                                                padding: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                                            }}
                                            title="Cambiar portada"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    ) : (
                                        <div style={{
                                            backgroundColor: 'rgba(0,0,0,0.8)',
                                            borderRadius: 'var(--radius-sm)',
                                            padding: '0.5rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem',
                                            width: '95%',
                                            position: 'relative',
                                            alignItems: 'center'
                                        }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setShowCoverMenu(false); }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-8px',
                                                    right: '-8px',
                                                    background: 'red',
                                                    color: 'white',
                                                    borderRadius: '50%',
                                                    width: '20px',
                                                    height: '20px',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    zIndex: 10
                                                }}
                                            >
                                                <X size={12} />
                                            </button>
                                            <label className="btn-primary" style={{ cursor: 'pointer', padding: '4px', borderRadius: '50%' }}>
                                                <Upload size={16} />
                                                <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
                                            </label>
                                            <input
                                                className="input-field"
                                                value={formData.coverUrl}
                                                onChange={e => setFormData({ ...formData, coverUrl: e.target.value })}
                                                placeholder="URL..."
                                                style={{ width: '100%', fontSize: '0.7rem', padding: '2px 4px', height: 'auto' }}
                                                onClick={e => e.stopPropagation()}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Title & Info */}
                        <div style={{ flex: 1, marginBottom: '0.5rem' }}>
                            {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <input
                                        className="input-field"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Nombre de la Saga"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 style={{ color: 'white', fontSize: '2.5rem', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                        {saga.name}
                                    </h1>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                                        {saga.books ? saga.books.length : 0} Libros
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {isEditing ? (
                                <>
                                    <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Save size={18} /> Guardar
                                    </button>
                                    <button onClick={() => setIsEditing(false)} className="btn-primary" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setIsEditing(true)} className="btn-primary" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)' }}>
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={handleDelete} className="btn-primary" style={{ backgroundColor: '#ef4444' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Close Button */}
                    <button onClick={onClose} style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'rgba(0,0,0,0.5)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '8px',
                        cursor: 'pointer',
                        zIndex: 20
                    }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body: Books Grid */}
                <div style={{
                    flex: 1,
                    padding: '2rem',
                    paddingTop: '3rem', // Add space for the overlapped cover
                    overflowY: 'auto'
                }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        Libros en la Saga
                    </h3>

                    <div className="responsive-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.5rem' }}>
                        {saga.books?.map(book => (
                            <div key={book.id} style={{
                                backgroundColor: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-md)',
                                transition: 'transform 0.2s',
                                cursor: 'default',
                                position: 'relative'
                            }}>
                                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={book.coverUrl || 'https://via.placeholder.com/160x240?text=No+Cover'}
                                        alt={book.title || 'Libro'}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    {book.indexInSaga && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '8px',
                                            left: '8px',
                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                            color: 'white',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.85rem',
                                            backdropFilter: 'blur(4px)',
                                            fontWeight: 'bold'
                                        }}>
                                            #{book.indexInSaga}
                                        </div>
                                    )}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '8px',
                                        right: '8px',
                                        backgroundColor: book.status === 'FINISHED' ? '#10b981' : book.status === 'READING' ? '#f59e0b' : 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        padding: '4px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {book.status === 'FINISHED' ? <CheckCircle size={16} /> : <BookOpen size={16} />}
                                    </div>
                                </div>
                                <div style={{ padding: '0.75rem' }}>
                                    <h4 style={{
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        marginBottom: '0.25rem',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }} title={book.title}>
                                        {book.title}
                                    </h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {book.author?.name || 'Autor desconocido'}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Placeholder for "Add Book" visual if wanted later */}
                        {/* <div style={{
                            height: '300px',
                            border: '2px dashed var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            cursor: 'pointer'
                        }}>
                            <Plus size={32} />
                            <span>Añadir Libro</span>
                        </div> */}
                    </div>

                    {(!saga.books || saga.books.length === 0) && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <BookOpen size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                            <p>No hay libros asociados a esta saga aún.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SagaDetailsModal;
