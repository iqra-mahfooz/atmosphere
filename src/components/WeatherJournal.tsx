import { useState, useEffect } from "react";
import { useWeatherJournal } from "@/hooks/useWeatherJournal";
import type { WeatherData } from "@/hooks/useWeather";
import { WeatherMood, getMoodTags } from "@/lib/weatherMood";
import { format } from "date-fns";
import { Trash2, BookOpen, Plus, CheckCircle } from "lucide-react";

interface WeatherJournalProps {
  weather: WeatherData;
  mood: WeatherMood;
}

export function WeatherJournal({ weather, mood }: WeatherJournalProps) {
  const { entries, loading, saving, fetchEntries, saveEntry, deleteEntry } = useWeatherJournal();
  const [note, setNote] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSave = async () => {
    const ok = await saveEntry(weather, note, selectedMood);
    if (ok) {
      setNote("");
      setSelectedMood("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const textStyle = { color: `hsl(var(--atmo-text))` };
  const cardStyle = {
    background: "hsl(var(--atmo-card-bg) / 0.5)",
    border: "1px solid hsl(var(--atmo-text) / 0.12)",
    backdropFilter: "blur(12px)",
  };

  return (
    <div className="rounded-2xl p-6" style={cardStyle}>
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-5 h-5 opacity-70" style={textStyle} />
        <h2 className="text-lg font-bold tracking-tight" style={textStyle}>Weather Journal</h2>
      </div>

      {/* Save current snapshot */}
      <div className="rounded-xl p-5 mb-6"
        style={{
          background: "hsl(var(--atmo-card-bg) / 0.4)",
          border: "1px solid hsl(var(--atmo-text) / 0.1)",
        }}>
        <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-3" style={textStyle}>
          Today's Snapshot — {weather.city}, {weather.temperature}°C · {weather.condition}
        </p>

        {/* Mood tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {getMoodTags().map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedMood(selectedMood === tag ? "" : tag)}
              className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 font-medium"
              style={{
                background: selectedMood === tag
                  ? `hsl(var(--atmo-accent))` : `hsl(var(--atmo-card-bg) / 0.5)`,
                color: selectedMood === tag
                  ? `hsl(var(--atmo-bg-from))` : `hsl(var(--atmo-text) / 0.8)`,
                border: `1px solid hsl(var(--atmo-text) / 0.15)`,
              }}>
              {tag}
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How are you feeling today? Write a note..."
          rows={3}
          className="w-full rounded-xl p-3 text-sm resize-none outline-none transition-all"
          style={{
            background: "hsl(var(--atmo-card-bg) / 0.3)",
            border: "1px solid hsl(var(--atmo-text) / 0.15)",
            color: `hsl(var(--atmo-text))`,
          }}
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50"
          style={{
            background: saved ? "hsl(142 70% 45%)" : `hsl(var(--atmo-accent))`,
            color: `hsl(var(--atmo-bg-from))`,
          }}>
          {saved ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {saved ? "Saved!" : saving ? "Saving..." : "Save Entry"}
        </button>
      </div>

      {/* Past entries */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-3" style={textStyle}>
          Past Entries
        </p>
        {loading && (
          <div className="text-center py-8 opacity-40 text-sm" style={textStyle}>Loading entries...</div>
        )}
        {!loading && entries.length === 0 && (
          <div className="text-center py-8 opacity-40 text-sm" style={textStyle}>
            No entries yet. Save today's weather to get started!
          </div>
        )}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-xl p-4 group relative"
              style={{
                background: "hsl(var(--atmo-card-bg) / 0.3)",
                border: "1px solid hsl(var(--atmo-text) / 0.08)",
              }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold opacity-70" style={textStyle}>
                      {format(new Date(entry.created_at), "MMM d, yyyy · h:mm a")}
                    </span>
                    {entry.mood_tag && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: `hsl(var(--atmo-accent) / 0.2)`,
                          color: `hsl(var(--atmo-accent))`,
                        }}>
                        {entry.mood_tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-50 mb-1.5" style={textStyle}>
                    {entry.city} · {Math.round(entry.temperature)}°C · {entry.weather_condition}
                  </p>
                  {entry.note && (
                    <p className="text-sm opacity-80 leading-relaxed" style={textStyle}>{entry.note}</p>
                  )}
                </div>
                {entry.weather_icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${entry.weather_icon}.png`}
                    alt={entry.weather_condition}
                    className="w-10 h-10 opacity-80 shrink-0"
                  />
                )}
              </div>
              <button
                onClick={() => deleteEntry(entry.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg"
                style={{ background: "hsl(0 70% 50% / 0.2)", color: "hsl(0 70% 60%)" }}>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
