// Pure JavaScript - Backend API Client with Native Fetch

import { getToken, clearSession } from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Core HTTP client using native fetch
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // If 401 Unauthorized, clear stale session
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      clearSession();
      // Optional: window.location.href = '/login';
    }

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.detail || 'An unexpected error occurred';
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please ensure the backend is running.');
    }
    throw error;
  }
}

// ──────────────────────────────────────
// 1. Authentication
// ──────────────────────────────────────
export const authAPI = {
  register: (name, email, password) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: () => {
    return request('/auth/me', {
      method: 'GET',
    });
  },
};

// ──────────────────────────────────────
// 2. Stocks Master
// ──────────────────────────────────────
export const stocksAPI = {
  getAll: () => {
    return request('/stocks/', {
      method: 'GET',
    });
  },

  getById: (stockId) => {
    return request(`/stocks/${stockId}`, {
      method: 'GET',
    });
  },

  create: (data) => {
    return request('/stocks/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ──────────────────────────────────────
// 3. Market Data (Alpha Vantage via Backend)
// ──────────────────────────────────────
export const marketAPI = {
  search: (keywords) => {
    const params = new URLSearchParams({ keywords });
    return request(`/market/search?${params.toString()}`, {
      method: 'GET',
    });
  },

  getQuote: (symbol) => {
    return request(`/market/${encodeURIComponent(symbol)}/quote`, {
      method: 'GET',
    });
  },

  getHistory: (symbol) => {
    return request(`/market/${encodeURIComponent(symbol)}/history`, {
      method: 'GET',
    });
  },
};

// ──────────────────────────────────────
// 4. Watchlist
// ──────────────────────────────────────
export const watchlistAPI = {
  getAll: () => {
    return request('/watchlist/', {
      method: 'GET',
    });
  },

  add: (stockId) => {
    return request('/watchlist/', {
      method: 'POST',
      body: JSON.stringify({ stock_id: stockId }),
    });
  },

  remove: (stockId) => {
    return request(`/watchlist/${stockId}`, {
      method: 'DELETE',
    });
  },
};

// ──────────────────────────────────────
// 5. Transactions
// ──────────────────────────────────────
export const transactionsAPI = {
  getAll: () => {
    return request('/transactions/', {
      method: 'GET',
    });
  },

  create: (data) => {
    return request('/transactions/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ──────────────────────────────────────
// 6. Portfolio
// ──────────────────────────────────────
export const portfolioAPI = {
  get: () => {
    return request('/portfolio/', {
      method: 'GET',
    });
  },
};

// ──────────────────────────────────────
// 7. SIP Calculator
// ──────────────────────────────────────
export const sipAPI = {
  calculate: (monthlyInvestment, annualReturnRate, durationYears) => {
    return request('/sip/calculate', {
      method: 'POST',
      body: JSON.stringify({
        monthly_investment: Number(monthlyInvestment),
        annual_return_rate: Number(annualReturnRate),
        duration_years: Number(durationYears),
      }),
    });
  },
};

// ──────────────────────────────────────
// 8. Dashboard
// ──────────────────────────────────────
export const dashboardAPI = {
  get: () => {
    return request('/dashboard/', {
      method: 'GET',
    });
  },
};
