import { useState, useEffect } from 'react';
import type { AllPrices } from '../types';
import { format } from 'date-fns';

const MAX_HISTORY_LENGTH = 120; // 120 * 30s = 1 hour

export const usePriceHistory = (prices: AllPrices) => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const allPricesAvailable = Object.values(prices).every(p => p.price !== null);

    if (allPricesAvailable) {
      const newHistoryPoint = {
        time: format(new Date(), 'HH:mm'),
        ...Object.fromEntries(Object.entries(prices).map(([source, data]) => [source, data.price])),
      };

      setHistory(prevHistory => {
        const updatedHistory = [...prevHistory, newHistoryPoint];
        if (updatedHistory.length > MAX_HISTORY_LENGTH) {
          return updatedHistory.slice(updatedHistory.length - MAX_HISTORY_LENGTH);
        }
        return updatedHistory;
      });
    }
  }, [prices]);

  return history;
};
