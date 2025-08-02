
// src/contexts/MissionContext.tsx
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { Mission, MissionStatus, Task } from '@/types';
import { MOCK_MISSIONS } from '@/lib/mockData';

interface MissionContextType {
  missions: Mission[];
  getMissionById: (id: string) => Mission | undefined;
  addMission: (mission: Omit<Mission, 'id' | 'createdAt' | 'tasks'> & { tasks?: Partial<Task>[] }) => void;
  updateMissionStatus: (id: string, status: MissionStatus) => void;
  updateTaskCompletion: (missionId: string, taskId: string, completed: boolean) => void;
  startTaskTimer: (missionId: string, taskId: string) => void;
  pauseTaskTimer: (missionId: string, taskId: string) => void;
  resetTaskTimer: (missionId: string, taskId: string) => void;
  isLoading: boolean;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider = ({ children }: { children: ReactNode }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedMissions = localStorage.getItem('missions');
    if (storedMissions) {
      setMissions(JSON.parse(storedMissions).map((m: Mission) => ({
        ...m, 
        createdAt: new Date(m.createdAt),
        tasks: m.tasks.map(t => ({
          ...t,
          timeSpentSeconds: t.timeSpentSeconds || 0,
          timerActive: t.timerActive || false,
          lastStartTime: t.lastStartTime,
        }))
      })));
    } else {
      setMissions(MOCK_MISSIONS);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('missions', JSON.stringify(missions));
    }
  }, [missions, isLoading]);

  const getMissionById = useCallback((id: string) => {
    return missions.find(mission => mission.id === id);
  }, [missions]);

  const addMission = useCallback((missionData: Omit<Mission, 'id' | 'createdAt' | 'tasks'> & { tasks?: Partial<Task>[] }) => {
    const newMission: Mission = {
      id: `m${Date.now()}`, 
      ...missionData,
      tasks: (missionData.tasks || []).map((task, index) => ({
        id: `t${Date.now()}-${index}`,
        name: task.name || `Unnamed Task ${index + 1}`,
        completed: task.completed || false,
        points: task.points || 0,
        dueDate: task.dueDate,
        timeSpentSeconds: 0,
        timerActive: false,
        lastStartTime: undefined,
      })),
      createdAt: new Date(),
    };
    setMissions(prevMissions => [newMission, ...prevMissions]);
  }, []);

  const updateMissionStatus = useCallback((id: string, status: MissionStatus) => {
    setMissions(prevMissions =>
      prevMissions.map(mission =>
        mission.id === id ? { ...mission, status } : mission
      )
    );
  }, []);
  

  const updateTaskCompletion = useCallback((missionId: string, taskId: string, completed: boolean) => {
    setMissions(prevMissions => 
      prevMissions.map(mission => {
        if (mission.id === missionId) {
          return {
            ...mission,
            tasks: mission.tasks.map(task => {
              if (task.id === taskId) {
                let updatedTask = { ...task, completed };
                // If task is marked complete and timer was active, pause it
                if (completed && task.timerActive && task.lastStartTime) {
                  const elapsedMillis = Date.now() - new Date(task.lastStartTime).getTime();
                  updatedTask.timeSpentSeconds = (updatedTask.timeSpentSeconds || 0) + Math.round(elapsedMillis / 1000);
                  updatedTask.timerActive = false;
                  updatedTask.lastStartTime = undefined;
                }
                return updatedTask;
              }
              return task;
            }),
          };
        }
        return mission;
      })
    );
  }, []);

  const startTaskTimer = useCallback((missionId: string, taskId: string) => {
    setMissions(prevMissions => 
      prevMissions.map(mission => {
        if (mission.id === missionId) {
          return {
            ...mission,
            tasks: mission.tasks.map(task => 
              task.id === taskId && !task.timerActive ? { ...task, timerActive: true, lastStartTime: new Date().toISOString() } : task
            ),
          };
        }
        return mission;
      })
    );
  }, []);

  const pauseTaskTimer = useCallback((missionId: string, taskId: string) => {
    setMissions(prevMissions => 
      prevMissions.map(mission => {
        if (mission.id === missionId) {
          return {
            ...mission,
            tasks: mission.tasks.map(task => {
              if (task.id === taskId && task.timerActive && task.lastStartTime) {
                const elapsedMillis = Date.now() - new Date(task.lastStartTime).getTime();
                return { 
                  ...task, 
                  timerActive: false, 
                  timeSpentSeconds: (task.timeSpentSeconds || 0) + Math.round(elapsedMillis / 1000),
                  lastStartTime: undefined 
                };
              }
              return task;
            }),
          };
        }
        return mission;
      })
    );
  }, []);

  const resetTaskTimer = useCallback((missionId: string, taskId: string) => {
    setMissions(prevMissions => 
      prevMissions.map(mission => {
        if (mission.id === missionId) {
          return {
            ...mission,
            tasks: mission.tasks.map(task => 
              task.id === taskId ? { ...task, timerActive: false, timeSpentSeconds: 0, lastStartTime: undefined } : task
            ),
          };
        }
        return mission;
      })
    );
  }, []);


  return (
    <MissionContext.Provider value={{ 
        missions, 
        getMissionById, 
        addMission, 
        updateMissionStatus, 
        updateTaskCompletion, 
        startTaskTimer,
        pauseTaskTimer,
        resetTaskTimer,
        isLoading 
    }}>
      {children}
    </MissionContext.Provider>
  );
};

export default MissionContext;
