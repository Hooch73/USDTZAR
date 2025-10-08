import React from 'react';
import { TrendingUp, Award, DollarSign, Clock, Zap } from 'lucide-react';

interface EffectiveRateCardProps {
  source: string;
  baseRate: number;
  makerFee: number;
  takerFee: number;
  effectiveMakerRate: number;
  effectiveTakerRate: number;
  makerFeeCost: number;
  takerFeeCost: number;
  isCheapestMaker: boolean;
  isCheapestTaker: boolean;
  makerCostDifference: number;
  takerCostDifference: number;
}

const EffectiveRateCard: React.FC<EffectiveRateCardProps> = ({
  source,
  baseRate,
  makerFee,
  takerFee,
  effectiveMakerRate,
  effectiveTakerRate,
  makerFeeCost,
  takerFeeCost,
  isCheapestMaker,
  isCheapestTaker,
  makerCostDifference,
  takerCostDifference,
}) => {
  const isOverallCheapest = isCheapestMaker || isCheapestTaker;

  const getLogo = () => {
    const initial = source.charAt(0);
    const colors: Record<string, string> = {
      'VALR': 'from-blue-500 to-purple-600',
      'Binance ZA': 'from-yellow-500 to-orange-600',
      'Yellowcard': 'from-yellow-400 to-yellow-500',
    };
    return (
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors[source] || 'from-gray-500 to-gray-600'} flex items-center justify-center` }>
        <span className="text-white font-bold text-lg">{initial}</span>
      </div>
    );
  };

  return (
    <div className={`bg-card-bg border-2 ${
      isOverallCheapest ? 'border-success shadow-glow-green' : 'border-card-border'
    } rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 relative`}>
      
      {/* Cheapest Badge */}
      {isOverallCheapest && (
        <div className="absolute -top-3 -right-3 bg-success text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse-slow">
          <Award size={14} />
          {isCheapestMaker && isCheapestTaker ? 'BEST RATES' : isCheapestMaker ? 'BEST MAKER' : 'BEST TAKER'}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {getLogo()}
        <div>
          <h3 className="text-base font-semibold text-content-primary">{source}</h3>
          <p className="text-xs text-content-muted">Effective Rates (After Fees)</p>
        </div>
      </div>

      {/* Base Rate */}
      <div className="mb-4 pb-3 border-b border-card-border">
        <div className="flex justify-between items-center">
          <span className="text-xs text-content-muted">Base Rate:</span>
          <span className="text-lg font-semibold text-content-secondary font-mono">R {baseRate.toFixed(4)}</span>
        </div>
      </div>

      {/* Maker Section */}
      <div className={`mb-3 p-3 rounded-lg ${isCheapestMaker ? 'bg-success/10 border border-success/30' : 'bg-surface/50'}` }>
        <div className="flex items-center gap-2 mb-2">
          <Clock size={14} className="text-primary" />
          <span className="text-xs font-semibold text-content-primary">MAKER (Limit Orders)</span>
          {isCheapestMaker && <Award size={12} className="text-success" />}
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-content-muted">Fee ({makerFee}%):</span>
            <span className={`font-mono ${makerFee > 0 ? 'text-danger' : 'text-success'}` }>
              {makerFee > 0 ? '+' : ''}R {makerFeeCost.toFixed(4)}
            </span>
          </div>
          
          <div className="flex justify-between items-center pt-1 border-t border-card-border/50">
            <span className="text-content-primary font-semibold text-xs">Effective Rate:</span>
            <span className="text-xl font-bold text-content-primary font-mono">
              R {effectiveMakerRate.toFixed(4)}
            </span>
          </div>

          {!isCheapestMaker && makerCostDifference > 0 && (
            <div className="flex items-center justify-between text-[10px] pt-1">
              <span className="text-content-muted flex items-center gap-0.5">
                <TrendingUp size={10} className="text-danger" />
                vs best:
              </span>
              <span className="text-danger font-semibold">
                +R {makerCostDifference.toFixed(4)} ({((makerCostDifference / effectiveMakerRate) * 100).toFixed(2)}%)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Taker Section */}
      <div className={`p-3 rounded-lg ${isCheapestTaker ? 'bg-success/10 border border-success/30' : 'bg-surface/50'}` }>
        <div className="flex items-center gap-2 mb-2">
          <Zap size={14} className="text-warning" />
          <span className="text-xs font-semibold text-content-primary">TAKER (Market Orders)</span>
          {isCheapestTaker && <Award size={12} className="text-success" />}
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-content-muted">Fee ({takerFee}%):</span>
            <span className={`font-mono ${takerFee > 0 ? 'text-danger' : 'text-success'}` }>
              {takerFee > 0 ? '+' : ''}R {takerFeeCost.toFixed(4)}
            </span>
          </div>
          
          <div className="flex justify-between items-center pt-1 border-t border-card-border/50">
            <span className="text-content-primary font-semibold text-xs">Effective Rate:</span>
            <span className="text-xl font-bold text-content-primary font-mono">
              R {effectiveTakerRate.toFixed(4)}
            </span>
          </div>

          {!isCheapestTaker && takerCostDifference > 0 && (
            <div className="flex items-center justify-between text-[10px] pt-1">
              <span className="text-content-muted flex items-center gap-0.5">
                <TrendingUp size={10} className="text-danger" />
                vs best:
              </span>
              <span className="text-danger font-semibold">
                +R {takerCostDifference.toFixed(4)} ({((takerCostDifference / effectiveTakerRate) * 100).toFixed(2)}%)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Zero Fees Badge */}
      {makerFee === 0 && takerFee === 0 && (
        <div className="mt-3 pt-3 border-t border-card-border">
          <div className="flex items-center justify-center gap-1 text-xs text-success font-semibold">
            <DollarSign size={12} />
            <span>Zero Trading Fees - Rate Includes Spread</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EffectiveRateCard;
