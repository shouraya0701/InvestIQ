import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { portfolioAPI } from '../services/api';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const Portfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const fetchPortfolio = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await portfolioAPI.get();
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to calculate portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const isProfitable = Number(data?.total_profit_loss || 0) >= 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Portfolio <span className="page-title-serif">Holdings.</span>
          </h1>
          <p className="page-subtitle">Real-time equity valuation, aggregate yield, and capital distribution</p>
          <p className="editorial-tagline">'Ownership of high-conviction assets.'</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchPortfolio} className="btn btn-secondary btn-sm">
            🔄 Refresh Quotes
          </button>
          <Link to="/transactions" className="btn btn-primary btn-sm">
            + New Trade
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Aggregate Valuation Banner */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-title">Current Valuation</span>
          <span className="stat-value">{formatCurrency(data?.total_current_value)}</span>
          <span className="stat-sub text-muted">Latest live market rate</span>
        </div>

        <div className="stat-card">
          <span className="stat-title">Capital Invested</span>
          <span className="stat-value">{formatCurrency(data?.total_invested)}</span>
          <span className="stat-sub text-muted">Average net cost</span>
        </div>

        <div className="stat-card">
          <span className="stat-title">Unrealized P&L</span>
          <span className={`stat-value ${isProfitable ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(data?.total_profit_loss)}
          </span>
          <span className={`stat-sub ${isProfitable ? 'text-success' : 'text-danger'}`}>
            {isProfitable ? '↗' : '↘'} {formatPercent(data?.total_return_percentage)} all-time
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-title">Active Assets</span>
          <span className="stat-value">{data?.holdings?.length || 0}</span>
          <span className="stat-sub text-muted">Equity allocations</span>
        </div>
      </div>

      {/* Holdings Breakdown Table */}
      {data?.holdings && data.holdings.length > 0 ? (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
              Holdings <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--primary)' }}>Breakdown</span>
            </h3>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              {data.holdings.length} Positions Active
            </span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Quantity</th>
                  <th>Invested</th>
                  <th>Current Price</th>
                  <th>Market Value</th>
                  <th>Profit / Loss</th>
                  <th>Return</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.holdings.map((pos) => {
                  const posProfit = Number(pos.profit_loss || 0) >= 0;
                  return (
                    <tr key={pos.stock_id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', letterSpacing: '0.02em' }}>{pos.symbol}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>{pos.company_name}</div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{pos.quantity}</td>
                      <td>{formatCurrency(pos.invested_amount)}</td>
                      <td>{formatCurrency(pos.current_price)}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(pos.current_value)}</td>
                      <td className={posProfit ? 'text-success' : 'text-danger'} style={{ fontWeight: 600 }}>
                        {formatCurrency(pos.profit_loss)}
                      </td>
                      <td>
                        <span className={`badge ${posProfit ? 'badge-success' : 'badge-danger'}`}>
                          {formatPercent(pos.return_percentage)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => navigate(`/stocks/${pos.symbol}`)}
                            className="btn btn-secondary btn-sm"
                          >
                            Chart
                          </button>
                          <button
                            onClick={() =>
                              navigate('/transactions', { state: { prefilledSymbol: pos.symbol } })
                            }
                            className="btn btn-primary btn-sm"
                          >
                            Trade
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card empty-state">
          <h3>No active holdings yet</h3>
          <p>Once you record BUY transactions, your dynamic portfolio calculations will appear here.</p>
          <Link to="/transactions" className="btn btn-primary">
            Record a Trade
          </Link>
        </div>
      )}
    </div>
  );
};
