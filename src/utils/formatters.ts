/**
 * Pakistani Currency Formatter
 * Formats numbers into Lakh and Crore for Pakistani real estate context.
 */
export function formatPKR(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'PKR 0';

  if (amount >= 10000000) {
    const crore = (amount / 10000000).toFixed(2).replace(/\.00$/, '');
    return `PKR ${crore} Crore`;
  }
  if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(2).replace(/\.00$/, '');
    return `PKR ${lakh} Lakh`;
  }
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

/**
 * Format full exact number with thousands separator
 */
export function formatExactPKR(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rs. 0';
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

/**
 * Area Formatter
 */
export function formatArea(area: number, unit: string = 'Marla'): string {
  return `${area} ${unit}`;
}

/**
 * Generate standard WhatsApp click-to-chat URL with pre-filled message
 */
export function getWhatsAppUrl(phone: string = '+923005412890', message: string = ''): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
}

/**
 * Format date for friendly display
 */
export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-PK', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}
