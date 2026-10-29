import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { sipAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';

export const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturnRate, setAnnualReturnRate] = useState(12);
  const [durationYears, setDurationYears] = useState(10);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateSIP = async () => {
    if (monthlyInvestment <= 0 || annualReturnRate <= 0 || durationYears <= 0) return;

    setLoading(true);
    setError('');
    try {
      const data = await sipAPI.calculate(monthlyInvestment, annualReturnRate, durationYears);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Calculation error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, annualReturnRate, durationYears]);

  // Generate Year-by-Year Growth projection for Recharts
  const generateProjection = () => {
    const P = Number(monthlyInvestment);
    const r = Number(annualReturnRate) / 1200;
    const years = Number(durationYears);

    const data = [];
    for (let y = 1; y <= years; y++) {
      const n = y * 12;
      const invested = P * n;
      let fv = invested;
      if (r > 0) {
        fv = P * (((1 + r) ** n - 1) / r) * (1 + r);
      }

      data.push({
        year: `Yr ${y}`,
        invested: Math.round(invested),
        wealth: Math.round(fv),
      });
    }
    return data;
  };

  const chartData = generateProjection();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Compound <span className="page-title-serif">Architecture.</span>
          </h1>
          <p className="page-subtitle">Simulate systematic long-term capital compounding and wealth accumulation</p>
          <p className="editorial-tagline">'Time in the market compounds into freedom.'</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {/* Input Parameters Panel */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Simulation <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--primary)' }}>Variables</span>
          </h3>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
              <label className="form-label">Monthly Allocation</label>
              <span style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-sans)' }}>
                ${monthlyInvestment.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="100000"
              step="500"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />
            <input
              type="number"
              className="form-control"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
              <label className="form-label">Expected Annual Return</label>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{annualReturnRate}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={annualReturnRate}
              onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />
            <input
              type="number"
              step="0.1"
              className="form-control"
              value={annualReturnRate}
              onChange={(e) => setAnnualReturnRate(Math.max(0.1, Number(e.target.value)))}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
              <label className="form-label">Horizon (Duration)</label>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{durationYears} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={durationYears}
              onChange={(e) => setDurationYears(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />
            <input
              type="number"
              className="form-control"
              value={durationYears}
              onChange={(e) => setDurationYears(Math.max(1, Number(e.target.value)))}
            />
          </div>
        </div>

        {/* Results & Growth Visualization */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Projected <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--primary)' }}>Maturity</span>
          </h3>

          {/* Stat Cards */}
          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card" style={{ backgroundColor: 'var(--bg-input)' }}>
              <span className="stat-title">Invested Capital</span>
              <span className="stat-value" style={{ fontSize: '1.45rem' }}>
                {formatCurrency(result?.total_invested)}
              </span>
              <span className="stat-sub text-muted">Direct principal</span>
            </div>

            <div className="stat-card" style={{ backgroundColor: 'var(--bg-input)' }}>
              <span className="stat-title">Estimated Gains</span>
              <span className="stat-value text-success" style={{ fontSize: '1.45rem' }}>
                {formatCurrency(result?.estimated_return)}
              </span>
              <span className="stat-sub text-success">Compound interest</span>
            </div>

            <div className="stat-card" style={{ backgroundColor: 'var(--bg-input)' }}>
              <span className="stat-title">Maturity Wealth</span>
              <span className="stat-value" style={{ fontSize: '1.45rem', color: 'var(--primary)' }}>
                {formatCurrency(result?.maturity_value)}
              </span>
              <span className="stat-sub text-muted">Final corpus value</span>
            </div>
          </div>

          {/* Growth Area Chart with Sage Green Aesthetic */}
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8ea86f" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#8ea86f" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="year" stroke="#8e948c" tick={{ fontSize: 11, fontFamily: 'var(--font-sans)' }} />
                <YAxis
                  stroke="#8e948c"
                  tick={{ fontSize: 11, fontFamily: 'var(--font-sans)' }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
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
                  formatter={(val, name) => [`$${val.toLocaleString()}`, name === 'wealth' ? 'Projected Wealth' : 'Invested Principal']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: '#8e948c' }} />
                <Area
                  type="monotone"
                  dataKey="wealth"
                  name="Maturity Value"
                  stroke="#8ea86f"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#wealthGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="invested"
                  name="Invested Amount"
                  stroke="#5c625a"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#investedGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
