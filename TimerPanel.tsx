// src/components/dashboard/TimerPanel.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, TimerIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function TimerPanel() {
  const [time, setTime] = useState('00:00:00');
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && startTime !== null) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const seconds = String(elapsed % 60).padStart(2, '0');
        setTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime]);

  const handleStart = () => {
    if (!isRunning) {
      setStartTime(Date.now() - parseTimeToSeconds(time) * 1000);
      setIsRunning(true);
      toast({ title: "Timer Started", description: "Mission clock is now running." });
    }
  };

  const handlePause = () => {
    if (isRunning) {
      setIsRunning(false);
      toast({ title: "Timer Paused", description: "Mission clock is paused." });
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime('00:00:00');
    setStartTime(null);
    toast({ title: "Timer Reset", description: "Mission clock has been reset." });
  };

  const parseTimeToSeconds = (t: string) => {
    const parts = t.split(':').map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <TimerIcon className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Mission Timer</CardTitle>
        </div>
        <CardDescription>Manual mission clock control.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="text-5xl font-mono font-bold text-foreground" data-testid="timer-display">
          {time}
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleStart} disabled={isRunning} variant="outline" className="bg-green-500 hover:bg-green-600 text-white">
            <Play className="mr-2 h-4 w-4" /> Start
          </Button>
          <Button onClick={handlePause} disabled={!isRunning} variant="outline" className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <Pause className="mr-2 h-4 w-4" /> Pause
          </Button>
          <Button onClick={handleReset} variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
