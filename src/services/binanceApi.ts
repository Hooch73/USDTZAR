import axios from 'axios';

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

export const getBinanceGlobalUsdUsdtPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/price?symbol=USDCUSDT`);
    return parseFloat(response.data.price);
  } catch (error) {
    console.error('Error fetching Binance Global USDC/USDT price:', error);
    throw error;
  }
};
