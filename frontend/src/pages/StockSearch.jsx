import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketAPI } from '../services/api';

const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'Nvidia Corp.' },
];

export const StockSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const data = await marketAPI.search(query.trim());
      setResults(data || []);
    } catch (err) {
      setError(err.message || 'Failed to search stocks');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStock = (symbol) => {
    navigate(`/stocks/${symbol}`);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Market <span className="page-title-serif">Discovery.</span>
          </h1>
          <p className="page-subtitle">Search global equities by ticker symbol or enterprise name</p>
          <p className="editorial-tagline">'Find value where others see noise.'</p>
        </div>
      </div>

      {/* Search Input Card */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-control"
            style={{ flex: 1, minWidth: '240px' }}
            placeholder="Search symbol or enterprise name (e.g. AAPL, NVDA, Microsoft)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !query.trim()}>
            {loading ? 'Searching...' : 'Explore Equities'}
          </button>
        </form>

        {/* Quick Popular Picks */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
            Curated Picks:
          </span>
          {POPULAR_STOCKS.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleSelectStock(stock.symbol)}
              className="chip"
            >
              {stock.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading state */}
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}

      {/* Results Table */}
      {!loading && hasSearched && results.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
              Search <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--primary)' }}>Results</span>
            </h3>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              {results.length} Matches Found
            </span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Enterprise</th>
                  <th>Class</th>
                  <th>Region</th>
                  <th>Currency</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.04em' }}>{item.symbol}</span>
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--text-main)' }}>{item.name}</td>
                    <td>
                      <span className="badge badge-neutral">{item.type || 'Equity'}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{item.region}</td>
                    <td style={{ color: 'var(--text-dim)' }}>{item.currency}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleSelectStock(item.symbol)}
                        className="btn btn-secondary btn-sm"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && hasSearched && results.length === 0 && !error && (
        <div className="card empty-state">
          <h3>No matching securities found</h3>
          <p>Verify ticker symbol spelling or try searching by common company name.</p>
        </div>
      )}
    </div>
  );
};
