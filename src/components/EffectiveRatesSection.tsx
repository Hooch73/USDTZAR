import React from 'react';
import { Calculator, Info, TrendingDown } from 'lucide-react';
import EffectiveRateCard from './EffectiveRateCard';
import { calculateEffectiveRate } from '../config/exchangeFees';
import type { EffectiveRate } from '../config/exchangeFees';
import { PriceSource } from '../types';
import type { AllPrices } from '../types';

interface EffectiveRatesSectionProps {
  prices: AllPrices;
}

const EffectiveRatesSection: React.FC<EffectiveRatesSectionProps> = ({ prices }) => {
  // Calculate effective rates for exchanges that trade ZAR/USDT
  const calculateRates = (): EffectiveRate[] => {
    const rates: EffectiveRate[] = [];

    // VALR
    if (prices[PriceSource.VALR].price) {
      rates.push(calculateEffectiveRate(PriceSource.VALR, prices[PriceSource.VALR].price!));
    }

    // Binance ZA
    if (prices[PriceSource.BinanceZA].price) {
      rates.push(calculateEffectiveRate(PriceSource.BinanceZA, prices[PriceSource.BinanceZA].price!));
    }

    // Yellowcard
    if (prices[PriceSource.Yellowcard].price) {
      rates.push(calculateEffectiveRate(PriceSource.Yellowcard, prices[PriceSource.Yellowcard].price!));
    }

    return rates;
  };

  const effectiveRates = calculateRates();

  if (effectiveRates.length === 0) {
    return null;
  }

  // Find cheapest maker and taker rates
  const cheapestMaker = effectiveRates.reduce((min, rate) => 
    rate.effectiveMakerRate < min.effectiveMakerRate ? rate : min
  , effectiveRates[0]);

  const cheapestTaker = effectiveRates.reduce((min, rate) => 
    rate.effectiveTakerRate < min.effectiveTakerRate ? rate : min
  , effectiveRates[0]);

  // Find absolute cheapest option
  const absoluteCheapest = cheapestMaker.effectiveMakerRate < cheapestTaker.effectiveTakerRate 
    ? { ...cheapestMaker, type: 'Maker' as const }
    : { ...cheapestTaker, type: 'Taker' as const };

  const absoluteCheapestRate = absoluteCheapest.type === 'Maker' 
    ? absoluteCheapest.effectiveMakerRate 
    : absoluteCheapest.effectiveTakerRate;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Calculator className="text-primary" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-content-primary">Effective Rates (After Trading Fees)</h2>
          <p className="text-sm text-content-muted">True cost to acquire USDT - compare maker vs taker fees</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 flex items-start gap-2">
        <Info size={16} className="text-primary mt-0.5 flex-shrink-0" />
        <div className="text-xs text-content-secondary">
          <strong className="text-content-primary">Maker fees</strong> apply to limit orders (you wait for your price, lower fees). 
          <strong className="text-content-primary ml-2">Taker fees</strong> apply to market orders (instant execution, higher fees).
          <span className="block mt-1 text-content-muted">
            Yellowcard's displayed rate already includes their markup - no additional trading fees are charged.
          </span>
        </div>
      </div>

      {/* Effective Rate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {effectiveRates.map(rate => {
          const isCheapestMaker = rate.source === cheapestMaker.source;
          const isCheapestTaker = rate.source === cheapestTaker.source;
          const makerCostDifference = rate.effectiveMakerRate - cheapestMaker.effectiveMakerRate;
          const takerCostDifference = rate.effectiveTakerRate - cheapestTaker.effectiveTakerRate;

          return (
            <EffectiveRateCard
              key={rate.source}
              source={rate.source}
              baseRate={rate.baseRate}
              makerFee={rate.makerFee}
              takerFee={rate.takerFee}
              effectiveMakerRate={rate.effectiveMakerRate}
              effectiveTakerRate={rate.effectiveTakerRate}
              makerFeeCost={rate.makerFeeCost}
              takerFeeCost={rate.takerFeeCost}
              isCheapestMaker={isCheapestMaker}
              isCheapestTaker={isCheapestTaker}
              makerCostDifference={makerCostDifference}
              takerCostDifference={takerCostDifference}
            />
          );
        })}
      </div>

      {/* Summary Box */}
      <div className="bg-gradient-to-r from-success/10 to-success/5 border-2 border-success/30 rounded-lg p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Best Overall */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="text-success" size={18} />
              <h3 className="text-sm font-semibold text-content-primary">Absolute Best Rate</h3>
            </div>
            <p className="text-2xl font-bold text-success">{absoluteCheapest.source}</p>
            <p className="text-xs text-content-muted mt-1">
              {absoluteCheapest.type} • R {absoluteCheapestRate.toFixed(4)}
            </p>
          </div>

          {/* Savings Calculation */}
          <div>
            <h3 className="text-sm font-semibold text-content-primary mb-2">Savings on R10,000</h3>
            <p className="text-2xl font-bold text-success">
              {(() => {
                const worstRate = Math.max(
                  ...effectiveRates.flatMap(r => [r.effectiveMakerRate, r.effectiveTakerRate])
                );
                const savingsPerUnit = worstRate - absoluteCheapestRate;
                const unitsFor10k = 10000 / absoluteCheapestRate;
                const totalSavings = savingsPerUnit * unitsFor10k;
                return `R ${totalSavings.toFixed(2)}` ;
              })()}
            </p>
            <p className="text-xs text-content-muted mt-1">vs worst option</p>
          </div>

          {/* USDT Acquired */}
          <div>
            <h3 className="text-sm font-semibold text-content-primary mb-2">USDT for R10,000</h3>
            <p className="text-2xl font-bold text-content-primary font-mono">
              {(10000 / absoluteCheapestRate).toFixed(4)}
            </p>
            <p className="text-xs text-content-muted mt-1">at best rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EffectiveRatesSection;
