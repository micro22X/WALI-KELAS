/**
 * Utility functions for real-time Indonesian Date and Time formatting
 */

export function getTodayDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatIndonesianDate(
  dateInput?: string | Date | null,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput.includes('T') ? dateInput : `${dateInput}T00:00:00`) : dateInput;
  if (isNaN(date.getTime())) return '';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('id-ID', options || defaultOptions).format(date);
}

export function formatShortIndonesianDate(dateInput?: string | Date | null): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput.includes('T') ? dateInput : `${dateInput}T00:00:00`) : dateInput;
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function getFormattedCurrentTime(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `pk ${hours}.${minutes} WIB`;
}

export function getCurrentAcademicYear(date: Date = new Date()): string {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1; // 1-12
  // Semester 1 starts July (month >= 7), so year is current/next.
  // Semester 2 is Jan-June, so year is previous/current.
  if (currentMonth >= 7) {
    return `${currentYear}/${currentYear + 1}`;
  } else {
    return `${currentYear - 1}/${currentYear}`;
  }
}
