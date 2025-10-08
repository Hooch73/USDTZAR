import { useState, useEffect, useRef } from 'react';
import type { AllPrices } from '../types';
import { format } from 'date-fns';

const MAX_HISTORY_LENGTH = 120; // 120 * 30s = 1 hour
const HISTORY_INTERVAL = 30000; // 30 seconds, same as fetch interval

export const usePriceHistory = (prices: AllPrices) => {
  const [history, setHistory] = useState<any[]>([]);
  const latestPricesRef = useRef<AllPrices>(prices);

  // Keep a ref of the latest prices to avoid re-triggering the interval setup
  useEffect(() => {
    latestPricesRef.current = prices;
  }, [prices]);

  // Set up an interval to capture the history
  useEffect(() => {
    const interval = setInterval(() => {
      const currentPrices = latestPricesRef.current;
      const allPricesAvailable = Object.values(currentPrices).every(p => p.price !== null);

      if (allPricesAvailable) {
        const newHistoryPoint = {
          time: format(new Date(), 'HH:mm'),
          ...Object.fromEntries(
            Object.entries(currentPrices).map(([source, data]) => [source, data.price])
          ),
        };

        setHistory(prevHistory => {
          const updatedHistory = [...prevHistory, newHistoryPoint];
          // Avoid duplicate timestamps
          if (prevHistory.length > 0 && prevHistory[prevHistory.length - 1].time === newHistoryPoint.time) {
            return prevHistory;
          }
          if (updatedHistory.length > MAX_HISTORY_LENGTH) {
            return updatedHistory.slice(updatedHistory.length - MAX_HISTORY_LENGTH);
          }
          return updatedHistory;
        });
      }
    }, HISTORY_INTERVAL);

    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs only once

  const getSparklineData = (source: keyof AllPrices) => {
    // Use the latest prices for the sparkline for real-time feel
    const currentPoint = { value: prices[source]?.price };
    const historicalPoints = history.slice(-9).map(h => ({ value: h[source] }));
    return [...historicalPoints, currentPoint].filter(p => p.value !== null);
  };

  return { history, getSparklineData };
};
