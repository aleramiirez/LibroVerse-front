import { useState } from 'react';
import { searchBooksInGoogle, saveBookToLibrary } from '../services/bookService';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Plus, Book } from 'lucide-react';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const data = await searchBooksInGoogle(query);
            setResults(data);
        } catch (error) {
            console.error(error);
            alert("Hubo un error al buscar los libros");
        } finally {
            setLoading(false);
        }
    };

    const handleAddBook = async (googleBook) => {
        const newBook = {
            title: googleBook.volumeInfo.title,
            coverUrl: googleBook.volumeInfo.imageLinks?.thumbnail || null,
            status: 'PENDING',
        };

        try {
            await saveBookToLibrary(newBook);
            alert(`¡"${newBook.title}" añadido a tu biblioteca!`);
            navigate('/biblioteca');
        } catch (error) {
            console.error(error);
            alert("No se pudo guardar el libro.");
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍 Buscar Nuevo Libro</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Encuentra tu próxima lectura en Google Books</p>
            </header>

            <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '3rem' }}>
                <SearchIcon size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    placeholder="Escribe el título, autor o ISBN..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '48px', height: '56px', fontSize: '1.1rem' }}
                />
                <button
                    type="submit"
                    className="btn-primary"
                    style={{ position: 'absolute', right: '8px', top: '8px', bottom: '8px' }}
                    disabled={loading}
                >
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {results.map((item) => (
                    <div key={item.id} className="card" style={{ display: 'flex', gap: '1.5rem', padding: '1rem' }}>
                        <div style={{ width: '80px', flexShrink: 0 }}>
                            {item.volumeInfo.imageLinks?.thumbnail ? (
                                <img
                                    src={item.volumeInfo.imageLinks.thumbnail}
                                    alt="Portada"
                                    style={{ width: '100%', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '110px',
                                    backgroundColor: 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-sm)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-muted)'
                                }}>
                                    <Book size={24} />
                                </div>
                            )}
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.volumeInfo.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                {item.volumeInfo.authors?.join(', ') || 'Autor desconocido'}
                            </p>

                            <div style={{ marginTop: 'auto' }}>
                                <button
                                    onClick={() => handleAddBook(item)}
                                    className="btn-primary"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}
                                >
                                    <Plus size={16} /> Añadir a Biblioteca
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Search;