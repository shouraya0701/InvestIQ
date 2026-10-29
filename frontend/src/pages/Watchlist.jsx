import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { watchlistAPI } from '../services/api';
import { formatDate } from '../utils/formatters';

export const Watchlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const navigate = useNavigate();

  const fetchWatchlist = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await watchlistAPI.getAll();
      setItems(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (stockId, symbol) => {
    if (!window.confirm(`Remove ${symbol} from your watchlist?`)) return;

    setActionLoading(stockId);
    try {
      await watchlistAPI.remove(stockId);
      setItems((prev) => prev.filter((item) => item.stock_id !== stockId));
    } catch (err) {
      setError(err.message || 'Failed to remove stock');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Curated <span className="page-title-serif">Watchlist.</span>
          </h1>
          <p className="page-subtitle">Selective monitoring of high-conviction market candidates</p>
          <p className="editorial-tagline">'Patience precedes performance.'</p>
        </div>
        <Link to="/search" className="btn btn-primary btn-sm">
          + Add Equities
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {items.length > 0 ? (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
              Tracked <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--primary)' }}>Assets</span>
            </h3>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              {items.length} Target Stocks
            </span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Company Name</th>
                  <th>Exchange</th>
                  <th>Currency</th>
                  <th>Date Saved</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.04em' }}>{item.symbol}</span>
                    </td>
                    <td style={{ color: 'var(--text-main)', fontWeight: 500 }}>{item.company_name}</td>
                    <td>
                      <span className="badge badge-neutral">{item.exchange}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{item.currency}</td>
                    <td style={{ color: 'var(--text-dim)', fontSize: '0.84rem' }}>{formatDate(item.added_at)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.45rem' }}>
                        <button
                          onClick={() => navigate(`/stocks/${item.symbol}`)}
                          className="btn btn-secondary btn-sm"
                        >
                          Chart
                        </button>
                        <button
                          onClick={() =>
                            navigate('/transactions', { state: { prefilledSymbol: item.symbol } })
                          }
                          className="btn btn-primary btn-sm"
                        >
                          Trade
                        </button>
                        <button
                          onClick={() => handleRemove(item.stock_id, item.symbol)}
                          className="btn btn-danger btn-sm"
                          disabled={actionLoading === item.stock_id}
                        >
                          {actionLoading === item.stock_id ? '...' : 'Remove'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card empty-state">
          <h3>Your watchlist is clean</h3>
          <p>Explore equities across global markets to begin tracking potential entries.</p>
          <Link to="/search" className="btn btn-primary">
            Explore Equities
          </Link>
        </div>
      )}
    </div>
  );
};
