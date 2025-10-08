import React from 'react';
import { motion } from 'framer-motion';
import { usePriceFetcher } from './hooks/usePriceFetcher';
import { usePriceHistory } from './hooks/usePriceHistory';
import PriceCard from './components/PriceCard';
import PremiumCalculator from './components/PremiumCalculator';
import PriceChart from './components/PriceChart';
import StatusBar from './components/StatusBar';
import Header from './components/layout/Header';
import QuickStats from './components/QuickStats';
import { PriceSource } from './types';

const App: React.FC = () => {
  const { prices, refresh } = usePriceFetcher();
  const { history, getSparklineData } = usePriceHistory(prices);

  return (
    <div className="bg-background text-content-primary min-h-screen font-sans">
      <Header prices={prices} refresh={refresh} />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <QuickStats prices={prices} />
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {Object.values(prices)
            .sort((a, b) => (b.price ?? -1) - (a.price ?? -1))
            .map(data => (
            <PriceCard key={data.source} data={data} sparklineData={getSparklineData(data.source)} forexRate={prices[PriceSource.Forex].price} />
          ))}
        </motion.div>

        <PremiumCalculator prices={prices} />

        <PriceChart history={history} />
      </main>
      <StatusBar prices={prices} />
    </div>
  );
};

export default App;
