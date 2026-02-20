import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon, city } = await req.json();
    const apiKey = Deno.env.get("OPENWEATHER_API_KEY");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let currentUrl: string;
    let forecastUrl: string;

    if (lat !== undefined && lon !== undefined) {
      currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else if (city) {
      currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    } else {
      return new Response(JSON.stringify({ error: "Provide lat/lon or city" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl),
    ]);

    if (!currentRes.ok) {
      const err = await currentRes.json();
      return new Response(JSON.stringify({ error: err.message || "City not found" }), {
        status: currentRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    // Build 7-day forecast by picking one entry per day
    const dailyMap: Record<string, { high: number; low: number; condition: string; icon: string; pop: number; wind: number }> = {};

    for (const item of forecast.list) {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyMap[date]) {
        dailyMap[date] = {
          high: item.main.temp_max,
          low: item.main.temp_min,
          condition: item.weather[0].main,
          icon: item.weather[0].icon,
          pop: item.pop * 100,
          wind: item.wind.speed,
        };
      } else {
        if (item.main.temp_max > dailyMap[date].high) dailyMap[date].high = item.main.temp_max;
        if (item.main.temp_min < dailyMap[date].low) dailyMap[date].low = item.main.temp_min;
        if (item.pop * 100 > dailyMap[date].pop) dailyMap[date].pop = item.pop * 100;
      }
    }

    const daily = Object.entries(dailyMap).slice(0, 7).map(([date, data]) => ({ date, ...data }));

    const response = {
      city: current.name,
      country: current.sys.country,
      temperature: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed * 3.6), // m/s to km/h
      condition: current.weather[0].main,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      pressure: current.main.pressure,
      visibility: Math.round((current.visibility || 10000) / 1000),
      uvIndex: null, // OWM free tier doesn't have UV
      daily,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
