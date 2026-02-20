import { WeatherMood } from "@/lib/weatherMood";
import { DailyForecast } from "@/hooks/useWeather";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { format, parseISO } from "date-fns";

interface ChartsProps {
  daily: DailyForecast[];
  mood: WeatherMood;
}

const cardStyle = {
  background: "hsl(var(--atmo-card-bg) / 0.6)",
  border: "1px solid hsl(var(--atmo-text) / 0.1)",
  backdropFilter: "blur(12px)",
};

const tooltipStyle = {
  backgroundColor: "hsl(var(--atmo-card-bg))",
  border: "1px solid hsl(var(--atmo-text) / 0.2)",
  borderRadius: "12px",
  color: "hsl(var(--atmo-text))",
  fontSize: "13px",
};

export function ChartsPanel({ daily, mood }: ChartsProps) {
  const accent = `hsl(var(--atmo-accent))`;
  const accentMuted = `hsl(var(--atmo-accent) / 0.4)`;
  const textColor = `hsl(var(--atmo-text) / 0.6)`;

  const data = daily.map((d) => ({
    date: format(parseISO(d.date), "EEE"),
    High: Math.round(d.high),
    Low: Math.round(d.low),
    "Rain %": Math.round(d.pop),
    "Wind km/h": Math.round(d.wind * 3.6),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Temperature Trend */}
      <div className="lg:col-span-2 rounded-2xl p-6" style={cardStyle}>
        <h3 className="text-sm font-semibold uppercase tracking-widest opacity-60 mb-4"
          style={{ color: `hsl(var(--atmo-text))` }}>
          7-Day Temperature
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={`hsl(var(--atmo-text) / 0.08)`} />
            <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}°`} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ color: `hsl(var(--atmo-text))`, fontSize: 12 }} />
            <Line type="monotone" dataKey="High" stroke={accent} strokeWidth={2.5} dot={{ fill: accent, r: 4 }} />
            <Line type="monotone" dataKey="Low" stroke={accentMuted} strokeWidth={2} dot={{ fill: accentMuted, r: 3 }} strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Precipitation */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h3 className="text-sm font-semibold uppercase tracking-widest opacity-60 mb-4"
          style={{ color: `hsl(var(--atmo-text))` }}>
          Rain Chance
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={`hsl(var(--atmo-text) / 0.08)`} />
            <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="Rain %" fill={accent} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Wind */}
      <div className="lg:col-span-3 rounded-2xl p-6" style={cardStyle}>
        <h3 className="text-sm font-semibold uppercase tracking-widest opacity-60 mb-4"
          style={{ color: `hsl(var(--atmo-text))` }}>
          Wind Speed
        </h3>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accent} stopOpacity={0.4} />
                <stop offset="95%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={`hsl(var(--atmo-text) / 0.08)`} />
            <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="Wind km/h" stroke={accent} fill="url(#windGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
