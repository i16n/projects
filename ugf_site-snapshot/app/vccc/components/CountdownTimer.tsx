"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string | null;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!targetDate) return;
      
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!targetDate) {
    return (
      <div className="text-center">
        <div className="text-2xl text-gray-400">Date TBD</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4">
      <div className="text-center">
        <div className="text-4xl font-bold text-white">{timeLeft.days}</div>
        <div className="text-gray-400">Days</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-white">{timeLeft.hours}</div>
        <div className="text-gray-400">Hours</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-white">{timeLeft.minutes}</div>
        <div className="text-gray-400">Minutes</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-white">{timeLeft.seconds}</div>
        <div className="text-gray-400">Seconds</div>
      </div>
    </div>
  );
} 