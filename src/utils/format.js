export function formatCurrency(value) {
  if (typeof value !== 'number') return value;
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
}

export default formatCurrency;
