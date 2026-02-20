import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/lib/weatherMood";
import type { WeatherData } from "@/hooks/useWeather";

export interface JournalEntry {
  id: string;
  created_at: string;
  city: string;
  country: string | null;
  temperature: number;
  feels_like: number | null;
  humidity: number | null;
  wind_speed: number | null;
  weather_condition: string;
  weather_icon: string | null;
  note: string | null;
  mood_tag: string | null;
  device_id: string;
}

export function useWeatherJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    const deviceId = getDeviceId();
    const { data, error } = await supabase
      .from("weather_journal")
      .select("*")
      .eq("device_id", deviceId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error && data) setEntries(data as JournalEntry[]);
    setLoading(false);
  };

  const saveEntry = async (weather: WeatherData, note: string, moodTag: string) => {
    setSaving(true);
    const deviceId = getDeviceId();
    const { error } = await supabase.from("weather_journal").insert({
      device_id: deviceId,
      city: weather.city,
      country: weather.country,
      temperature: weather.temperature,
      feels_like: weather.feelsLike,
      humidity: weather.humidity,
      wind_speed: weather.windSpeed,
      weather_condition: weather.condition,
      weather_icon: weather.icon,
      note: note.trim() || null,
      mood_tag: moodTag || null,
    });

    setSaving(false);
    if (!error) {
      await fetchEntries();
      return true;
    }
    return false;
  };

  const deleteEntry = async (id: string) => {
    await supabase.from("weather_journal").delete().eq("id", id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return { entries, loading, saving, fetchEntries, saveEntry, deleteEntry };
}
