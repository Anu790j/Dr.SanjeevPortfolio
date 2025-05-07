/**
 * Displays a confirmation dialog and returns a promise that resolves to true if confirmed.
 * 
 * @param message The message to display in the confirmation dialog
 * @returns A promise that resolves to true if confirmed, false otherwise
 */
export function confirmDialog(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const confirmed = window.confirm(message);
    resolve(confirmed);
  });
} 