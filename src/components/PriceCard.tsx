import React from 'react';
import type { PriceData } from '../types';
import { format } from 'date-fns';

interface PriceCardProps {
  data: PriceData;
}

const PriceCard: React.FC<PriceCardProps> = ({ data }) => {
  const { source, price, lastUpdate, loading, error } = data;

  if (loading) {
    return (
      <div className="bg-surface-0 p-4 rounded-lg shadow-lg animate-pulse">
        <div className="h-4 bg-surface-1 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-surface-1 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-surface-1 rounded w-1/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-surface-0 p-4 rounded-lg shadow-lg border border-surface-1">
      <h3 className="font-semibold text-text-secondary text-sm mb-1">{source}</h3>
      {error && <p className="text-red-500 text-sm">Failed to load</p>}
      {price !== null && (
        <div>
          <p className="text-2xl font-bold text-text-primary">{price.toFixed(4)}</p>
          {lastUpdate && (
            <p className="text-xs text-text-secondary mt-1">
              {format(lastUpdate, 'HH:mm:ss')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceCard;
