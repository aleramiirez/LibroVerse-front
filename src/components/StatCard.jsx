const StatCard = ({ icon, label, value, color }) => {
    const Icon = icon;
    return (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
                padding: '1rem',
                borderRadius: '50%',
                backgroundColor: color ? `${color}20` : 'var(--bg-tertiary)',
                color: color || 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={32} />
            </div>
            <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{label}</p>
                <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-primary)' }}>{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;
