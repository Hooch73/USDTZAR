import React from 'react';
import { PriceSource } from '../types';
import type { PriceData } from '../types';
import { format } from 'date-fns';
import PremiumBadge from './common/PremiumBadge';
import MiniSparkline from './common/MiniSparkline';

interface PriceCardProps {
  data: PriceData;
  sparklineData: { value: number }[];
  forexRate: number | null;
}

const PriceCard: React.FC<PriceCardProps> = ({ data, sparklineData, forexRate }) => {
  const { source, price, lastUpdate, loading, error } = data;

  const calculatePremium = () => {
    if (price === null || forexRate === null) return null;
    return ((price / forexRate) - 1) * 100;
  };

  const premium = source !== PriceSource.Forex && source !== PriceSource.BinanceGlobal ? calculatePremium() : null;

  const getLogo = () => {
    const initial = source.charAt(0);
    const colors = {
      [PriceSource.VALR]: 'from-blue-500 to-purple-600',
      [PriceSource.BinanceZA]: 'from-yellow-500 to-orange-600',
      [PriceSource.Yellowcard]: 'from-yellow-400 to-yellow-500',
      [PriceSource.Forex]: 'from-green-500 to-teal-600',
      [PriceSource.BinanceGlobal]: 'from-gray-500 to-gray-600',
    };
    return (
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colors[source]} flex items-center justify-center`}>
        <span className="text-white font-bold text-xl">{initial}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-card-background/50 border border-card-border rounded-2xl p-6 shadow-lg animate-pulse backdrop-blur-sm">
        <div className="h-6 bg-surface rounded w-3/4 mb-4"></div>
        <div className="h-10 bg-surface rounded w-1/2 mb-4"></div>
        <div className="h-12 bg-surface rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-card-background border border-card-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 group hover:scale-[1.02] transform">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {getLogo()}
          <div>
            <h3 className="text-lg font-semibold text-content-primary">{source}</h3>
            <p className="text-xs text-content-muted">{source === PriceSource.Forex ? 'USD/ZAR Spot' : source === PriceSource.BinanceGlobal ? 'USD / USDT' : 'USDT/ZAR'}</p>
          </div>
        </div>
        {premium !== null && <PremiumBadge premium={premium} />}
      </div>

      <div className="mb-4">
        <div className="text-4xl font-bold text-content-primary tabular-nums">{error ? 'Error' : price ? price.toFixed(4) : 'N/A'}</div>
        <div className="text-sm text-content-secondary">{source === PriceSource.Forex ? 'ZAR per USD' : source === PriceSource.BinanceGlobal ? 'USDT per USD' : 'ZAR per USDT'}</div>
      </div>

      <MiniSparkline data={sparklineData} color={premium === null ? '#6b7280' : premium > 0 ? '#10b981' : '#ef4444'} />

      <div className="text-xs text-content-muted mt-4">
        {lastUpdate ? `Updated: ${format(lastUpdate, 'HH:mm:ss')}` : ''}
      </div>
    </div>
  );
};

export default PriceCard;
