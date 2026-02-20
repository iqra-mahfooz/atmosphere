import { useState, useEffect, useRef } from "react";
import { useWeather } from "@/hooks/useWeather";
import { getMoodTheme, MoodTheme } from "@/lib/weatherMood";
import { HeroSection } from "@/components/HeroSection";
import { ChartsPanel } from "@/components/ChartsPanel";
import { WeatherJournal } from "@/components/WeatherJournal";
import { ForecastStrip } from "@/components/ForecastStrip";
import { Search, MapPin, Wind, Loader2 } from "lucide-react";

// Particle background component
function WeatherParticles({ theme }: { theme: MoodTheme }) {
  const particles = Array.from({ length: theme === "rainy" ? 40 : theme === "snowy" ? 30 : 15 });

  if (theme === "sunny" || theme === "default" || theme === "cloudy") return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((_, i) => {
        const left = `${Math.random() * 100}%`;
        const delay = `${Math.random() * 5}s`;
        const duration = theme === "rainy"
          ? `${0.5 + Math.random() * 0.8}s`
          : `${3 + Math.random() * 4}s`;
        const size = theme === "rainy"
          ? "1px"
          : theme === "snowy"
          ? `${3 + Math.random() * 4}px`
          : `${4 + Math.random() * 6}px`;

        return (
          <div
            key={i}
            className={`atmo-particle ${
              theme === "rainy" ? "particle-rain" :
              theme === "snowy" ? "particle-snow" :
              "particle-float"
            }`}
            style={{
              left,
              top: "-10px",
              width: size,
              height: theme === "rainy" ? "20px" : size,
              animationDelay: delay,
              animationDuration: duration,
              opacity: 0.6,
            }}
          />
        );
      })}
    </div>
  );
}

const Index = () => {
  const { weather, loading, error, fetchWeather, fetchByGeolocation } = useWeather();
  const [cityInput, setCityInput] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const mood = weather ? getMoodTheme(weather.temperature, weather.condition) : null;
  const themeClass = mood ? `theme-${mood.theme}` : "theme-cloudy";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setHasSearched(true);
    fetchWeather({ city: cityInput.trim() });
  };

  const handleGeolocate = () => {
    setHasSearched(true);
    fetchByGeolocation();
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${themeClass}`}
      style={{ background: `linear-gradient(180deg, hsl(var(--atmo-bg-from)), hsl(var(--atmo-bg-to)) 60%, hsl(var(--atmo-bg-from)))` }}>
      
      {mood && <WeatherParticles theme={mood.theme} />}

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:px-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight"
              style={{ color: `hsl(var(--atmo-text))` }}>
              AtmoSphere
            </h1>
            <p className="text-sm opacity-50 mt-0.5" style={{ color: `hsl(var(--atmo-text))` }}>
              Your mood-aware weather companion
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40"
                style={{ color: `hsl(var(--atmo-text))` }} />
              <input
                ref={inputRef}
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Search city..."
                className="pl-10 pr-4 py-2.5 rounded-xl text-sm w-64 outline-none transition-all"
                style={{
                  background: `hsl(var(--atmo-card-bg) / 0.6)`,
                  border: `1px solid hsl(var(--atmo-text) / 0.15)`,
                  color: `hsl(var(--atmo-text))`,
                  backdropFilter: "blur(12px)",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50"
              style={{
                background: `hsl(var(--atmo-accent))`,
                color: `hsl(var(--atmo-bg-from))`,
              }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
            </button>
            <button
              type="button"
              onClick={handleGeolocate}
              disabled={loading}
              title="Use my location"
              className="p-2.5 rounded-xl transition-all duration-200 disabled:opacity-50"
              style={{
                background: `hsl(var(--atmo-card-bg) / 0.6)`,
                border: `1px solid hsl(var(--atmo-text) / 0.15)`,
                color: `hsl(var(--atmo-text))`,
              }}>
              <MapPin className="w-4 h-4" />
            </button>
          </form>
        </header>

        {/* Error state */}
        {error && (
          <div className="rounded-2xl p-5 mb-6 text-center"
            style={{
              background: "hsl(0 60% 20% / 0.4)",
              border: "1px solid hsl(0 60% 40% / 0.3)",
              color: "hsl(0 70% 80%)",
            }}>
            <p className="font-semibold">⚠ {error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="rounded-3xl p-12 mb-8 animate-pulse"
            style={{ background: `hsl(var(--atmo-card-bg) / 0.4)`, height: "360px" }}>
            <div className="flex items-center justify-center h-full gap-3"
              style={{ color: `hsl(var(--atmo-text) / 0.5)` }}>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg font-medium">Fetching weather data...</span>
            </div>
          </div>
        )}

        {/* Welcome / empty state */}
        {!hasSearched && !loading && !weather && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-8xl mb-6">🌤</div>
            <h2 className="text-3xl font-black mb-3" style={{ color: `hsl(var(--atmo-text))` }}>
              Where are you?
            </h2>
            <p className="text-base opacity-50 max-w-sm mb-8" style={{ color: `hsl(var(--atmo-text))` }}>
              Search for a city or let AtmoSphere detect your location to get a personalized, mood-aware weather experience.
            </p>
            <button
              onClick={handleGeolocate}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                background: `hsl(var(--atmo-accent))`,
                color: `hsl(var(--atmo-bg-from))`,
              }}>
              <MapPin className="w-4 h-4" />
              Use My Location
            </button>
          </div>
        )}

        {/* Main dashboard */}
        {weather && mood && !loading && (
          <>
            <HeroSection weather={weather} mood={mood} />
            <ForecastStrip daily={weather.daily} mood={mood} />
            <ChartsPanel daily={weather.daily} mood={mood} />
            <div className="grid grid-cols-1 gap-6">
              <WeatherJournal weather={weather} mood={mood} />
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-xs opacity-30" style={{ color: `hsl(var(--atmo-text))` }}>
          <Wind className="w-3 h-3 inline mr-1" />
          AtmoSphere · Powered by OpenWeatherMap
        </footer>
      </div>
    </div>
  );
};

export default Index;
