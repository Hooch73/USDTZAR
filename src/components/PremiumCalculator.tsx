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
    if (premium < -2) return 'text-green-500';
    if (premium < 0) return 'text-yellow-500';
    return 'text-red-500';
  };

  const cryptoSources = [PriceSource.VALR, PriceSource.BinanceZA, PriceSource.Yellowcard];

  return (
    <div className="bg-surface/50 border border-card-border rounded-2xl p-6 shadow-lg backdrop-blur-sm">
      <h3 className="font-bold text-xl mb-4 text-content-primary">Arbitrage Premium</h3>
      <div className="space-y-4">
        {cryptoSources
          .map(source => ({
            source,
            premium: calculatePremium(prices[source].price),
          }))
          .sort((a, b) => (a.premium ?? Infinity) - (b.premium ?? Infinity))
          .map(({ source, premium }) => {
                    const isLoading = prices[source].loading || prices[PriceSource.Forex].loading;

          return (
            <div key={source} className="grid grid-cols-[100px_1fr_50px] items-center gap-4">
              <span className="font-semibold text-content-secondary text-sm">{source}</span>
              <div className="w-full bg-surface rounded-full h-4">
                {isLoading ? (
                  <div className="bg-surface-1 h-4 rounded-full animate-pulse"></div>
                ) : (
                  <div 
                    className={`h-4 rounded-full ${getPremiumColor(premium)} transition-all duration-500`}
                    style={{ width: `${Math.min(Math.abs(premium || 0) * 20, 100)}%` }}
                  ></div>
                )}
              </div>
              <span className={`font-bold text-sm ${getPremiumColor(premium)}`}>
                {premium !== null ? `${premium.toFixed(2)}%` : 'N/A'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PremiumCalculator;
