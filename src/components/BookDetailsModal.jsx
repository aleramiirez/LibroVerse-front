import { useState, useEffect } from 'react';
import { X, Edit2, Trash2, Save, Star, Calendar, BookOpen, Layers, Hash, Tag, Download, CheckCircle, Upload } from 'lucide-react';
import { uploadImage } from '../services/api';
import { getAllSagas } from '../services/sagaService';

const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'READING', label: 'Leyendo' },
    { value: 'FINISHED', label: 'Terminado' }
];

const BookDetailsModal = ({ isOpen, onClose, book, onUpdate, onDelete, onOpenSaga }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [sagas, setSagas] = useState([]);
    const [showCoverMenu, setShowCoverMenu] = useState(false);

    useEffect(() => {
        if (isOpen) {
            getAllSagas().then(setSagas).catch(console.error);
        }
    }, [isOpen]);

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                author: typeof book.author === 'object' ? book.author?.name || '' : book.author || '',
                status: book.status,
                rating: book.rating || 0,
                coverUrl: book.coverUrl || '',
                saga: book.saga ? book.saga.id : '', // Store ID for selection
                indexInSaga: book.indexInSaga || '',
                genres: book.genres ? book.genres.map(g => g.name || g).join(', ') : '',
                startDate: book.startDate || '',
                endDate: book.endDate || ''
            });
            setIsEditing(false);
        }
    }, [book, isOpen]);

    if (!isOpen || !book) return null;

    const handleSave = async () => {
        try {
            // 1. Buscamos la saga seleccionada (si la hay)
            const selectedSaga = sagas.find(s => s.id === parseInt(formData.saga));

            // 2. Construimos el JSON pieza a pieza (sin ...formData) para evitar que Java rechace campos ocultos
            const payload = {
                title: formData.title,
                status: formData.status,
                rating: formData.rating ? parseInt(formData.rating) : 0,
                coverUrl: formData.coverUrl || null,

                // Fechas saneadas
                startDate: formData.startDate || null,
                endDate: formData.endDate || null,

                // Relaciones mapeadas exactamente como las espera tu entidad Book.java
                author: formData.author ? { name: formData.author } : null,
                saga: selectedSaga ? { id: selectedSaga.id, name: selectedSaga.name } : null,
                indexInSaga: formData.indexInSaga ? parseInt(formData.indexInSaga) : null,

                // Géneros limpios
                genres: formData.genres
                    ? formData.genres.split(',').map(g => g.trim()).filter(g => g !== "").map(name => ({ name }))
                    : []
            };

            // 3. Enviamos los datos
            await onUpdate(book.id, payload);
            setIsEditing(false);
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al preparar los datos para guardar.");
        }
    };

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

    const handleDelete = async () => {
        if (window.confirm('¿Seguro que quieres eliminar este libro?')) {
            await onDelete(book.id);
            onClose();
        }
    };

    // Helper to get author name safely
    const authorName = typeof book.author === 'object' ? book.author?.name : book.author;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)'
            }} onClick={e => e.stopPropagation()}>

                {/* Close Button (Top right of modal) */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        zIndex: 20,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderRadius: '50%',
                        padding: '8px',
                        color: 'white',
                        backdropFilter: 'blur(4px)',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <X size={20} />
                </button>

                {/* Left Side: Cover */}
                <div style={{
                    flex: window.innerWidth <= 768 ? '0 0 200px' : '0 0 350px',
                    position: 'relative',
                    backgroundColor: 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {/* Blurred Background */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${formData.coverUrl || book.coverUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(20px) brightness(0.4)',
                        transform: 'scale(1.1)'
                    }} />

                    {/* Actual Cover */}
                    <div style={{ position: 'relative', width: '180px', height: '270px', zIndex: 1 }}>
                        <img
                            src={formData.coverUrl || book.coverUrl || 'https://via.placeholder.com/200x300?text=No+Cover'}
                            alt="Cover"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-sm)',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                            }}
                        />

                        {/* Edit Overlay */}
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
                                            width: '40px',
                                            height: '40px',
                                            padding: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                                        }}
                                        title="Cambiar portada"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                ) : (
                                    <div style={{
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.75rem',
                                        width: '90%',
                                        position: 'relative'
                                    }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setShowCoverMenu(false); }}
                                            style={{
                                                position: 'absolute',
                                                top: '-10px',
                                                right: '-10px',
                                                background: 'red',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                        <label className="btn-primary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem', width: '100%' }}>
                                            <Upload size={16} /> Subir Imagen
                                            <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
                                        </label>
                                        <input
                                            className="input-field"
                                            value={formData.coverUrl}
                                            onChange={e => setFormData({ ...formData, coverUrl: e.target.value })}
                                            placeholder="Pegar URL..."
                                            style={{ fontSize: '0.8rem', padding: '0.5rem', width: '100%' }}
                                            onClick={e => e.stopPropagation()}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Info & Edit */}
                <div style={{
                    flex: 1,
                    padding: '2rem',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                }}>
                    {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Editar Libro</h3>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Título</label>
                                <input
                                    className="input-field"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Autor</label>
                                <input
                                    className="input-field"
                                    value={formData.author}
                                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                                />
                            </div>

                            {/* Saga Selection */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Saga</label>
                                    <select
                                        className="input-field"
                                        value={formData.saga}
                                        onChange={e => setFormData({ ...formData, saga: e.target.value })}
                                    >
                                        <option value="">-- Ninguna --</option>
                                        {sagas.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}># en Saga</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={formData.indexInSaga}
                                        onChange={e => setFormData({ ...formData, indexInSaga: e.target.value })}
                                        placeholder="Ej. 1"
                                    />
                                </div>
                            </div>

                            {/* Genres */}
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Géneros (separados por coma)</label>
                                <input
                                    className="input-field"
                                    value={formData.genres}
                                    onChange={e => setFormData({ ...formData, genres: e.target.value })}
                                    placeholder="Fantasía, Aventura, Magia..."
                                />
                            </div>

                            {/* Dates */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Fecha Inicio</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Fecha Fin</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Estado</label>
                                <select
                                    className="input-field"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    {STATUS_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Valoración</label>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            style={{ color: star <= formData.rating ? '#f59e0b' : 'var(--text-muted)' }}
                                        >
                                            <Star size={24} fill={star <= formData.rating ? '#f59e0b' : 'none'} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '1.5rem', paddingRight: '2rem' }}> {/* Padding right for close button space */}
                                <span style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    borderRadius: '16px',
                                    backgroundColor: 'var(--bg-tertiary)',
                                    color: 'var(--accent-primary)',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    marginBottom: '1rem'
                                }}>
                                    {STATUS_OPTIONS.find(s => s.value === book.status)?.label || book.status}
                                </span>

                                <h2 style={{ fontSize: '1.8rem', lineHeight: '1.2', marginBottom: '0.5rem' }}>{book.title}</h2>
                                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    {authorName || 'Autor desconocido'}
                                </p>

                                {/* Saga Info */}
                                {book.saga && (
                                    <div
                                        onClick={() => onOpenSaga && onOpenSaga(book.saga)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: 'var(--accent-primary)',
                                            marginBottom: '0.5rem',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer',
                                            width: 'fit-content'
                                        }}
                                        title="Ver detalles de la saga"
                                    >
                                        <Layers size={16} />
                                        <span style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>{book.saga.name}</span>
                                        {book.indexInSaga && (
                                            <span style={{ backgroundColor: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', textDecoration: 'none', color: 'var(--text-secondary)' }}>
                                                #{book.indexInSaga}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Rating */}
                            {(book.rating > 0 || formData.rating > 0) && (
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={20} fill={i < (book.rating || 0) ? '#f59e0b' : 'none'} color={i < (book.rating || 0) ? '#f59e0b' : 'var(--text-muted)'} />
                                    ))}
                                </div>
                            )}

                            {/* Genres */}
                            {book.genres && book.genres.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    {book.genres.map((genre, idx) => (
                                        <span key={idx} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            backgroundColor: 'var(--bg-tertiary)',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            fontSize: '0.85rem',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            <Tag size={12} /> {genre.name || genre}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Metadata Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                                color: 'var(--text-secondary)',
                                fontSize: '0.9rem',
                                marginBottom: '2rem',
                                padding: '1rem',
                                backgroundColor: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                {book.startDate && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <BookOpen size={16} />
                                        <span>Inicio: {book.startDate}</span>
                                    </div>
                                )}
                                {book.endDate && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle size={16} />
                                        <span>Fin: {book.endDate}</span>
                                    </div>
                                )}
                                {book.epubUrl && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: '1 / -1' }}>
                                        <Download size={16} />
                                        <a href={book.epubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                                            Descargar eBook
                                        </a>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Footer Actions */}
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                        {isEditing ? (
                            <>
                                <button onClick={() => setIsEditing(false)} className="btn-primary" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                                    Cancelar
                                </button>
                                <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Save size={18} /> Guardar Cambios
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    title="Editar Libro"
                                    className="btn-primary"
                                    style={{
                                        padding: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'var(--bg-tertiary)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <Edit2 size={20} />
                                </button>

                                <button
                                    onClick={handleDelete}
                                    title="Eliminar Libro"
                                    className="btn-primary"
                                    style={{
                                        padding: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#ef4444'
                                    }}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};



export default BookDetailsModal;
