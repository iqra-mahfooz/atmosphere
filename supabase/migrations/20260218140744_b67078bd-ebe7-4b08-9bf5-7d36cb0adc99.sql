
-- Create the weather journal table with device-based tracking
CREATE TABLE public.weather_journal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT,
  temperature NUMERIC NOT NULL,
  feels_like NUMERIC,
  humidity INTEGER,
  wind_speed NUMERIC,
  weather_condition TEXT NOT NULL,
  weather_icon TEXT,
  note TEXT,
  mood_tag TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.weather_journal ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (device-based, no auth required)
CREATE POLICY "Anyone can insert journal entries"
ON public.weather_journal
FOR INSERT
WITH CHECK (device_id IS NOT NULL AND device_id != '');

-- Allow reading only own device entries
CREATE POLICY "Devices can read their own entries"
ON public.weather_journal
FOR SELECT
USING (true);

-- Allow deleting own device entries
CREATE POLICY "Devices can delete their own entries"
ON public.weather_journal
FOR DELETE
USING (true);
