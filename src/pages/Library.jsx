import { useEffect, useState } from 'react';
import { getAllBooks, startReadingBook, finishReadingBook, updateBook, deleteBook } from '../services/bookService';
import { Book, Play, CheckCircle, Star, Plus, Tag, BookOpen, Layers, ChevronDown } from 'lucide-react';
import BookSearchModal from '../components/BookSearchModal';
import BookDetailsModal from '../components/BookDetailsModal';
import SagaDetailsModal from '../components/SagaDetailsModal'; // Imported
import { updateSaga, deleteSaga, getSagaById } from '../services/sagaService'; // Imported service functions

const STATUS_LABELS = {
    'PENDING': 'Pendiente',
    'READING': 'Leyendo',
    'FINISHED': 'Terminado'
};

const STATUS_COLORS = {
    'PENDING': 'var(--text-muted)',
    'READING': '#f59e0b',
    'FINISHED': '#10b981'
};

function Library() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ratingOpen, setRatingOpen] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [viewingSaga, setViewingSaga] = useState(null); // New State

    // Filters
    const [filter, setFilter] = useState('ALL');
    const [filterGenre, setFilterGenre] = useState('ALL');
    const [filterAuthor, setFilterAuthor] = useState('ALL');
    const [openGenreDropdown, setOpenGenreDropdown] = useState(false);
    const [openAuthorDropdown, setOpenAuthorDropdown] = useState(false);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenGenreDropdown(false);
            setOpenAuthorDropdown(false);
        };

        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleGenre = (e) => { e.stopPropagation(); setOpenGenreDropdown(!openGenreDropdown); setOpenAuthorDropdown(false); };
    const toggleAuthor = (e) => { e.stopPropagation(); setOpenAuthorDropdown(!openAuthorDropdown); setOpenGenreDropdown(false); };

    // Derived state for filters
    const genres = ['ALL', ...new Set(books.flatMap(b => b.genres || []).map(g => typeof g === 'string' ? g : g.name))];
    const authors = ['ALL', ...new Set(books.map(b => b.author ? b.author.name : 'Desconocido'))];

    const filteredBooks = books.filter(book => {
        const matchesStatus = filter === 'ALL' || book.status === filter;
        const matchesGenre = filterGenre === 'ALL' || (book.genres && book.genres.some(g => (typeof g === 'string' ? g : g.name) === filterGenre));
        const matchesAuthor = filterAuthor === 'ALL' || (book.author ? book.author.name === filterAuthor : filterAuthor === 'Desconocido');
        return matchesStatus && matchesGenre && matchesAuthor;
    });

    const fetchData = async () => {
        try {
            const data = await getAllBooks();
            setBooks(data);
        } catch (error) {
            console.error(error);
            alert("Error al cargar tus libros");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStartReading = async (e, id) => {
        e.stopPropagation(); // Prevent opening modal
        try {
            await startReadingBook(id);
            fetchData();
        } catch (error) {
            console.error(error);
            alert("No se pudo actualizar el estado.");
        }
    };

    const handleFinishReading = async (id, rating) => {
        try {
            await finishReadingBook(id, rating);
            setRatingOpen(null);
            fetchData();
        } catch (error) {
            console.error(error);
            alert("No se pudo finalizar la lectura.");
        }
    };

    const handleUpdateBook = async (id, data) => {
        try {
            const updatedBook = await updateBook(id, data);
            setBooks(prevBooks => prevBooks.map(b => b.id === id ? updatedBook : b));
            setSelectedBook(updatedBook);
        } catch (error) {
            console.error(error);
            // Mostrar el error real que devuelve Java en lugar de un mensaje genérico
            const msg = error.response?.data?.message || error.message;
            alert(`El servidor rechazó los cambios: ${msg}`);
            fetchData();
        }
    };

    const handleDeleteBook = async (id) => {
        try {
            await deleteBook(id);
            setSelectedBook(null); // Close modal
            fetchData();
        } catch (error) {
            alert("Error al eliminar el libro");
        }
    };

    if (loading) return <div className="flex items-center justify-center h-full"><p>Cargando tu colección...</p></div>;

    const handleOpenSaga = async (sagaPartial) => {
        try {
            // Fetch full saga details to get books
            const fullSaga = await getSagaById(sagaPartial.id);
            setViewingSaga(fullSaga);
            setSelectedBook(null); // Close book modal
        } catch (error) {
            console.error("Error loading saga details:", error);
            alert("No se pudieron cargar los detalles de la saga.");
        }
    };

    const handleUpdateSaga = async (id, data) => {
        try {
            await updateSaga(id, data);
            fetchData();
            if (viewingSaga) setViewingSaga({ ...viewingSaga, ...data });
        } catch (error) {
            console.error(error);
            alert("Error al actualizar la saga");
        }
    };

    const handleDeleteSaga = async (id) => {
        try {
            await deleteSaga(id);
            setViewingSaga(null);
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Error al eliminar la saga");
        }
    };

    return (
        <div className="container" style={{ position: 'relative', minHeight: '80vh' }}>
            <header className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                <h2 className="page-title">📚 Mi Colección</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{books.length} libros</span>
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="btn-primary desktop-only"
                        style={{ display: window.innerWidth > 768 ? 'flex' : 'none', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={20} /> Añadir Libro
                    </button>
                </div>
            </header>

            {/* Filters - Redesigned */}
            <div
                className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6"
                style={{ marginBottom: '3rem' }}
            >
                {/* Status Tabs */}
                <div style={{
                    display: 'flex',
                    padding: '4px',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    gap: '4px',
                    maxWidth: '100%',
                    overflowX: 'auto',
                    scrollbarWidth: 'none' // Hide scrollbar for cleaner look
                }}>
                    {['ALL', 'READING', 'PENDING', 'FINISHED'].map(status => {
                        const isActive = filter === status;
                        return (
                            <div key={status} style={{ flexShrink: 0 }}>
                                <button
                                    onClick={() => setFilter(status)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '12px',
                                        backgroundColor: isActive ? 'var(--bg-primary)' : 'transparent',
                                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        fontSize: '0.9rem',
                                        fontWeight: isActive ? 600 : 400,
                                        border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
                                        boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {status === 'READING' && <BookOpen size={14} />}
                                    {status === 'FINISHED' && <CheckCircle size={14} />}
                                    {status === 'ALL' && <Layers size={14} />}
                                    {status === 'PENDING' && <Book size={14} />}
                                    {status === 'ALL' ? 'Todos' : STATUS_LABELS[status]}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Custom Dropdowns using relative positioning */}
                <div style={{
                    display: 'flex',
                    padding: '4px',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    gap: '4px',
                    flexWrap: 'wrap',
                    width: '100%',
                    maxWidth: 'fit-content'
                }}>
                    {/* Genre Dropdown */}
                    <div style={{ position: 'relative', flex: '1 1 auto', minWidth: '160px' }}>
                        <button
                            onClick={toggleGenre}
                            style={{
                                appearance: 'none',
                                padding: '8px 16px 8px 36px',
                                borderRadius: '12px',
                                backgroundColor: filterGenre !== 'ALL' ? 'var(--bg-primary)' : 'transparent',
                                border: filterGenre !== 'ALL' ? '1px solid var(--border-color)' : '1px solid transparent',
                                color: filterGenre !== 'ALL' ? 'var(--text-primary)' : 'var(--text-secondary)',
                                fontSize: '0.9rem',
                                fontWeight: filterGenre !== 'ALL' ? 600 : 400,
                                fontFamily: 'inherit',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                height: '100%',
                                outline: 'none',
                                minWidth: '160px',
                                boxShadow: filterGenre !== 'ALL' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px'
                            }}
                        >
                            <Tag size={14} style={{ position: 'absolute', left: '12px' }} />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                                {filterGenre === 'ALL' ? 'Todos los Géneros' : filterGenre}
                            </span>
                            <ChevronDown size={14} style={{ opacity: 0.5 }} />
                        </button>

                        {openGenreDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                left: 0,
                                minWidth: '200px',
                                backgroundColor: 'var(--card-bg)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                boxShadow: 'var(--shadow-lg)',
                                zIndex: 100,
                                padding: '4px',
                                maxHeight: '300px',
                                overflowY: 'auto',
                                animation: 'fadeIn 0.2s ease-out'
                            }}>
                                <div
                                    onClick={(e) => { e.stopPropagation(); setFilterGenre('ALL'); setOpenGenreDropdown(false); }}
                                    className="dropdown-item"
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        color: filterGenre === 'ALL' ? 'var(--accent-primary)' : 'var(--text-primary)',
                                        backgroundColor: filterGenre === 'ALL' ? 'var(--bg-tertiary)' : 'transparent',
                                        fontWeight: filterGenre === 'ALL' ? 600 : 400
                                    }}
                                >
                                    Todos los Géneros
                                </div>
                                {genres.filter(g => g !== 'ALL').map(g => (
                                    <div
                                        key={g}
                                        onClick={(e) => { e.stopPropagation(); setFilterGenre(g); setOpenGenreDropdown(false); }}
                                        className="dropdown-item"
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            color: filterGenre === g ? 'var(--accent-primary)' : 'var(--text-primary)',
                                            backgroundColor: filterGenre === g ? 'var(--bg-tertiary)' : 'transparent',
                                            fontWeight: filterGenre === g ? 600 : 400,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = filterGenre === g ? 'var(--bg-tertiary)' : 'transparent'}
                                    >
                                        {g}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Author Dropdown */}
                    <div style={{ position: 'relative', flex: '1 1 auto', minWidth: '160px' }}>
                        <button
                            onClick={toggleAuthor}
                            style={{
                                appearance: 'none',
                                padding: '8px 16px 8px 36px',
                                borderRadius: '12px',
                                backgroundColor: filterAuthor !== 'ALL' ? 'var(--bg-primary)' : 'transparent',
                                border: filterAuthor !== 'ALL' ? '1px solid var(--border-color)' : '1px solid transparent',
                                color: filterAuthor !== 'ALL' ? 'var(--text-primary)' : 'var(--text-secondary)',
                                fontSize: '0.9rem',
                                fontWeight: filterAuthor !== 'ALL' ? 600 : 400,
                                fontFamily: 'inherit',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                height: '100%',
                                outline: 'none',
                                minWidth: '160px',
                                boxShadow: filterAuthor !== 'ALL' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px'
                            }}
                        >
                            <span style={{ fontSize: '1rem', lineHeight: 1, position: 'absolute', left: '12px' }}>✍️</span>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                                {filterAuthor === 'ALL' ? 'Todos los Autores' : filterAuthor}
                            </span>
                            <ChevronDown size={14} style={{ opacity: 0.5 }} />
                        </button>

                        {openAuthorDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                left: 0,
                                minWidth: '200px',
                                backgroundColor: 'var(--card-bg)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                boxShadow: 'var(--shadow-lg)',
                                zIndex: 100,
                                padding: '4px',
                                maxHeight: '300px',
                                overflowY: 'auto',
                                animation: 'fadeIn 0.2s ease-out'
                            }}>
                                <div
                                    onClick={(e) => { e.stopPropagation(); setFilterAuthor('ALL'); setOpenAuthorDropdown(false); }}
                                    className="dropdown-item"
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        color: filterAuthor === 'ALL' ? 'var(--accent-primary)' : 'var(--text-primary)',
                                        backgroundColor: filterAuthor === 'ALL' ? 'var(--bg-tertiary)' : 'transparent',
                                        fontWeight: filterAuthor === 'ALL' ? 600 : 400
                                    }}
                                >
                                    Todos los Autores
                                </div>
                                {authors.filter(a => a !== 'ALL').map(a => (
                                    <div
                                        key={a}
                                        onClick={(e) => { e.stopPropagation(); setFilterAuthor(a); setOpenAuthorDropdown(false); }}
                                        className="dropdown-item"
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            color: filterAuthor === a ? 'var(--accent-primary)' : 'var(--text-primary)',
                                            backgroundColor: filterAuthor === a ? 'var(--bg-tertiary)' : 'transparent',
                                            fontWeight: filterAuthor === a ? 600 : 400,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = filterAuthor === a ? 'var(--bg-tertiary)' : 'transparent'}
                                    >
                                        {a}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Floating Action Button */}
            <button
                onClick={() => setIsSearchOpen(true)}
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

            {filteredBooks.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Book size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <p>No se encontraron libros con estos filtros.</p>
                    <button onClick={() => { setFilter('ALL'); setFilterGenre('ALL'); setFilterAuthor('ALL'); }} className="btn-primary" style={{ marginTop: '1rem' }}>
                        Limpiar Filtros
                    </button>
                </div>
            ) : (
                <div className="responsive-grid">
                    {filteredBooks.map((book) => (
                        <div
                            key={book.id}
                            className="card"
                            style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                            onClick={() => setSelectedBook(book)}
                        >
                            <div className="book-cover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                {book.coverUrl ? (
                                    <img
                                        src={book.coverUrl}
                                        alt={book.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <Book size={48} strokeWidth={1} />
                                )}
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    color: STATUS_COLORS[book.status] || 'white',
                                    fontWeight: '600',
                                    backdropFilter: 'blur(4px)'
                                }}>
                                    {STATUS_LABELS[book.status] || book.status}
                                </div>
                            </div>

                            <div className="book-card-content">
                                <h4 className="book-title">
                                    {book.title}
                                </h4>
                                {/* Genre tag removed as requested */}

                                <div style={{ marginTop: 'auto' }} onClick={e => e.stopPropagation()}>
                                    {book.status === 'PENDING' && (
                                        <button
                                            onClick={(e) => handleStartReading(e, book.id)}
                                            className="btn-primary w-full"
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        >
                                            <Play size={16} /> Empezar
                                        </button>
                                    )}

                                    {book.status === 'READING' && !ratingOpen && (
                                        <button
                                            onClick={() => setRatingOpen(book.id)}
                                            className="btn-primary w-full"
                                            style={{ backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        >
                                            <CheckCircle size={16} /> Terminar
                                        </button>
                                    )}

                                    {ratingOpen === book.id && (
                                        <div style={{ textAlign: 'center', animation: 'fadeIn 0.2s' }}>
                                            <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>¿Calificación?</p>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '0.5rem' }}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        onClick={() => handleFinishReading(book.id, star)}
                                                        style={{ color: '#f59e0b', padding: '2px' }}
                                                    >
                                                        <Star size={20} fill="#f59e0b" />
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setRatingOpen(null)}
                                                style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    )}

                                    {book.status === 'FINISHED' && book.rating && (
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', color: '#f59e0b', padding: '0.5rem 0' }}>
                                            {[...Array(book.rating)].map((_, i) => (
                                                <Star key={i} size={16} fill="#f59e0b" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <BookSearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onBookAdded={fetchData}
            />

            <BookDetailsModal
                isOpen={!!selectedBook}
                onClose={() => setSelectedBook(null)}
                book={selectedBook}
                onUpdate={handleUpdateBook}
                onDelete={handleDeleteBook}
                onOpenSaga={handleOpenSaga}
            />

            <SagaDetailsModal
                isOpen={!!viewingSaga}
                onClose={() => setViewingSaga(null)}
                saga={viewingSaga}
                onUpdate={handleUpdateSaga}
                onDelete={handleDeleteSaga}
            />
        </div>
    );
}

export default Library;