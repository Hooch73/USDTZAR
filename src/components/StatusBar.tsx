import React from 'react';
import type { AllPrices } from '../types';

interface StatusBarProps {
  prices: AllPrices;
}

const StatusBar: React.FC<StatusBarProps> = ({ prices }) => {
  const hasError = Object.values(prices).some(p => p.error);
  const allLoading = Object.values(prices).every(p => p.loading);

  let statusText = 'All systems normal';
  let statusColor = 'bg-green-500';

  if (allLoading) {
    statusText = 'Initializing...';
    statusColor = 'bg-blue-500';
  } else if (hasError) {
    statusText = 'One or more price feeds are unavailable.';
    statusColor = 'bg-red-500';
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-2 text-white text-center ${statusColor}`}>
      {statusText}
    </div>
  );
};

export default StatusBar;
