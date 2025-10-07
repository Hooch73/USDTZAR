import React from 'react';
import type { AllPrices } from '../types';

interface StatusBarProps {
  prices: AllPrices;
}

const StatusBar: React.FC<StatusBarProps> = ({ prices }) => {
  const hasError = Object.values(prices).some(p => p.error);
  const allLoading = Object.values(prices).every(p => p.loading);

  let statusText = 'All systems normal';
  if (allLoading) {
    statusText = 'Initializing...';
  } else if (hasError) {
    statusText = 'One or more price feeds are unavailable.';
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-lg border-t border-card-border p-2">
      <div className="container mx-auto flex justify-between items-center text-xs text-content-muted">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${hasError ? 'bg-danger' : 'bg-success'} animate-pulse`}></div>
          <span>{statusText}</span>
        </div>
        <div className="hidden md:block">
          Powered by VALR, Binance, Yellowcard, and ExchangeRate-API
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;
