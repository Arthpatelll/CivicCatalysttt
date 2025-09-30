import { Issue, User } from '../types';

export const STORAGE_KEYS = {
  ISSUES: 'civic_catalyst_issues',
  CURRENT_USER: 'civic_catalyst_current_user',
  LANGUAGE: 'civic_catalyst_language',
  UPVOTES: 'civic_catalyst_upvotes'
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadIssues = (): Issue[] => {
  return loadFromStorage(STORAGE_KEYS.ISSUES, []);
};

export const saveIssues = (issues: Issue[]): void => {
  saveToStorage(STORAGE_KEYS.ISSUES, issues);
};

export const getCurrentUser = (): User | null => {
  return loadFromStorage(STORAGE_KEYS.CURRENT_USER, null);
};

export const setCurrentUser = (user: User | null): void => {
  saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
};

export const getUserUpvotes = (): string[] => {
  return loadFromStorage(STORAGE_KEYS.UPVOTES, []);
};

export const setUserUpvotes = (upvotes: string[]): void => {
  saveToStorage(STORAGE_KEYS.UPVOTES, upvotes);
};