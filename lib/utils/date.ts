import { format as dateFnsFormat, formatDistanceToNow } from "date-fns";

/**
 * Format a UTC date string to local time
 * @param dateString - ISO 8601 date string (stored as UTC in database)
 * @param formatString - date-fns format string
 * @returns Formatted date string in user's local timezone
 */
export function formatLocalDate(dateString: string, formatString: string = "MMM d, yyyy"): string {
  const date = new Date(dateString);
  return dateFnsFormat(date, formatString);
}

/**
 * Format a UTC date string to local time with time
 * @param dateString - ISO 8601 date string (stored as UTC in database)
 * @returns Formatted date and time string in user's local timezone
 */
export function formatLocalDateTime(dateString: string): string {
  const date = new Date(dateString);
  return dateFnsFormat(date, "MMM d, yyyy 'at' HH:mm");
}

/**
 * Format a UTC date string to local time (time only)
 * @param dateString - ISO 8601 date string (stored as UTC in database)
 * @returns Formatted time string in user's local timezone
 */
export function formatLocalTime(dateString: string): string {
  const date = new Date(dateString);
  return dateFnsFormat(date, "HH:mm");
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 * @param dateString - ISO 8601 date string (stored as UTC in database)
 * @returns Relative time string in user's local timezone
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Get current date/time as ISO string (for database storage)
 * @returns ISO 8601 date string in UTC
 */
export function getCurrentUTC(): string {
  return new Date().toISOString();
}

/**
 * Check if a date is in the past (in user's local timezone)
 * @param dateString - ISO 8601 date string
 * @returns true if date is in the past
 */
export function isPastDate(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

/**
 * Check if a date is in the future (in user's local timezone)
 * @param dateString - ISO 8601 date string
 * @returns true if date is in the future
 */
export function isFutureDate(dateString: string): boolean {
  return new Date(dateString) > new Date();
}
