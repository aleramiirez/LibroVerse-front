import { useState } from 'react';
import { searchBooksInGoogle, saveBookToLibrary } from '../services/bookService';
import { Search, Plus, X, Book } from 'lucide-react';

const BookSearchModal = ({ isOpen, onClose, onBookAdded }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const data = await searchBooksInGoogle(query);
            setResults(data);
        } catch (error) {
            console.error("Error searching books:", error);
            const errorMessage = error.response?.data?.message || "Error al buscar libros. Intenta de nuevo.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBook = async (googleBook) => {
        const newBook = {
            title: googleBook.volumeInfo.title,
            author: { name: googleBook.volumeInfo.authors?.join(', ') || 'Autor desconocido' },
            coverUrl: googleBook.volumeInfo.imageLinks?.extraLarge ||
                googleBook.volumeInfo.imageLinks?.large ||
                googleBook.volumeInfo.imageLinks?.medium ||
                googleBook.volumeInfo.imageLinks?.thumbnail || null,
            status: 'PENDING',
        };

        try {
            await saveBookToLibrary(newBook);
            // alert(`¡"${newBook.title}" añadido!`); // Optional interaction
            onBookAdded(); // Refresh parent library
            onClose(); // Close modal
        } catch (error) {
            console.error("Error adding book:", error);
            const errorMessage = error.response?.data?.message || "No se pudo añadir el libro. Verifica que el backend esté corriendo.";
            alert(errorMessage);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-xl)'
            }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Añadir Nuevo Libro</h3>
                    <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
                    <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Buscar por título, autor..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="input-field"
                            style={{ paddingLeft: '48px', height: '50px' }}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="btn-primary small"
                            style={{ position: 'absolute', right: '8px', top: '8px', bottom: '8px' }}
                            disabled={loading}
                        >
                            {loading ? '...' : 'Buscar'}
                        </button>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {results.length === 0 && !loading && query && (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No se encontraron resultados.</p>
                        )}

                        {results.map((item) => (
                            <div key={item.id} style={{
                                display: 'flex',
                                gap: '1rem',
                                padding: '1rem',
                                backgroundColor: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-sm)',
                                alignItems: 'center'
                            }}>
                                <div style={{ width: '50px', flexShrink: 0 }}>
                                    {item.volumeInfo.imageLinks?.thumbnail ? (
                                        <img
                                            src={item.volumeInfo.imageLinks.thumbnail}
                                            alt="Cover"
                                            style={{ width: '100%', borderRadius: '4px' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '70px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Book size={16} />
                                        </div>
                                    )}
                                </div>

                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                        {item.volumeInfo.title}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {item.volumeInfo.authors?.join(', ')}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleAddBook(item)}
                                    className="btn-primary small"
                                    style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <Plus size={16} /> <span className="desktop-only">Añadir</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookSearchModal;
