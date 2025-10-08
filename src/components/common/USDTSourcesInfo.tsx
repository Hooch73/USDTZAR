import React from 'react';
import { usdtAggregator } from '../../services/usdtRateAggregator';
import { Info, AlertTriangle } from 'lucide-react';

const USDTSourcesInfo: React.FC = () => {
  const sources = usdtAggregator.getSources();
  const spread = usdtAggregator.getSpread();

  if (sources.length === 0) return null;

  const isHighSpread = spread > 0.5;

  return (
    <div className="text-xs text-content-muted mt-3 p-3 bg-surface/50 rounded-lg border border-card-border">
      <div className="flex items-center gap-1.5 mb-2 font-semibold text-content-secondary">
        <Info size={12} />
        <span>Aggregated from {sources.length} source{sources.length > 1 ? 's' : ''}</span>
      </div>
      
      <div className="space-y-1">
        {sources.map(source => (
          <div key={source.name} className="flex justify-between items-center">
            <span className="text-content-muted">{source.name}:</span>
            <span className="font-mono text-content-primary font-semibold">
              ${source.price.toFixed(4)}
            </span>
          </div>
        ))}
      </div>
      
      <div className={`mt-2 pt-2 border-t border-card-border flex justify-between items-center ${
        isHighSpread ? 'text-warning' : 'text-success'
      }`}>
        {isHighSpread && <AlertTriangle size={12} />}
        <span className="font-semibold">Spread:</span>
        <span className="font-mono font-bold">
          {spread.toFixed(3)}%
        </span>
      </div>
      
      {isHighSpread && (
        <div className="mt-2 text-warning text-[10px] flex items-start gap-1">
          <AlertTriangle size={10} className="mt-0.5 flex-shrink-0" />
          <span>High spread detected - market volatility or de-pegging risk</span>
        </div>
      )}
    </div>
  );
};

export default USDTSourcesInfo;
