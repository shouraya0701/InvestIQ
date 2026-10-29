import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { formatCurrency, formatPercent, formatDate } from '../utils/formatters';

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await dashboardAPI.get();
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="alert alert-error">{error}</div>
        <button onClick={fetchDashboard} className="btn btn-secondary">
          Try Again
        </button>
      </div>
    );
  }

  const isProfitable = Number(data?.total_profit_loss || 0) >= 0;

  return (
    <div>
      {/* Editorial Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Portfolio <span className="page-title-serif">Intelligence.</span>
          </h1>
          <p className="page-subtitle">
            Capital deployment, compound returns, and live equity analytics.
          </p>
          <p className="editorial-tagline">
            'This is what I make with that time.'
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/search" className="btn btn-secondary btn-sm">
            <span>🔍</span> Explore Stocks
          </Link>
          <Link to="/transactions" className="btn btn-primary btn-sm">
            + New Trade
          </Link>
        </div>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-title">Portfolio Valuation</span>
          <span className="stat-value">{formatCurrency(data?.current_portfolio_value)}</span>
          <span className="stat-sub text-muted">
            <span style={{ color: 'var(--primary)' }}>●</span> Live market valuation
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-title">Capital Invested</span>
          <span className="stat-value">{formatCurrency(data?.total_invested)}</span>
          <span className="stat-sub text-muted">Cumulative cost basis</span>
        </div>

        <div className="stat-card">
          <span className="stat-title">Net Profit & Loss</span>
          <span className={`stat-value ${isProfitable ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(data?.total_profit_loss)}
          </span>
          <span className={`stat-sub ${isProfitable ? 'text-success' : 'text-danger'}`}>
            {isProfitable ? '↗' : '↘'} {formatPercent(data?.total_return_percentage)} all-time return
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-title">Active Positions</span>
          <span className="stat-value">{data?.number_of_holdings || 0}</span>
          <span className="stat-sub text-muted">
            {data?.number_of_watchlist_stocks || 0} tracked in watchlist
          </span>
        </div>
      </div>

      {/* Quick Actions & Recent Transactions */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
                Recent <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--primary)' }}>Transactions</span>
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Latest recorded market executions</p>
            </div>
            <Link to="/transactions" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500, letterSpacing: '0.04em' }}>
              View All Trades →
            </Link>
          </div>

          {data?.recent_transactions && data.recent_transactions.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Ticker</th>
                    <th>Action</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>{formatDate(tx.transaction_date)}</td>
                      <td>
                        <div style={{ fontWeight: 600, letterSpacing: '0.02em' }}>{tx.symbol}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{tx.company_name}</div>
                      </td>
                      <td>
                        <span className={`badge ${tx.transaction_type === 'BUY' ? 'badge-success' : 'badge-danger'}`}>
                          {tx.transaction_type}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{tx.quantity}</td>
                      <td>{formatCurrency(tx.price)}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {formatCurrency(Number(tx.quantity) * Number(tx.price))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No trades executed yet. Build your first position today.</p>
              <Link to="/transactions" className="btn btn-primary btn-sm">
                Record First Trade
              </Link>
            </div>
          )}
        </div>

        {/* Quick Utilities Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
              Workspace <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--primary)' }}>Tools</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Quick access shortcuts</p>
          </div>
          
          <Link to="/search" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '0.7rem 1.1rem' }}>
            <span>🔍</span> Find & Research Equities
          </Link>

          <Link to="/portfolio" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '0.7rem 1.1rem' }}>
            <span>💼</span> Full Portfolio Holdings
          </Link>

          <Link to="/watchlist" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '0.7rem 1.1rem' }}>
            <span>⭐</span> Watchlist Targets ({data?.number_of_watchlist_stocks || 0})
          </Link>

          <Link to="/sip" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '0.7rem 1.1rem' }}>
            <span>📈</span> SIP Wealth Growth Engine
          </Link>
        </div>
      </div>
    </div>
  );
};
