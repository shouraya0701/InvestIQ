import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { marketAPI, stocksAPI, watchlistAPI } from '../services/api';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const [quote, setQuote] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [watchlistSuccess, setWatchlistSuccess] = useState('');
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const fetchStockData = async () => {
    setLoading(true);
    setError('');
    try {
      const [quoteRes, historyRes] = await Promise.all([
        marketAPI.getQuote(symbol),
        marketAPI.getHistory(symbol).catch(() => []),
      ]);

      setQuote(quoteRes);
      setHistory(historyRes || []);
    } catch (err) {
      setError(err.message || `Failed to fetch market data for ${symbol}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchStockData();
    }
  }, [symbol]);

  const handleAddToWatchlist = async () => {
    setWatchlistLoading(true);
    setWatchlistSuccess('');
    setError('');

    try {
      const allStocks = await stocksAPI.getAll();
      let dbStock = allStocks.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase());

      if (!dbStock) {
        dbStock = await stocksAPI.create({
          symbol: symbol.toUpperCase(),
          company_name: symbol.toUpperCase(),
          exchange: 'US',
          currency: 'USD',
        });
      }

      await watchlistAPI.add(dbStock.id);
      setWatchlistSuccess(`${symbol.toUpperCase()} added to your watchlist!`);
    } catch (err) {
      setError(err.message || 'Could not add to watchlist');
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !quote) {
    return (
      <div>
        <div className="alert alert-error">{error}</div>
        <Link to="/search" className="btn btn-secondary">
          ← Back to Search
        </Link>
      </div>
    );
  }

  const changeNum = Number(quote?.change || 0);
  const isPositive = changeNum >= 0;

  const chartData = (history || []).map((pt) => ({
    date: pt.date,
    close: parseFloat(pt.close) || 0,
  }));

  return (
    <div>
      {/* Navigation Header */}
      <div className="page-header">
        <div>
          <Link to="/search" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            ← Back to Exploration
          </Link>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.35rem' }}>
            <h1 className="page-title">{symbol?.toUpperCase()}</h1>
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--primary)', fontSize: '1.2rem' }}>
              Equity
            </span>
          </div>
          <p className="editorial-tagline">'Data over speculation.'</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleAddToWatchlist}
            className="btn btn-secondary btn-sm"
            disabled={watchlistLoading}
          >
            {watchlistLoading ? 'Saving...' : '⭐ Track in Watchlist'}
          </button>
          <button
            onClick={() => navigate('/transactions', { state: { prefilledSymbol: symbol?.toUpperCase() } })}
            className="btn btn-primary btn-sm"
          >
            + Execute Trade
          </button>
        </div>
      </div>

      {watchlistSuccess && <div className="alert alert-success">{watchlistSuccess}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Primary Quote Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-title">Current Spot Price</span>
          <span className="stat-value">{formatCurrency(quote?.price)}</span>
          <span className={`stat-sub ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? '↗' : '↘'} {quote?.change} ({quote?.change_percent})
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-title">Session Low / High</span>
          <span className="stat-value" style={{ fontSize: '1.4rem' }}>
            {formatCurrency(quote?.low)} - {formatCurrency(quote?.high)}
          </span>
          <span className="stat-sub text-muted">Daily intraday range</span>
        </div>

        <div className="stat-card">
          <span className="stat-title">Open & Previous Close</span>
          <span className="stat-value" style={{ fontSize: '1.4rem' }}>
            {formatCurrency(quote?.open)}
          </span>
          <span className="stat-sub text-muted">Prev Close: {formatCurrency(quote?.previous_close)}</span>
        </div>

        <div className="stat-card">
          <span className="stat-title">Session Volume</span>
          <span className="stat-value" style={{ fontSize: '1.4rem' }}>
            {Number(quote?.volume || 0).toLocaleString()}
          </span>
          <span className="stat-sub text-muted">Trading day: {quote?.latest_trading_day || '-'}</span>
        </div>
      </div>

      {/* Historical Price Chart */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
              Historical <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--primary)' }}>Trajectory</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Closing price trends from daily time series
            </p>
          </div>
          <span className="badge badge-neutral">Last 100 Days</span>
        </div>

        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8ea86f" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#8ea86f" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#8e948c" tick={{ fontSize: 11, fontFamily: 'var(--font-sans)' }} minTickGap={25} />
                <YAxis
                  stroke="#8e948c"
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 11, fontFamily: 'var(--font-sans)' }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e100f',
                    borderColor: 'rgba(142, 168, 111, 0.3)',
                    borderRadius: '10px',
                    color: '#f5f6f3',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
                  }}
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Closing Price']}
                  labelFormatter={(lbl) => `Date: ${lbl}`}
                />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="#8ea86f"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#priceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-state">
            <p>Historical price points currently not available for this ticker.</p>
          </div>
        )}
      </div>
    </div>
  );
};
