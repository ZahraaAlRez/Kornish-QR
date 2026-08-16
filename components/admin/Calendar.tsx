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
    <div className="rounded-2xl bg-white p-3 shadow-card">
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-espresso-light">
        {WEEKDAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const summary = summaryByDay[day];
          const isSelected = selectedDay === day;
          return (
            <button
              key={i}
              onClick={() => onSelectDay(isSelected ? null : day)}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg text-xs ${
                isSelected ? "bg-espresso text-cream" : summary ? "bg-gold-light/25 text-espresso" : "text-espresso-light"
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
