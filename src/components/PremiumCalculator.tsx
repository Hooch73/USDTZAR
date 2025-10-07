import React from 'react';
import { PriceSource } from '../types';
import type { AllPrices } from '../types';

interface PremiumCalculatorProps {
  prices: AllPrices;
}

const PremiumCalculator: React.FC<PremiumCalculatorProps> = ({ prices }) => {
  const forexRate = prices[PriceSource.Forex].price;

  const calculatePremium = (usdtZarRate: number | null) => {
    if (usdtZarRate === null || forexRate === null) {
      return null;
    }
    return ((usdtZarRate / forexRate) - 1) * 100;
  };

  const getPremiumColor = (premium: number | null) => {
    if (premium === null) return 'text-gray-400';
    if (premium > 2) return 'text-green-500';
    if (premium > 0) return 'text-yellow-500';
    return 'text-red-500';
  };

  const cryptoSources = [PriceSource.VALR, PriceSource.BinanceZA, PriceSource.Yellowcard];

  return (
    <div className="bg-surface-0 p-6 rounded-lg shadow-lg border border-surface-1">
      <h3 className="font-bold text-xl mb-4 text-text-primary">Arbitrage Premium</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cryptoSources.map(source => {
          const premium = calculatePremium(prices[source].price);
          const isLoading = prices[source].loading || prices[PriceSource.Forex].loading;

          return (
            <div key={source} className="bg-surface-1 p-4 rounded-lg text-center">
              <p className="font-semibold text-text-secondary text-sm mb-1">{source}</p>
              {isLoading ? (
                <div className="h-8 bg-surface-0 rounded w-1/2 mx-auto mt-1 animate-pulse"></div>
              ) : (
                <p className={`text-2xl font-bold ${getPremiumColor(premium)}`}>
                  {premium !== null ? `${premium.toFixed(2)}%` : 'N/A'}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PremiumCalculator;
