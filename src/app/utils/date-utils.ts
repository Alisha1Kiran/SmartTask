export function convertTimestampToDate(timestamp: any): Date | null {
  if (!timestamp) return null;
  return typeof timestamp.toDate === 'function'
    ? timestamp.toDate()
    : timestamp;
}
