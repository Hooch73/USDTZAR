import React from 'react';
import { usePriceFetcher } from './hooks/usePriceFetcher';
import { usePriceHistory } from './hooks/usePriceHistory';
import PriceCard from './components/PriceCard';
import PremiumCalculator from './components/PremiumCalculator';
import PriceChart from './components/PriceChart';
import StatusBar from './components/StatusBar';

const App: React.FC = () => {
  const { prices, refresh } = usePriceFetcher();
  const history = usePriceHistory(prices);

  return (
    <div className="bg-background text-text-primary min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Arbitrage Dashboard</h1>
            <p className="text-text-secondary">USDT/ZAR Arbitrage Opportunities</p>
          </div>
          <button 
            onClick={refresh} 
            className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 4L15 9M4 20l5-5"></path></svg>
            Refresh
          </button>
        </header>

        <main className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {Object.values(prices).map(data => (
              <PriceCard key={data.source} data={data} />
            ))}
          </div>

          <PremiumCalculator prices={prices} />

          <PriceChart history={history} />
        </main>

        <StatusBar prices={prices} />
      </div>
    </div>
  );
};

export default App;
