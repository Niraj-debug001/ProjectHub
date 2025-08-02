// src/contexts/AppProviders.tsx
"use client";

import type { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { MissionProvider } from './MissionContext';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <MissionProvider>
        {children}
      </MissionProvider>
    </AuthProvider>
  );
};
