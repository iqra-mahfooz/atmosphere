export type MoodTheme = "sunny" | "cold" | "hot" | "rainy" | "cloudy" | "snowy" | "stormy" | "default";

export interface WeatherMood {
  theme: MoodTheme;
  label: string;
  clothing: string;
  moodSuggestion: string;
  productivityTip: string;
  feelsLikeLabel: string;
  backgroundClass: string;
  accentColor: string; // HSL values for CSS variables
  cardClass: string;
}

export function getMoodTheme(temperature: number, condition: string): WeatherMood {
  const cond = condition.toLowerCase();

  if (cond.includes("thunderstorm") || cond.includes("storm")) {
    return {
      theme: "stormy",
      label: "Stormy & Electric",
      clothing: "Stay indoors if possible",
      moodSuggestion: "Perfect for deep, focused work",
      productivityTip: "Avoid travel. Handle remote tasks & creative writing.",
      feelsLikeLabel: "Wild & electric",
      backgroundClass: "bg-atmo-stormy",
      accentColor: "270 60% 60%",
      cardClass: "bg-atmo-stormy-card border-atmo-stormy-border",
    };
  }

  if (cond.includes("snow") || cond.includes("sleet") || cond.includes("blizzard")) {
    return {
      theme: "snowy",
      label: "Snowy & Serene",
      clothing: "Heavy coat, gloves & boots",
      moodSuggestion: "Cozy reading and reflection time",
      productivityTip: "Work from home. Watch for icy roads.",
      feelsLikeLabel: "Magical & still",
      backgroundClass: "bg-atmo-snowy",
      accentColor: "210 80% 85%",
      cardClass: "bg-atmo-snowy-card border-atmo-snowy-border",
    };
  }

  if (cond.includes("rain") || cond.includes("drizzle")) {
    return {
      theme: "rainy",
      label: "Rainy & Moody",
      clothing: "Waterproof jacket & umbrella",
      moodSuggestion: "Lean into introspection and creative work",
      productivityTip: "Great day for meetings, planning, and brainstorming.",
      feelsLikeLabel: "Damp & atmospheric",
      backgroundClass: "bg-atmo-rainy",
      accentColor: "240 30% 55%",
      cardClass: "bg-atmo-rainy-card border-atmo-rainy-border",
    };
  }

  if (temperature < 0) {
    return {
      theme: "cold",
      label: "Freezing",
      clothing: "Heavy insulated layers + face cover",
      moodSuggestion: "Warm drinks and slow mornings",
      productivityTip: "Risk of frostbite. Minimize outdoor exposure.",
      feelsLikeLabel: "Biting & harsh",
      backgroundClass: "bg-atmo-cold",
      accentColor: "215 85% 65%",
      cardClass: "bg-atmo-cold-card border-atmo-cold-border",
    };
  }

  if (temperature < 10) {
    return {
      theme: "cold",
      label: "Cold & Crisp",
      clothing: "Warm coat, scarf & gloves",
      moodSuggestion: "Energizing and great for focus",
      productivityTip: "Stay active. Cold weather boosts mental alertness.",
      feelsLikeLabel: "Crisp & cool",
      backgroundClass: "bg-atmo-cold",
      accentColor: "215 85% 65%",
      cardClass: "bg-atmo-cold-card border-atmo-cold-border",
    };
  }

  if (temperature > 35) {
    return {
      theme: "hot",
      label: "Scorching Hot",
      clothing: "Light, breathable clothing & hat",
      moodSuggestion: "Take it slow. Rest during peak hours.",
      productivityTip: "Hydrate constantly. Avoid outdoor tasks above 35°C.",
      feelsLikeLabel: "Blazing & intense",
      backgroundClass: "bg-atmo-hot",
      accentColor: "20 90% 60%",
      cardClass: "bg-atmo-hot-card border-atmo-hot-border",
    };
  }

  if (temperature > 28) {
    return {
      theme: "hot",
      label: "Warm & Sunny",
      clothing: "Light clothes, sunscreen essential",
      moodSuggestion: "Energetic day — great for outdoor plans",
      productivityTip: "Work early or late. Midday sun is intense.",
      feelsLikeLabel: "Warm & vibrant",
      backgroundClass: "bg-atmo-hot",
      accentColor: "30 90% 58%",
      cardClass: "bg-atmo-hot-card border-atmo-hot-border",
    };
  }

  if (cond.includes("clear") || cond.includes("sun")) {
    return {
      theme: "sunny",
      label: "Clear & Beautiful",
      clothing: "Light layers, sunglasses recommended",
      moodSuggestion: "Ideal for outdoor activities and socializing",
      productivityTip: "Prime conditions. Plan outdoor meetings or walks.",
      feelsLikeLabel: "Bright & refreshing",
      backgroundClass: "bg-atmo-sunny",
      accentColor: "45 95% 60%",
      cardClass: "bg-atmo-sunny-card border-atmo-sunny-border",
    };
  }

  return {
    theme: "cloudy",
    label: "Overcast & Calm",
    clothing: "Light jacket — mild and comfortable",
    moodSuggestion: "Calm and steady — great for focused tasks",
    productivityTip: "Good conditions for outdoor and indoor work alike.",
    feelsLikeLabel: "Mild & steady",
    backgroundClass: "bg-atmo-cloudy",
    accentColor: "220 20% 60%",
    cardClass: "bg-atmo-cloudy-card border-atmo-cloudy-border",
  };
}

export function getDeviceId(): string {
  let id = localStorage.getItem("atmosphere_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("atmosphere_device_id", id);
  }
  return id;
}

export function getMoodTags(): string[] {
  return ["😊 Happy", "😔 Melancholic", "⚡ Energized", "😌 Calm", "😤 Stressed", "🤩 Excited", "😴 Tired", "🧠 Focused"];
}
