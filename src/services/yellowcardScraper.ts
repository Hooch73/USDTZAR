import axios from 'axios';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQLzrx4jp8kbj_t8Kr1GdFdkmZ9uolMJGmYtgeqSQMdYq0djxkgJ8FIwKD7EdvvdA6NLV5NdSV3CpX7/pub?gid=1120080669&single=true&output=csv';
const PROXY_URL = 'https://corsproxy.io/?';

export const getYellowcardUsdtZarPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(`${PROXY_URL}${CSV_URL}`);
    const data = response.data;
    const rows = data.split('\n').map((row: string) => row.trim());

    const zarRow = rows.find((row: string) => row.includes('South Africa') && row.includes('ZAR'));

    if (zarRow) {
      const columns = zarRow.split(',');
      const sellRate = parseFloat(columns[columns.length - 1]);
      if (!isNaN(sellRate)) {
        return sellRate;
      }
    }

    throw new Error('Could not find USDT/ZAR price in Yellowcard data');
  } catch (error) {
    console.error('Error fetching Yellowcard price:', error);
    throw error;
  }
};
