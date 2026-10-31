import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {}
});

export const THEME_STORAGE_KEY = 'pv_theme';

export function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {}
  return 'dark'; // ProfessorVirus brand default
}

function applyThemeToDOM(theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;
  const isDark = theme === 'dark';

  if (isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
    if (body) {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
      body.style.backgroundColor = '#030303';
      body.style.color = '#FFFFFF';
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#030303');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    if (body) {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
      body.style.backgroundColor = '#FAF7F2';
      body.style.color = '#1F2421';
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#FAF7F2');
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  // Apply immediately on mount
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  // Sync across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue);
        applyThemeToDOM(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setTheme = useCallback((newTheme) => {
    const target = newTheme === 'light' ? 'light' : 'dark';
    setThemeState(target);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, target);
    } catch (e) {}
    applyThemeToDOM(target);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch (e) {}
      applyThemeToDOM(next);
      return next;
    });
  }, []);

  const value = {
    theme,
    isDark: theme === 'dark',
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
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
