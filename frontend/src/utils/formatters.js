// Pure JavaScript - Number, Currency, and Date Formatters

export const formatCurrency = (value, currency = 'USD') => {
  const num = Number(value);
  if (isNaN(num)) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatNumber = (value, decimals = 2) => {
  const num = Number(value);
  if (isNaN(num)) return '0.00';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatPercent = (value) => {
  const num = Number(value);
  if (isNaN(num)) return '0.00%';

  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};
