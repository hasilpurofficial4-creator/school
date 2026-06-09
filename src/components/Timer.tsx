import { useState, useEffect } from "react";

interface TimerProps {
  durationSeconds: number;
  onExpire: () => void;
}

export default function Timer({ durationSeconds, onExpire }: TimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining, onExpire]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const isLow = remaining < 60;
  const isWarning = remaining < 300 && remaining >= 60;

  return (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-lg font-mono text-lg font-bold ${
        isLow
          ? "bg-red-100 text-red-700 animate-pulse"
          : isWarning
          ? "bg-amber-100 text-amber-700"
          : "bg-emerald-100 text-emerald-700"
      }`}
    >
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}
