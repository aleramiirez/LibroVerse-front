import { Layers, Bookmark, CheckCircle, Info } from 'lucide-react';

const SagaCard = ({ saga, onClick }) => {
    const totalBooks = saga.books ? saga.books.length : 0;
    const finishedBooks = saga.books ? saga.books.filter(b => b.status === 'FINISHED').length : 0;
    const progress = totalBooks > 0 ? (finishedBooks / totalBooks) * 100 : 0;

    return (
        <div
            className="card"
            style={{
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                gap: 0,
                transition: 'transform 0.2s, box-shadow 0.2s',
                overflow: 'hidden',
                position: 'relative',
                height: '100%'
            }}
            onClick={onClick}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            {/* Cover Image or Placeholder */}
            <div style={{
                height: '250px',
                width: '100%',
                backgroundColor: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {saga.coverUrl ? (
                    <img
                        src={saga.coverUrl}
                        alt={saga.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-primary)'
                    }}>
                        <Layers size={40} />
                    </div>
                )}

                {/* Overlay Text for Saga Name if no cover? Or always show below? */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '1rem',
                    paddingTop: '2rem'
                }}>
                    <h3 style={{
                        color: 'white',
                        margin: 0,
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        {saga.name}
                    </h3>
                </div>
            </div>

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>

                {/* Stats */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>{finishedBooks} / {totalBooks}</span>
                </div>

                {/* Progress Bar */}
                <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: progress === 100 ? '#10b981' : 'var(--accent-primary)',
                        transition: 'width 0.5s ease'
                    }} />
                </div>
            </div>
        </div>
    );
};

export default SagaCard;
