export interface ExchangeFees {
  maker: number;  // Percentage (e.g., 0.1 = 0.1%)
  taker: number;  // Percentage (e.g., 0.25 = 0.25%)
  hasSpread: boolean;  // If rate already includes spread
}

export const EXCHANGE_FEES: Record<string, ExchangeFees> = {
  VALR: {
    maker: 0.10,
    taker: 0.25,
    hasSpread: false,
  },
  'Binance ZA': {
    maker: 0.10,
    taker: 0.10,
    hasSpread: false,
  },
  Yellowcard: {
    maker: 0.00,
    taker: 0.00,
    hasSpread: true,  // Rate already includes their markup
  },
};

export interface EffectiveRate {
  source: string;
  baseRate: number;
  makerFee: number;
  takerFee: number;
  effectiveMakerRate: number;  // Base rate + maker fee
  effectiveTakerRate: number;  // Base rate + taker fee
  makerFeeCost: number;  // Absolute cost of maker fee in ZAR
  takerFeeCost: number;  // Absolute cost of taker fee in ZAR
}

/**
 * Calculate effective rate after fees
 * When BUYING USDT with ZAR, fees are ADDED to the price
 */
export function calculateEffectiveRate(
  source: string,
  baseRate: number
): EffectiveRate {
  const fees = EXCHANGE_FEES[source];
  
  if (!fees) {
    throw new Error(`No fee configuration for ${source}` );
  }

  // Calculate fee costs
  const makerFeeCost = baseRate * (fees.maker / 100);
  const takerFeeCost = baseRate * (fees.taker / 100);

  // Effective rate = base rate + fee
  const effectiveMakerRate = baseRate + makerFeeCost;
  const effectiveTakerRate = baseRate + takerFeeCost;

  return {
    source,
    baseRate,
    makerFee: fees.maker,
    takerFee: fees.taker,
    effectiveMakerRate,
    effectiveTakerRate,
    makerFeeCost,
    takerFeeCost,
  };
}
