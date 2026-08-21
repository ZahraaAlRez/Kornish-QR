"use client";

interface DaySummary {
  count: number;
  total: number;
}

interface Props {
  year: number;
  month: number; // 1-12
  selectedDay: number | null;
  summaryByDay: Record<number, DaySummary>;
  onSelectDay: (day: number | null) => void;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function Calendar({ year, month, selectedDay, summaryByDay, onSelectDay }: Props) {
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const startWeekday = firstOfMonth.getUTCDay();

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-2xl bg-white p-2 shadow-card sm:p-3">
      <div className="mb-2 grid grid-cols-7 gap-0.5 text-center text-[10px] font-semibold uppercase text-navy/50 sm:gap-1">
        {WEEKDAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const summary = summaryByDay[day];
          const isSelected = selectedDay === day;
          return (
            <button
              key={i}
              onClick={() => onSelectDay(isSelected ? null : day)}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-xs transition ${
                isSelected
                  ? "border-navy bg-navy text-cream"
                  : summary
                    ? "border-gold/30 bg-gold/20 text-navy"
                    : "border-navy/10 text-navy/40 hover:border-gold/40"
              }`}
            >
              <span>{day}</span>
              {summary && <span className="h-1 w-1 rounded-full bg-gold" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
