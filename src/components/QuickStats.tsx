import React from 'react';
import type { AllPrices } from '../types';
import { PriceSource } from '../types';

interface QuickStatsProps {
  prices: AllPrices;
}

const QuickStats: React.FC<QuickStatsProps> = ({ prices }) => {
  const forexRate = prices[PriceSource.Forex].price;
  const cryptoSources = [PriceSource.VALR, PriceSource.BinanceZA, PriceSource.Yellowcard];

  const calculatePremium = (usdtZarRate: number | null) => {
    if (usdtZarRate === null || forexRate === null) return null;
    return ((usdtZarRate / forexRate) - 1) * 100;
  };

  const premiums = cryptoSources
    .map(source => calculatePremium(prices[source].price))
    .filter((p): p is number => p !== null);

  const lowestPremium = premiums.length > 0 ? Math.min(...premiums) : null;
  const highestPremium = premiums.length > 0 ? Math.max(...premiums) : null;
  const averagePremium = premiums.length > 0 ? premiums.reduce((a, b) => a + b, 0) / premiums.length : null;

  const StatPill: React.FC<{ label: string; value: number | null; unit: string }> = ({ label, value, unit }) => (
    <div className="bg-surface/50 border border-card-border rounded-lg p-3 text-center backdrop-blur-sm">
      <div className="text-xs text-content-muted mb-1">{label}</div>
      <div className="text-lg font-bold text-content-primary">
        {value !== null ? `${value.toFixed(2)}${unit}` : 'N/A'}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatPill label="Lowest Premium" value={lowestPremium} unit="%" />
      <StatPill label="Highest Premium" value={highestPremium} unit="%" />
      <StatPill label="Average Premium" value={averagePremium} unit="%" />
    </div>
  );
};

export default QuickStats;
