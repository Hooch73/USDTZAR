import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PriceSource } from '../types';
import type { PriceData } from '../types';
import { format } from 'date-fns';
import PremiumBadge from './common/PremiumBadge';
import MiniSparkline from './common/MiniSparkline';
import USDTSourcesInfo from './common/USDTSourcesInfo';

interface PriceCardProps {
  data: PriceData;
  sparklineData: { value: number }[];
  forexRate: number | null;
}

const sourceUrls: { [key in PriceSource]?: string } = {
  [PriceSource.VALR]: 'https://www.valr.com/buy/usdt',
  [PriceSource.BinanceZA]: 'https://www.binance.com/en/trade/USDT_ZAR',
  [PriceSource.Yellowcard]: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQLzrx4jp8kbj_t8Kr1GdFdkmZ9uolMJGmYtgeqSQMdYq0djxkgJ8FIwKD7EdvvdA6NLV5NdSV3CpX7/pubhtml?gid=1120080669&single=true',
  [PriceSource.BinanceGlobal]: 'https://www.binance.com/en/convert/USDT/USD',
  [PriceSource.Forex]: 'https://www.exchangerate-api.com/',
};

const PriceCard: React.FC<PriceCardProps> = ({ data, sparklineData, forexRate }) => {
  const [flashClass, setFlashClass] = useState('');
  const prevPriceRef = useRef<number | null>(null);
  const { source, price, lastUpdate, loading, error } = data;

  useEffect(() => {
    if (prevPriceRef.current !== undefined && price !== null && prevPriceRef.current !== null) {
      if (price > prevPriceRef.current) {
        setFlashClass('animate-flash-green');
      } else if (price < prevPriceRef.current) {
        setFlashClass('animate-flash-red');
      }
      const timer = setTimeout(() => setFlashClass(''), 600);
      return () => clearTimeout(timer);
    }
  }, [price]);

  useEffect(() => {
    prevPriceRef.current = price;
  });
  const url = sourceUrls[source];

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
      <div className="bg-card-bg/50 border border-card-border rounded-2xl p-6 shadow-lg animate-pulse backdrop-blur-sm">
        <div className="h-6 bg-surface rounded w-3/4 mb-4"></div>
        <div className="h-10 bg-surface rounded w-1/2 mb-4"></div>
        <div className="h-12 bg-surface rounded w-full"></div>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-card flex flex-col h-full"
      variants={cardVariants}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {getLogo()}
          <div>
            <h3 className="text-lg font-semibold text-content-primary">{source === PriceSource.BinanceGlobal ? 'USD to USDT' : source}</h3>
            <p className="text-xs text-content-muted">
  {source === PriceSource.Forex 
    ? 'USD/ZAR Spot' 
    : source === PriceSource.BinanceGlobal 
    ? 'Aggregated Rate' 
    : 'USDT/ZAR'
  }
</p>
          </div>
        </div>
        {premium !== null && <PremiumBadge premium={premium} />}
      </div>

      <div className="mb-4">
        <div className={`text-4xl font-bold text-content-primary tabular-nums rounded-md ${flashClass}`}>{error ? 'Error' : price ? price.toFixed(4) : 'N/A'}</div>
        <div className="text-sm text-content-secondary">
  {source === PriceSource.Forex 
    ? 'ZAR per USD' 
    : source === PriceSource.BinanceGlobal 
    ? 'USD per USDT' 
    : 'ZAR per USDT'
  }
</div>
{source === PriceSource.BinanceGlobal && price !== null && (
  <div className={`text-xs mt-1 font-semibold ${
    Math.abs(price - 1) > 0.005 ? 'text-warning' : 'text-success'
  }`}>
    {price > 1.005 ? '⚠️ Premium: ' : price < 0.995 ? '⚠️ Discount: ' : '✓ On Peg: '}
    {((price - 1) * 100).toFixed(2)}%
  </div>
)}
      </div>

      <MiniSparkline data={sparklineData} color={premium === null ? '#6b7280' : premium < 0 ? '#10b981' : '#ef4444'} />

      <div className="flex-grow"></div>

      <div className="text-xs text-content-muted mt-4 flex justify-between items-center">
        <span>{lastUpdate ? `Updated: ${format(lastUpdate, 'HH:mm:ss')}` : ''}</span>
        {url && source !== PriceSource.BinanceGlobal && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Link to Source Data
          </a>
        )}
      </div>

      {source === PriceSource.BinanceGlobal && <USDTSourcesInfo />}
    </motion.div>
  );
};

export default PriceCard;
