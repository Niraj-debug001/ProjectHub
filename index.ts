
export interface Task {
  id: string;
  name: string;
  completed: boolean;
  points: number;
  dueDate?: string; // ISO string format for date-time
  timeSpentSeconds: number; // Time spent in seconds
  timerActive: boolean; // Is the timer currently running for this task?
  lastStartTime?: string; // ISO string, when the timer was last started
}

export type MissionStatus = 'pending' | 'active' | 'completed' | 'failed';

export interface Mission {
  id:string;
  name: string;
  description: string;
  status: MissionStatus;
  tasks: Task[];
  createdAt: Date;
  imageUrl?: string;
}

export type UserSex = "male" | "female" | "other" | "prefer_not_to_say";

export interface User {
  id: string; // email will be id
  name: string;
  age?: number; // Optional
  sex?: UserSex; // Optional
  interests?: string; // Optional
  profession?: string; // Optional
  email: string;
  password: string; // In a real app, this would be hashed
  createdAt: Date;
}
