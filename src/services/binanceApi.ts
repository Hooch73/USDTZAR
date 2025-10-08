import axios from 'axios';
import { usdtAggregator } from './usdtRateAggregator';

const API_BASE_URL = 'https://api.binance.com/api/v3/ticker';

export const getBinanceUsdtZarPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/price?symbol=USDTZAR`);
    return parseFloat(response.data.price);
  } catch (error) {
    console.error('Error fetching Binance USDT/ZAR price:', error);
    throw error;
  }
};

export const fetchBinanceGlobalUSDT = async (): Promise<number> => {
  const rate = await usdtAggregator.fetchAllSources();
  
  if (rate === null) {
    throw new Error('Could not fetch USD/USDT rate from any source');
  }
  
  return rate;
};
