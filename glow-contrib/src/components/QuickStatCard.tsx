import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useEffect, useState } from 'react';

interface QuickStatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  format?: 'number' | 'currency';
  className?: string;
}

export const QuickStatCard = ({
  icon: Icon,
  label,
  value,
  format = 'number',
  className,
}: QuickStatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (val: number) => {
    if (format === 'currency') {
      return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return val.toLocaleString();
  };

  return (
    <Card className={`glass hover-glow ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold animate-count-up">
              {formatValue(displayValue)}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
