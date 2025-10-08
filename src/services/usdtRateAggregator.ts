import axios from 'axios';

interface USDTRateSource {
  name: string;
  price: number;
  timestamp: number;
}

export class USDTRateAggregator {
  private sources: USDTRateSource[] = [];
  
  /**
   * Fetches USD/USDT rate from all sources and returns averaged rate
   */
  async fetchAllSources(): Promise<number | null> {
    const results = await Promise.allSettled([
      this.fetchBinance(),
      this.fetchKraken(),
      this.fetchCoinGecko(),
    ]);

    this.sources = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value !== null) {
        this.sources.push(result.value);
      } else {
        console.warn(`USD/USDT Source ${index + 1} failed:` , 
          result.status === 'rejected' ? result.reason : 'No data');
      }
    });

    if (this.sources.length === 0) {
      console.error('All USD/USDT sources failed');
      return null;
    }

    return this.calculateAverageRate();
  }

  /**
   * Fetch from Binance using USDC/USDT pair (inverted)
   */
  private async fetchBinance(): Promise<USDTRateSource | null> {
    try {
      const response = await axios.get(
        'https://api.binance.com/api/v3/ticker/price?symbol=USDCUSDT',
        { timeout: 5000 }
      );
      const price = 1 / parseFloat(response.data.price);
      return {
        name: 'Binance',
        price,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Binance USD/USDT fetch failed:', error);
      return null;
    }
  }

  /**
   * Fetch from Kraken using direct USDT/USD pair
   */
  private async fetchKraken(): Promise<USDTRateSource | null> {
    try {
      const response = await axios.get(
        'https://api.kraken.com/0/public/Ticker?pair=USDTUSD',
        { timeout: 5000 }
      );
      const data = response.data.result;
      const pairKey = Object.keys(data)[0];
      const price = parseFloat(data[pairKey].c[0]);
      
      return {
        name: 'Kraken',
        price,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Kraken USD/USDT fetch failed:', error);
      return null;
    }
  }

  /**
   * Fetch from CoinGecko aggregated price
   */
  private async fetchCoinGecko(): Promise<USDTRateSource | null> {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd',
        { timeout: 5000 }
      );
      const price = response.data.tether.usd;
      
      return {
        name: 'CoinGecko',
        price,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('CoinGecko USD/USDT fetch failed:', error);
      return null;
    }
  }

  /**
   * Calculate average rate, removing outliers if 3+ sources available
   */
  private calculateAverageRate(): number {
    if (this.sources.length === 0) return 1.0;

    let prices = this.sources.map(s => s.price);
    
    // Remove outliers using IQR method if we have 3+ sources
    if (prices.length >= 3) {
      const originalLength = prices.length;
      prices = this.removeOutliers(prices);
      
      if (prices.length < originalLength) {
        console.log(`Removed ${originalLength - prices.length} outlier(s)` );
      }
    }

    // Calculate average
    const sum = prices.reduce((acc, price) => acc + price, 0);
    const average = sum / prices.length;

    console.log('USD/USDT Sources:', this.sources.map(s => 
      `${s.name}: $${s.price.toFixed(4)}` 
    ).join(', '));
    console.log('Final Average:', average.toFixed(6));

    return average;
  }

  /**
   * Remove statistical outliers using Interquartile Range (IQR) method
   */
  private removeOutliers(data: number[]): number[] {
    if (data.length < 3) return data;

    const sorted = [...data].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    const filtered = data.filter(x => x >= lowerBound && x <= upperBound);
    
    // If all removed, return original data
    if (filtered.length === 0) return data;
    
    return filtered;
  }

  /**
   * Get all source data for display
   */
  getSources(): USDTRateSource[] {
    return this.sources;
  }

  /**
   * Calculate spread percentage between highest and lowest sources
   */
  getSpread(): number {
    if (this.sources.length < 2) return 0;
    const prices = this.sources.map(s => s.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return ((max - min) / min) * 100;
  }
}

// Export singleton instance
export const usdtAggregator = new USDTRateAggregator();
