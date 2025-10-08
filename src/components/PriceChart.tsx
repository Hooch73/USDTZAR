import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PriceSource } from '../types';

interface PriceChartProps {
  history: any[];
}

// 1. Define a properly typed CustomTooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface/80 backdrop-blur-sm border border-card-border p-4 rounded-lg shadow-lg">
        <p className="label text-content-secondary font-semibold mb-2">{label}</p>
        <div className="space-y-1">
          {/* 2. Sort the payload by value before mapping */}
          {payload
            .sort((a: any, b: any) => a.value - b.value)
            .map((entry: any, index: number) => (
              <p key={`item-${index}`} style={{ color: entry.color }} className="font-semibold">
                {`${entry.name}:`}
                <span className="font-mono float-right ml-4">{entry.value.toFixed(4)}</span>
              </p>
            ))}
        </div>
      </div>
    );
  }
  return null;
};

const PriceChart: React.FC<PriceChartProps> = ({ history }) => {
  // 3. Ensure all sources have a color
  const colors = {
    [PriceSource.VALR]: '#8884d8',
    [PriceSource.BinanceZA]: '#f0b90b',
    [PriceSource.Yellowcard]: '#ffc658',
    [PriceSource.Forex]: '#ff8042',
  };

  return (
    <div className="bg-surface/50 border border-card-border rounded-2xl p-6 shadow-lg h-[400px]">
      <h3 className="font-bold text-xl mb-4 text-content-primary">Price History (Last Hour)</h3>
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
          <YAxis stroke="#A0A0B0" fontSize={12} domain={['dataMin - 0.1', 'dataMax + 0.1']} allowDataOverflow />
          {/* 4. Use the custom tooltip correctly */}
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '3 3' }} />
          <Legend wrapperStyle={{ color: '#A0A0B0' }} />
          {/* 5. Correctly filter sources to be displayed */}
          {Object.values(PriceSource)
            .filter(s => s !== PriceSource.BinanceGlobal)
            .map(source => (
            <Line
              key={source}
              type="monotone"
              dataKey={source}
              stroke={colors[source as keyof typeof colors]}
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
