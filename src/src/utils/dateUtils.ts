/**
 * Gets the current date and time formatted as strings.
 * @returns An object with `date` (YYYY-MM-DD) and `time` (HH:MM).
 */
export const getCurrentDateTime = () => {
  const now = new Date();
  const date = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const time = now.toTimeString().split(' ')[0].substring(0, 5); // Format: HH:MM
  return { date, time };
};