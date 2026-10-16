import { useState, useEffect } from 'react';
import { Clock, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  targetDate: string;
  title: string;
}

export function DeadlinesCountdownWidget({ targetDate, title }: Props) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  const [addedToCalendar, setAddedToCalendar] = useState(false);

  useEffect(() => {
    function calculate() {
      const difference = new Date(targetDate).getTime() - Date.now();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const formattedDate = new Date(targetDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="mt-3 p-3.5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          <span>{title}</span>
        </div>
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
          Due: {formattedDate}
        </span>
      </div>

      {timeLeft.isPast ? (
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm font-medium py-1">
          <AlertCircle className="w-4 h-4" />
          <span>This deadline has passed. Please contact your academic advisor.</span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 text-center my-2">
          <div className="bg-white/80 dark:bg-zinc-800/80 p-1.5 rounded-lg border border-amber-500/20 shadow-xs">
            <span className="block text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">{timeLeft.days}</span>
            <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400">Days</span>
          </div>
          <div className="bg-white/80 dark:bg-zinc-800/80 p-1.5 rounded-lg border border-amber-500/20 shadow-xs">
            <span className="block text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">{timeLeft.hours}</span>
            <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400">Hours</span>
          </div>
          <div className="bg-white/80 dark:bg-zinc-800/80 p-1.5 rounded-lg border border-amber-500/20 shadow-xs">
            <span className="block text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">{timeLeft.minutes}</span>
            <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400">Mins</span>
          </div>
          <div className="bg-white/80 dark:bg-zinc-800/80 p-1.5 rounded-lg border border-amber-500/20 shadow-xs">
            <span className="block text-lg font-bold font-mono text-amber-600 dark:text-amber-400">{timeLeft.seconds}</span>
            <span className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400">Secs</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
          Late submissions incur automatic financial/academic penalty.
        </span>
        <button
          type="button"
          onClick={() => setAddedToCalendar(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer"
        >
          {addedToCalendar ? (
            <>
              <CheckCircle2 className="w-3 h-3" />
              <span>Reminder Set</span>
            </>
          ) : (
            <>
              <Calendar className="w-3 h-3" />
              <span>Add Reminder</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
