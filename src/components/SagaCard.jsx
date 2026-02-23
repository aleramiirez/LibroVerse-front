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

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1, backgroundColor: 'var(--bg-secondary)' }}>
                {/* Progress Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        Progreso
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '12px' }}>
                        {finishedBooks} / {totalBooks}
                    </span>
                </div>

                {/* Progress Bar Container */}
                <div style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                    position: 'relative'
                }}>
                    {/* Progress Fill */}
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: progress === 100
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : 'linear-gradient(90deg, var(--accent-primary), #8b5cf6)',
                        borderRadius: '5px',
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: progress > 0 ? '0 0 10px rgba(139, 92, 246, 0.5)' : 'none'
                    }} />
                </div>

                {/* Percentage */}
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: progress === 100 ? '#10b981' : 'var(--text-muted)' }}>
                    {Math.round(progress)}% Completado
                </div>
            </div>
        </div>
    );
};

export default SagaCard;
