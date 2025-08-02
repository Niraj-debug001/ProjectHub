
// src/components/dashboard/TaskPointsWidget.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CheckSquare, Square } from 'lucide-react';
import type { Task } from '@/types';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface TaskPointsWidgetProps {
  tasks: Task[];
  missionName?: string; // Optional: To specify which mission's tasks are shown
}

export function TaskPointsWidget({ tasks, missionName }: TaskPointsWidgetProps) {
  const completedPoints = tasks
    .filter(task => task.completed)
    .reduce((sum, task) => sum + task.points, 0);
  
  const totalPossiblePoints = tasks.reduce((sum, task) => sum + task.points, 0);
  
  const progressPercentage = totalPossiblePoints > 0 ? (completedPoints / totalPossiblePoints) * 100 : 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Award className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Mission Points</CardTitle>
        </div>
        <CardDescription>
          {missionName ? `Points for ${missionName}` : 'Total points earned from completed tasks.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-4xl font-bold text-primary">{completedPoints}</p>
          <p className="text-sm text-muted-foreground">out of {totalPossiblePoints} possible points</p>
        </div>
        <div>
          <Progress value={progressPercentage} aria-label={`${progressPercentage}% points earned`} className="h-3 mb-2" />
           <div className="flex justify-between text-xs text-muted-foreground">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
        </div>
        {tasks.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-foreground">Task Breakdown:</h4>
            <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {tasks.map((task, index) => {
                const itemBackgroundClass = task.completed
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : index % 2 === 0
                  ? 'bg-primary/5 hover:bg-primary/10'
                  : 'bg-accent/5 hover:bg-accent/10';

                return (
                  <li 
                    key={task.id} 
                    className={cn(
                      "flex items-center justify-between text-xs p-1.5 rounded-md transition-colors",
                      itemBackgroundClass
                    )}
                  >
                    <div className="flex items-center">
                      {task.completed ? <CheckSquare className="h-3.5 w-3.5 mr-2 text-green-500" /> : <Square className="h-3.5 w-3.5 mr-2 text-muted-foreground" />}
                      <span className={task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}>
                        {task.name} {task.completed && <span className="ml-1">😊</span>}
                      </span>
                    </div>
                    <span className={`font-medium ${task.completed ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {task.points} pts
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
