import { useState, useCallback, useEffect } from 'react';
import { PriceSource } from '../types';
import type { AllPrices } from '../types';
import { getValrUsdtZarPrice } from '../services/valrApi';
import { getBinanceUsdtZarPrice, fetchBinanceGlobalUSDT } from '../services/binanceApi';
import { getYellowcardUsdtZarPrice } from '../services/yellowcardScraper';
import { getUsdZarForexRate } from '../services/forexApi';

const REFRESH_INTERVAL = 30000; // 30 seconds

const initialPrices: AllPrices = {
  [PriceSource.VALR]: { source: PriceSource.VALR, price: null, lastUpdate: null, loading: true, error: null },
  [PriceSource.BinanceZA]: { source: PriceSource.BinanceZA, price: null, lastUpdate: null, loading: true, error: null },
  [PriceSource.Yellowcard]: { source: PriceSource.Yellowcard, price: null, lastUpdate: null, loading: true, error: null },
  [PriceSource.Forex]: { source: PriceSource.Forex, price: null, lastUpdate: null, loading: true, error: null },
  [PriceSource.BinanceGlobal]: { source: PriceSource.BinanceGlobal, price: null, lastUpdate: null, loading: true, error: null },
};

export const usePriceFetcher = () => {
  const [prices, setPrices] = useState<AllPrices>(initialPrices);

  const fetchPrices = useCallback(async () => {
    const fetchAndUpdate = async (source: PriceSource, fetchFn: () => Promise<number>) => {
      setPrices(p => ({ ...p, [source]: { ...p[source], loading: true, error: null } }));
      try {
        const price = await fetchFn();
        setPrices(p => ({ ...p, [source]: { source, price, lastUpdate: new Date(), loading: false, error: null } }));
      } catch (error) {
        setPrices(p => ({ ...p, [source]: { ...p[source], loading: false, error: 'Failed to fetch' } }));
      }
    };

    fetchAndUpdate(PriceSource.VALR, getValrUsdtZarPrice);
    fetchAndUpdate(PriceSource.BinanceZA, getBinanceUsdtZarPrice);
    fetchAndUpdate(PriceSource.Yellowcard, getYellowcardUsdtZarPrice);
    fetchAndUpdate(PriceSource.Forex, getUsdZarForexRate);
    fetchAndUpdate(PriceSource.BinanceGlobal, fetchBinanceGlobalUSDT);
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, refresh: fetchPrices };
};
