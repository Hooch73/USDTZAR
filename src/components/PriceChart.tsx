import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PriceSource } from '../types';

interface PriceChartProps {
  history: any[];
}

const PriceChart: React.FC<PriceChartProps> = ({ history }) => {
  const colors = {
    [PriceSource.VALR]: '#8884d8',
    [PriceSource.BinanceZA]: '#82ca9d',
    [PriceSource.Yellowcard]: '#ffc658',
    [PriceSource.Forex]: '#ff8042',
  };

  return (
    <div className="bg-surface/50 border border-card-border rounded-2xl p-6 shadow-lg backdrop-blur-sm h-[400px]">
      <h3 className="font-bold text-xl mb-4 text-text-primary">Price History (Last Hour)</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={history}>
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A34" />
          <XAxis dataKey="time" stroke="#A0A0B0" fontSize={12} />
          <YAxis stroke="#A0A0B0" fontSize={12} domain={['dataMin - 0.1', 'dataMax + 0.1']} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1A1A20', 
              border: '1px solid #2A2A34',
              color: '#F5F5F7'
            }} 
          />
          <Legend wrapperStyle={{ color: '#A0A0B0' }} />
          {Object.values(PriceSource).filter(s => s !== PriceSource.BinanceGlobal).map(source => (
            <Line
              key={source}
              type="monotone"
              dataKey={source}
              stroke={colors[source as keyof typeof colors] || '#fff'}
              strokeWidth={3}
              dot={false}
              style={{ filter: 'url(#glow)' }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
