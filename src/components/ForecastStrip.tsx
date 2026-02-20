import { DailyForecast } from "@/hooks/useWeather";
import { WeatherMood } from "@/lib/weatherMood";
import { format, parseISO } from "date-fns";

interface ForecastStripProps {
  daily: DailyForecast[];
  mood: WeatherMood;
}

export function ForecastStrip({ daily, mood }: ForecastStripProps) {
  const textStyle = { color: `hsl(var(--atmo-text))` };

  return (
    <div className="rounded-2xl p-6 mb-8"
      style={{
        background: "hsl(var(--atmo-card-bg) / 0.5)",
        border: "1px solid hsl(var(--atmo-text) / 0.1)",
        backdropFilter: "blur(12px)",
      }}>
      <h3 className="text-sm font-semibold uppercase tracking-widest opacity-60 mb-4" style={textStyle}>
        7-Day Outlook
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {daily.map((d) => (
          <div key={d.date}
            className="flex-shrink-0 rounded-xl p-4 text-center min-w-[80px] flex flex-col items-center gap-2"
            style={{
              background: "hsl(var(--atmo-card-bg) / 0.4)",
              border: "1px solid hsl(var(--atmo-text) / 0.08)",
            }}>
            <p className="text-xs font-semibold uppercase opacity-60" style={textStyle}>
              {format(parseISO(d.date), "EEE")}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${d.icon}.png`}
              alt={d.condition}
              className="w-10 h-10"
            />
            <p className="text-sm font-bold" style={textStyle}>{Math.round(d.high)}°</p>
            <p className="text-xs opacity-50" style={textStyle}>{Math.round(d.low)}°</p>
            {d.pop > 10 && (
              <p className="text-xs font-medium" style={{ color: `hsl(var(--atmo-accent))` }}>
                💧 {Math.round(d.pop)}%
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
