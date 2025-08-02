
// src/components/dashboard/TaskReminderWidget.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CalendarClock, AlertTriangle, CheckCircle } from 'lucide-react'; // Added CheckCircle for completed
import type { Task } from '@/types';
import { format, differenceInDays, parseISO, isValid } from 'date-fns';

interface TaskReminderWidgetProps {
  tasks: Task[]; // Tasks from the active mission
}

// Helper function to format due dates and determine urgency
const getTaskDisplayInfo = (task: Task) => {
  let urgency = "normal"; // 'normal', 'dueSoon', 'overdue', 'completed'
  let formattedTime = task.dueDate ? `Due: ${task.dueDate}` : "No due date";

  if (task.completed) {
    urgency = "completed";
    formattedTime = `Completed! ${task.dueDate ? `Was due: ${format(parseISO(task.dueDate), "MMM d, yyyy")}`: ''}`;
  } else if (task.dueDate) {
    const dueDate = parseISO(task.dueDate);
    if (isValid(dueDate)) {
      const now = new Date();
      const daysUntilDue = differenceInDays(dueDate, now);

      if (daysUntilDue < 0) {
        urgency = "overdue";
        formattedTime = `Overdue! Was due: ${format(dueDate, "MMM d, yyyy")}`;
      } else if (daysUntilDue <= 2) { 
        urgency = "dueSoon";
        formattedTime = `Due soon: ${format(dueDate, "MMM d, yyyy 'at' h:mm a")}`;
      } else {
        formattedTime = `Due: ${format(dueDate, "MMM d, yyyy 'at' h:mm a")}`;
      }
    } else {
       formattedTime = `Due: ${task.dueDate} (invalid date)`;
    }
  }
  return { text: task.name, time: formattedTime, urgency, completed: task.completed };
};


export function TaskReminderWidget({ tasks = [] }: TaskReminderWidgetProps) {
  const [displayTasks, setDisplayTasks] = useState<Array<{id: string; text: string; time: string; urgency: string; completed: boolean}>>([]);

  useEffect(() => {
    const processedTasks = tasks
      .map(task => ({
        id: task.id,
        ...getTaskDisplayInfo(task)
      }))
      .sort((a, b) => {
        // Sort by urgency then by due date (soonest first)
        const urgencyOrder = { overdue: 1, dueSoon: 2, normal: 3, completed: 4 };
        if (urgencyOrder[a.urgency as keyof typeof urgencyOrder] !== urgencyOrder[b.urgency as keyof typeof urgencyOrder]) {
          return urgencyOrder[a.urgency as keyof typeof urgencyOrder] - urgencyOrder[b.urgency as keyof typeof urgencyOrder];
        }
        
        const dateA = tasks.find(t => t.id === a.id)?.dueDate;
        const dateB = tasks.find(t => t.id === b.id)?.dueDate;

        if (a.completed && !b.completed) return 1; // Completed tasks at the bottom of their urgency group
        if (!a.completed && b.completed) return -1;

        if (dateA && dateB) return parseISO(dateA).getTime() - parseISO(dateB).getTime();
        if (dateA) return -1;
        if (dateB) return 1;
        return 0;
      })
      .filter(task => !task.completed || task.urgency === "overdue"); // Show incomplete or overdue tasks.
      // If you want to show recently completed tasks too, you might adjust this filter.
      
    setDisplayTasks(processedTasks.slice(0, 5)); // Show top 5 relevant tasks
  }, [tasks]);


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Task Reminders</CardTitle>
        </div>
        <CardDescription>Upcoming, overdue, or recently completed tasks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pressing task reminders for the active mission.</p>
        ) : (
          <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {displayTasks.map((reminder) => (
              <li key={reminder.id} className={`flex items-start justify-between p-3 rounded-md transition-colors
                ${reminder.urgency === 'overdue' ? 'bg-red-100 dark:bg-red-900/30 border-red-500 border-l-4' : 
                  reminder.urgency === 'dueSoon' ? 'bg-yellow-100 dark:bg-yellow-800/30 border-yellow-500 border-l-4' : 
                  reminder.urgency === 'completed' ? 'bg-green-100 dark:bg-green-900/30 border-green-500 border-l-4' :
                  'bg-primary/5 hover:bg-primary/10'}`}>
                <div className="flex items-start space-x-3">
                  {reminder.urgency === 'overdue' ? <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" /> :
                   reminder.urgency === 'completed' ? <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" /> :
                   <CalendarClock className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  }
                  <div>
                    <p className={`text-sm font-medium ${
                      reminder.urgency === 'overdue' ? 'text-red-700 dark:text-red-300' : 
                      reminder.urgency === 'completed' ? 'text-green-700 dark:text-green-300 line-through' : 
                      'text-foreground'}`
                    }>
                      {reminder.text} {reminder.completed && <span className="ml-1">😊</span>}
                    </p>
                    <p className={`text-xs ${
                      reminder.urgency === 'overdue' ? 'text-red-600 dark:text-red-400' : 
                      reminder.urgency === 'dueSoon' ? 'text-yellow-700 dark:text-yellow-300' : 
                      reminder.urgency === 'completed' ? 'text-green-600 dark:text-green-400' :
                      'text-muted-foreground'}`
                    }>
                      {reminder.time}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
