import axios from 'axios';

const API_URL = 'https://corsproxy.io/?https://api.valr.com/v1/public/USDTZAR/marketsummary';

export const getValrUsdtZarPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(API_URL);
    return parseFloat(response.data.lastTradedPrice);
  } catch (error) {
    console.error('Error fetching VALR price:', error);
    throw error;
  }
};
