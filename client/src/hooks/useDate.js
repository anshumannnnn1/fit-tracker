import { useState } from 'react';
export const useDate = () => {
  const [date] = useState(() => new Date().toISOString().split('T')[0]);
  const display = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  return { date, display };
};
