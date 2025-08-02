// src/hooks/useMissions.ts
"use client";

import { useContext } from 'react';
import MissionContext from '@/contexts/MissionContext';

export const useMissions = () => {
  const context = useContext(MissionContext);
  if (context === undefined) {
    throw new Error('useMissions must be used within a MissionProvider');
  }
  return context;
};
