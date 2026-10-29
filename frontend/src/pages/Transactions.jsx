import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { transactionsAPI, stocksAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

export const Transactions = () => {
  const location = useLocation();
  const prefilledSymbol = location.state?.prefilledSymbol || '';

  const [transactions, setTransactions] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(Boolean(prefilledSymbol));
  const [stockInput, setStockInput] = useState(prefilledSymbol);
  const [txnType, setTxnType] = useState('BUY');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [txnDate, setTxnDate] = useState(new Date().toISOString().split('T')[0]);
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [txnsData, stocksData] = await Promise.all([
        transactionsAPI.getAll(),
        stocksAPI.getAll(),
      ]);
      setTransactions(txnsData || []);
      setStocks(stocksData || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch transaction data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormError('');
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    setFormError('');

    const qtyNum = parseFloat(quantity);
    const priceNum = parseFloat(price);

    if (!stockInput.trim()) {
      setFormError('Please select or enter a stock symbol.');
      return;
    }
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setFormError('Quantity must be greater than zero.');
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Price must be greater than zero.');
      return;
    }
    if (!txnDate) {
      setFormError('Please select a valid transaction date.');
      return;
    }

    setFormSubmitting(true);

    try {
      const cleanSymbol = stockInput.trim().toUpperCase();
      let stock = stocks.find((s) => s.symbol.toUpperCase() === cleanSymbol);

      if (!stock) {
        stock = await stocksAPI.create({
          symbol: cleanSymbol,
          company_name: cleanSymbol,
          exchange: 'US',
          currency: 'USD',
        });
        setStocks((prev) => [...prev, stock]);
      }

      await transactionsAPI.create({
        stock_id: stock.id,
        transaction_type: txnType,
        quantity: qtyNum,
        price: priceNum,
        transaction_date: txnDate,
      });

      handleCloseModal();
      setQuantity('');
      setPrice('');
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Failed to submit transaction');
    } finally {
      setFormSubmitting(false);
    }
  };

  const stockMap = {};
  stocks.forEach((s) => {
    stockMap[s.id] = s;
  });

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
            Execution <span className="page-title-serif">Ledger.</span>
          </h1>
          <p className="page-subtitle">Audited record of all BUY and SELL capital allocations</p>
          <p className="editorial-tagline">'Every execution shapes the outcome.'</p>
        </div>
        <button onClick={handleOpenModal} className="btn btn-primary btn-sm">
          + Record Trade
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Transactions Table */}
      {transactions.length > 0 ? (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
              Historical <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--primary)' }}>Trades</span>
            </h3>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              {transactions.length} Total Executions
            </span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Security Ticker</th>
                  <th>Order Action</th>
                  <th>Shares Executed</th>
                  <th>Execution Rate</th>
                  <th>Total Consideration</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const stock = stockMap[tx.stock_id];
                  const total = Number(tx.quantity) * Number(tx.price);
                  const isBuy = tx.transaction_type === 'BUY';

                  return (
                    <tr key={tx.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>{formatDate(tx.transaction_date)}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', letterSpacing: '0.02em' }}>
                          {stock ? stock.symbol : 'STOCK'}
                        </span>
                        {stock && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {stock.company_name}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${isBuy ? 'badge-success' : 'badge-danger'}`}>
                          {tx.transaction_type}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{tx.quantity}</td>
                      <td>{formatCurrency(tx.price)}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatCurrency(total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card empty-state">
          <h3>No trades recorded yet</h3>
          <p>Record your initial position to activate real-time analytics.</p>
          <button onClick={handleOpenModal} className="btn btn-primary">
            Record Trade Execution
          </button>
        </div>
      )}

      {/* Record Transaction Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                Record <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--primary)' }}>Execution</span>
              </h3>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleSubmitTransaction}>
              <div className="form-group">
                <label className="form-label">Ticker Symbol</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. AAPL, NVDA, TSLA"
                  value={stockInput}
                  onChange={(e) => setStockInput(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Action Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setTxnType('BUY')}
                    className={`btn ${txnType === 'BUY' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxnType('SELL')}
                    className={`btn ${txnType === 'SELL' ? 'btn-danger' : 'btn-secondary'}`}
                  >
                    SELL
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    step="any"
                    min="0.0001"
                    className="form-control"
                    placeholder="e.g. 10"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Execution Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="form-control"
                    placeholder="e.g. 175.50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Execution Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={txnDate}
                  onChange={(e) => setTxnDate(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Submitting...' : `Confirm ${txnType}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
