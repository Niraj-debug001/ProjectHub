
// src/components/dashboard/MissionSummaryCard.tsx
"use client";

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Mission } from '@/types';
import { Rocket, CheckCircle2, AlertTriangle, Hourglass, ArrowRight } from 'lucide-react';

interface MissionSummaryCardProps {
  mission: Mission;
}

const statusIcons: Record<Mission['status'], React.ElementType> = {
  active: Rocket,
  completed: CheckCircle2,
  pending: Hourglass,
  failed: AlertTriangle,
};

const statusColors: Record<Mission['status'], string> = {
  active: 'bg-sky-500',
  completed: 'bg-green-500',
  pending: 'bg-yellow-500',
  failed: 'bg-red-500',
};


export function MissionSummaryCard({ mission }: MissionSummaryCardProps) {
  const Icon = statusIcons[mission.status] || Rocket;
  const completedTasks = mission.tasks.filter(task => task.completed).length;
  const totalTasks = mission.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl mb-1">{mission.name}</CardTitle>
          <Badge variant={mission.status === 'completed' ? 'default' : mission.status === 'active' ? 'secondary' : 'outline'} className={`${statusColors[mission.status]} text-white`}>
            <Icon className="h-3 w-3 mr-1.5" />
            {mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="text-sm line-clamp-2 h-10">{mission.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Task Progress</span>
              <span>{completedTasks}/{totalTasks}</span>
            </div>
            <Progress value={progressPercentage} aria-label={`${progressPercentage}% tasks completed`} className="h-2"/>
          </div>
          <p className="text-xs text-muted-foreground">
            Created: {new Date(mission.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/missions/${mission.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
