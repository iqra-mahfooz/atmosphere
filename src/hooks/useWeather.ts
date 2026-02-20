import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DailyForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  pop: number;
  wind: number;
}

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  icon: string;
  pressure: number;
  visibility: number;
  uvIndex: number | null;
  daily: DailyForecast[];
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (params: { lat?: number; lon?: number; city?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("weather", {
        body: params,
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setWeather(data as WeatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => {
        setLoading(false);
        setError("Location access denied. Please search for a city.");
      }
    );
  }, [fetchWeather]);

  return { weather, loading, error, fetchWeather, fetchByGeolocation };
}
