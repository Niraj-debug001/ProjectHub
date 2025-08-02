
// src/contexts/AuthContext.tsx
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserSex } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: Omit<User, 'id' | 'createdAt' | 'password'>, password: string) => Promise<{ success: boolean; message?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  checkUserExists: (email: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USERS_KEY = 'missionControlUsers';
const LOCAL_STORAGE_CURRENT_USER_KEY = 'missionControlCurrentUser';

const DEFAULT_ADMIN_EMAIL = "admin@example.com";
const DEFAULT_ADMIN_PASSWORD = "password123";
const DEFAULT_ADMIN_NAME = "Admin";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    const storedUsers = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    let initialUsers = new Map<string, User>();

    if (storedUsers) {
      try {
        const parsedUsersArray: [string, User][] = JSON.parse(storedUsers);
        initialUsers = new Map(parsedUsersArray.map(([email, userData]) => [email, {...userData, createdAt: new Date(userData.createdAt)}]));
      } catch (e) {
        console.error("Error parsing users from localStorage", e);
      }
    }

    if (!initialUsers.has(DEFAULT_ADMIN_EMAIL)) {
      const adminUser: User = {
        id: DEFAULT_ADMIN_EMAIL,
        email: DEFAULT_ADMIN_EMAIL,
        name: DEFAULT_ADMIN_NAME,
        password: DEFAULT_ADMIN_PASSWORD, 
        createdAt: new Date(),
      };
      initialUsers.set(DEFAULT_ADMIN_EMAIL, adminUser);
    }
    
    setUsers(initialUsers);

    const storedCurrentUser = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    if (storedCurrentUser) {
      try {
        const parsedCurrentUser: User = JSON.parse(storedCurrentUser);
        if (initialUsers.has(parsedCurrentUser.email)) {
          const { password, ...userToSet } = initialUsers.get(parsedCurrentUser.email)!;
          setCurrentUser(userToSet);
        } else {
           localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
        }
      } catch (e) {
        console.error("Error parsing current user from localStorage", e);
        localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(Array.from(users.entries())));
      if (currentUser) {
        const { password, ...userToStore } = currentUser;
        localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(userToStore));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
      }
    }
  }, [users, currentUser, isLoading]);

  const login = useCallback(async (email: string, passwordInput: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const user = users.get(email);
    if (user && user.password === passwordInput) { 
      const { password, ...userToSet } = user; 
      setCurrentUser(userToSet);
      setIsLoading(false);
      return true;
    }
    setCurrentUser(null);
    setIsLoading(false);
    return false;
  }, [users]);

  const signup = useCallback(async (userData: Omit<User, 'id' | 'createdAt' | 'password'>, passwordInput: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (users.has(userData.email)) {
      setIsLoading(false);
      return { success: false, message: "Email already registered." };
    }

    const newUser: User = {
      ...userData,
      id: userData.email,
      password: passwordInput, 
      createdAt: new Date(),
    };

    setUsers(prevUsers => {
      const newUsersMap = new Map(prevUsers);
      newUsersMap.set(newUser.email, newUser);
      return newUsersMap;
    });
    setIsLoading(false);
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    router.push('/');
  }, [router]);

  const changePassword = useCallback(async (currentPasswordInput: string, newPasswordInput: string): Promise<boolean> => {
    if (!currentUser) return false;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const userFromMap = users.get(currentUser.email);
    if (userFromMap && userFromMap.password === currentPasswordInput) {
      const updatedUser = { ...userFromMap, password: newPasswordInput };
      setUsers(prevUsers => {
        const newUsersMap = new Map(prevUsers);
        newUsersMap.set(currentUser.email, updatedUser);
        return newUsersMap;
      });
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  }, [currentUser, users]);

  const resetPassword = useCallback(async (email: string, newPasswordInput: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const userFromMap = users.get(email);
    if (userFromMap) {
      const updatedUser = { ...userFromMap, password: newPasswordInput };
      setUsers(prevUsers => {
        const newUsersMap = new Map(prevUsers);
        newUsersMap.set(email, updatedUser);
        return newUsersMap;
      });
      setIsLoading(false);
      return { success: true };
    }
    
    setIsLoading(false);
    return { success: false, message: "User not found." };
  }, [users]);

  const checkUserExists = useCallback(async (email: string): Promise<boolean> => {
    // No need for setIsLoading here as it's a quick check
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate slight delay
    return users.has(email);
  }, [users]);


  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, signup, changePassword, resetPassword, checkUserExists, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
