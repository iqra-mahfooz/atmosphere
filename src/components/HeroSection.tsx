import { WeatherMood } from "@/lib/weatherMood";
import { WeatherData } from "@/hooks/useWeather";
import { Droplets, Wind, Eye, Thermometer, Gauge, Cloud } from "lucide-react";

interface HeroSectionProps {
  weather: WeatherData;
  mood: WeatherMood;
}

export function HeroSection({ weather, mood }: HeroSectionProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@4x.png`;

  const stats = [
    { icon: Droplets, label: "Humidity", value: `${weather.humidity}%` },
    { icon: Wind, label: "Wind", value: `${weather.windSpeed} km/h` },
    { icon: Eye, label: "Visibility", value: `${weather.visibility} km` },
    { icon: Thermometer, label: "Feels Like", value: `${weather.feelsLike}°` },
    { icon: Gauge, label: "Pressure", value: `${weather.pressure} hPa` },
    { icon: Cloud, label: "Condition", value: weather.description },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 mb-8"
      style={{
        background: `linear-gradient(135deg, hsl(var(--atmo-bg-from)), hsl(var(--atmo-bg-to)))`,
        boxShadow: `0 25px 60px -12px hsl(var(--atmo-accent) / 0.4)`,
      }}>
      {/* Decorative blur orb */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: `radial-gradient(circle, hsl(var(--atmo-accent)), transparent)` }} />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-10 blur-3xl"
        style={{ background: `radial-gradient(circle, hsl(var(--atmo-accent)), transparent)` }} />

      <div className="relative z-10">
        {/* Location */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm font-medium tracking-widest uppercase opacity-70" style={{ color: `hsl(var(--atmo-text))` }}>
            📍 {weather.city}, {weather.country}
          </span>
        </div>

        {/* Main temp + icon */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-start gap-2">
              <span className="text-9xl font-black leading-none tracking-tighter"
                style={{ color: `hsl(var(--atmo-text))` }}>
                {weather.temperature}
              </span>
              <span className="text-4xl font-light mt-4 opacity-70" style={{ color: `hsl(var(--atmo-text))` }}>°C</span>
            </div>
            <p className="text-2xl font-semibold mt-2 opacity-90 capitalize" style={{ color: `hsl(var(--atmo-text))` }}>
              {mood.feelsLikeLabel}
            </p>
            <p className="text-base opacity-60 capitalize mt-1" style={{ color: `hsl(var(--atmo-text))` }}>
              {weather.description}
            </p>
          </div>

          <div className="md:ml-auto text-center">
            <img src={iconUrl} alt={weather.condition} className="w-32 h-32 drop-shadow-2xl" />
            <p className="text-lg font-bold tracking-tight" style={{ color: `hsl(var(--atmo-text))` }}>
              {mood.label}
            </p>
          </div>
        </div>

        {/* Contextual insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { emoji: "👔", title: "What to Wear", value: mood.clothing },
            { emoji: "🧘", title: "Mood Hint", value: mood.moodSuggestion },
            { emoji: "💡", title: "Pro Tip", value: mood.productivityTip },
          ].map(({ emoji, title, value }) => (
            <div key={title} className="rounded-2xl p-4 backdrop-blur-sm"
              style={{
                background: `hsl(var(--atmo-card-bg) / 0.3)`,
                border: `1px solid hsl(var(--atmo-text) / 0.15)`,
              }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{emoji}</span>
                <span className="text-xs font-semibold uppercase tracking-widest opacity-60"
                  style={{ color: `hsl(var(--atmo-text))` }}>{title}</span>
              </div>
              <p className="text-sm font-medium" style={{ color: `hsl(var(--atmo-text))` }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl p-3 text-center backdrop-blur-sm"
              style={{
                background: `hsl(var(--atmo-card-bg) / 0.2)`,
                border: `1px solid hsl(var(--atmo-text) / 0.1)`,
              }}>
              <Icon className="w-4 h-4 mx-auto mb-1 opacity-70" style={{ color: `hsl(var(--atmo-text))` }} />
              <div className="text-xs opacity-60 mb-0.5" style={{ color: `hsl(var(--atmo-text))` }}>{label}</div>
              <div className="text-sm font-bold capitalize" style={{ color: `hsl(var(--atmo-text))` }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
