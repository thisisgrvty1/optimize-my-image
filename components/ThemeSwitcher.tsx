import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeName } from '../types';
import { PaletteIcon } from './icons/PaletteIcon';
import { CheckIcon } from './icons/CheckIcon';
import { useI8n } from '../hooks/useI8n';

const themes: { name: ThemeName; color: string }[] = [
  { name: 'orange', color: 'bg-orange-500' },
  { name: 'rose', color: 'bg-rose-500' },
  { name: 'violet', color: 'bg-violet-600' },
  { name: 'blue', color: 'bg-blue-600' },
  { name: 'green', color: 'bg-green-600' },
  { name: 'slate', color: 'bg-slate-600' },
];

const ThemeSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { themeName, setThemeName } = useTheme();
  const { t } = useI8n();
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        popoverRef.current && !popoverRef.current.contains(target) &&
        buttonRef.current && !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleThemeChange = (name: ThemeName) => {
    setThemeName(name);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-offset-background-dark dark:focus:ring-primary-dark"
        aria-label={t('themeSwitcherTitle')}
      >
        <PaletteIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute right-0 mt-2 w-48 bg-card-light dark:bg-card-dark rounded-2xl shadow-lg-theme border border-border-light dark:border-border-dark p-2 animate-fade-in"
          style={{ animationDuration: '150ms' }}
        >
          <div className="grid grid-cols-3 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme.name)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-opacity duration-200 ease-in-out-quad hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-card-dark focus:ring-primary-dark ${theme.color}`}
                aria-label={`Select ${theme.name} theme`}
              >
                {themeName === theme.name && <CheckIcon className="w-6 h-6 text-white" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
