import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';
import { PriceSource } from '../../types';
import type { AllPrices } from '../../types';
import { format } from 'date-fns';

interface HeaderProps {
  prices: AllPrices;
  refresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ prices, refresh }) => {
  const { logout } = useAuth();
  const calculatePremium = (usdtZarRate: number | null, forexRate: number | null) => {
    if (usdtZarRate === null || forexRate === null) return null;
    return ((usdtZarRate / forexRate) - 1) * 100;
  };

  const forexRate = prices[PriceSource.Forex].price;
  const cryptoSources = [PriceSource.VALR, PriceSource.BinanceZA, PriceSource.Yellowcard];

  const premiums = cryptoSources.map(source => ({
    source,
    premium: calculatePremium(prices[source].price, forexRate),
  }));

  const bestOpportunity = premiums.reduce((best, current) => 
    (current.premium !== null && (best.premium === null || current.premium < best.premium)) ? current : best
  , { source: null as PriceSource | null, premium: null as number | null });

  const getStatus = () => {
    if (bestOpportunity.premium === null) return { text: 'Connecting...', color: 'bg-neutral' };
    if (bestOpportunity.premium < -2) return { text: `🟢 Cheapest Source: ${bestOpportunity.source} @ ${bestOpportunity.premium.toFixed(2)}%`, color: 'bg-success' };
    if (bestOpportunity.premium < 0) return { text: `🟡 Cheaper Source: ${bestOpportunity.source} @ ${bestOpportunity.premium.toFixed(2)}%`, color: 'bg-warning' };
    return { text: '⚪ No Significant Discount', color: 'bg-neutral' };
  };

  const status = getStatus();
  const lastUpdate = prices[PriceSource.VALR].lastUpdate; // Use any source for last update time

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4 border-b border-card-border">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            <h1 className="text-xl font-bold text-content-primary hidden md:block">USDT/ZAR Rate Comparison</h1>
          </div>

          {bestOpportunity.premium !== null && (
            <div className={`px-4 py-2 rounded-lg text-sm font-bold text-white ${status.color} animate-pulse`}>
              Cheapest Source: {bestOpportunity.source} @ {bestOpportunity.premium.toFixed(2)}%
            </div>
          )}

          <div className="flex items-center gap-4">
            <span className="text-xs text-content-muted hidden sm:block">
              Last updated: {lastUpdate ? format(lastUpdate, 'HH:mm:ss') : 'N/A'}
            </span>
            <button 
              onClick={refresh} 
              className="bg-primary/20 hover:bg-primary/40 text-primary font-bold p-2 rounded-lg transition-colors duration-300"
              aria-label="Refresh prices"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M20 4l-5 5M4 20l5-5"></path></svg>
            </button>
            <button 
              onClick={logout} 
              className="bg-danger/20 hover:bg-danger/40 text-danger font-bold p-2 rounded-lg transition-colors duration-300"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className={`h-1 w-full ${status.color} transition-colors duration-500`}></div>
      </div>
    </header>
  );
};

export default Header;
