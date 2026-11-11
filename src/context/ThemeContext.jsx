import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Pure Light-Mode Theme Context (Dark Mode completely removed per specification)
const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {}
});

export const THEME_STORAGE_KEY = 'pv_theme';

export function getInitialTheme() {
  return 'light'; // Strictly Light Mode
}

function applyThemeToDOM() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;

  root.classList.add('light');
  root.classList.remove('dark');
  root.setAttribute('data-theme', 'light');

  if (body) {
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
    body.style.backgroundColor = '#FFFFFF';
    body.style.color = '#0F172A';
  }

  const metas = document.querySelectorAll('meta[name="theme-color"]');
  metas.forEach(m => m.setAttribute('content', '#FFFFFF'));

  try {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
  } catch (e) {}
}

export function ThemeProvider({ children }) {
  // Always light mode
  const [theme] = useState('light');

  useEffect(() => {
    applyThemeToDOM();
  }, []);

  const setTheme = useCallback(() => {
    applyThemeToDOM();
  }, []);

  const toggleTheme = useCallback(() => {
    // No-op: Dark mode has been permanently removed per specification
    applyThemeToDOM();
  }, []);

  const value = {
    theme: 'light',
    isDark: false,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
