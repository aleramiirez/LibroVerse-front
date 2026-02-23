import { Book, Tag } from 'lucide-react';

const BookCard = ({ title, author, coverUrl, genres, onClick }) => {
    return (
        <div
            className="card"
            style={{
                padding: '0',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
            onClick={onClick}
        >
            <div style={{
                aspectRatio: '2 / 3',
                width: '100%',
                backgroundColor: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                {coverUrl ? (
                    <img
                        src={coverUrl}
                        alt={title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <Book size={48} color="var(--text-muted)" />
                )}

                {/* Overlay gradient for text readability if needed, or just style */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60px',
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8), transparent)'
                }} />
            </div>

            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{
                    fontSize: '1.1rem',
                    marginBottom: '0.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 'auto' }}>
                    {typeof author === 'object' && author !== null ? author.name : (author || 'Autor desconocido')}
                </p>

                {genres && genres.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        <Tag size={12} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {typeof genres[0] === 'string' ? genres[0] : genres[0].name}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookCard;
