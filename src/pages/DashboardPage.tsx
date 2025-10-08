import React from 'react';
import { usePriceFetcher } from '../hooks/usePriceFetcher';
import { usePriceHistory } from '../hooks/usePriceHistory';
import PriceCard from '../components/PriceCard';
import PremiumCalculator from '../components/PremiumCalculator';
import PriceChart from '../components/PriceChart';
import StatusBar from '../components/StatusBar';
import Header from '../components/layout/Header';
import EffectiveRatesSection from '../components/EffectiveRatesSection';
import { PriceSource } from '../types';
import QuickStats from '../components/QuickStats';

const DashboardPage: React.FC = () => {
  const { prices, refresh } = usePriceFetcher();
  const { history, getSparklineData } = usePriceHistory(prices);

  const cardOrder = [
    PriceSource.VALR,
    PriceSource.BinanceZA,
    PriceSource.Yellowcard,
    PriceSource.Forex,
    PriceSource.BinanceGlobal,
  ];

  return (
    <div className="bg-background text-content-primary min-h-screen font-sans">
      <Header prices={prices} refresh={refresh} />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <QuickStats prices={prices} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {cardOrder.map(source => {
            const priceData = prices[source];
            return (
              <PriceCard 
                key={source}
                source={priceData.source}
                price={priceData.price}
                lastUpdate={priceData.lastUpdate}
                loading={priceData.loading}
                error={priceData.error}
                sparklineData={getSparklineData(source)}
                forexRate={prices[PriceSource.Forex].price}
              />
            );
          })}
        </div>

        <EffectiveRatesSection prices={prices} />
        <PremiumCalculator prices={prices} />
        <PriceChart history={history} />
      </main>
      <StatusBar prices={prices} />
    </div>
  );
};


export default DashboardPage;
