'use client';
import { useState, useEffect } from 'react';

interface DealTimerProps {
  expiryTime: string;
  className?: string;
}

export function DealTimer({ expiryTime, className = '' }: DealTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>('low');

  useEffect(() => {
    const updateTimer = () => {
      const diff = new Date(expiryTime).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Expired');
        setUrgency('critical');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) setTimeLeft(`${hours}h ${mins}m ${secs}s`);
      else if (mins > 0) setTimeLeft(`${mins}m ${secs}s`);
      else setTimeLeft(`${secs}s`);

      if (hours < 1) setUrgency('critical');
      else if (hours < 3) setUrgency('high');
      else if (hours < 6) setUrgency('medium');
      else setUrgency('low');
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  const urgencyColors = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    critical: 'text-red-600 animate-pulse',
  };

  return (
    <span className={`font-mono font-bold ${urgencyColors[urgency]} ${className}`}>
      ⏱ {timeLeft}
    </span>
  );
}
