import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PremiumBadgeProps {
  premium: number | null;
}

const PremiumBadge: React.FC<PremiumBadgeProps> = ({ premium }) => {
  if (premium === null) {
    return null;
  }

  const getPremiumStyle = () => {
    if (premium > 2) return 'bg-success/20 text-success';
    if (premium > 0) return 'bg-warning/20 text-warning';
    return 'bg-danger/20 text-danger';
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${getPremiumStyle()}`}>
      {premium > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      <span>{premium.toFixed(2)}%</span>
    </div>
  );
};

export default PremiumBadge;
