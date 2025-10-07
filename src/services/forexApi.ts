import axios from 'axios';

const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

export const getUsdZarForexRate = async (): Promise<number> => {
  try {
    const response = await axios.get(API_URL);
    return response.data.rates.ZAR;
  } catch (error) {
    console.error('Error fetching USD/ZAR forex rate:', error);
    throw error;
  }
};
