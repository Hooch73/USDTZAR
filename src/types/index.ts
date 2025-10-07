export const PriceSource = {
  VALR: 'VALR',
  BinanceZA: 'Binance ZA',
  Yellowcard: 'Yellowcard',
  Forex: 'USD/ZAR Forex',
  BinanceGlobal: 'Binance Global',
} as const;

export type PriceSource = typeof PriceSource[keyof typeof PriceSource];

export interface PriceData {
  source: PriceSource;
  price: number | null;
  lastUpdate: Date | null;
  loading: boolean;
  error: string | null;
}

export type AllPrices = {
  [key in PriceSource]: PriceData;
};
