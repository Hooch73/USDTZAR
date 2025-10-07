import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MiniSparklineProps {
  data: { value: number }[];
  color: string;
}

const MiniSparkline: React.FC<MiniSparklineProps> = ({ data, color }) => {
  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniSparkline;
