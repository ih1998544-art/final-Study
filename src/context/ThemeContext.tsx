import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'sepia' | 'midnight' | 'nord' | 'cyber' | 'forest';
export type ColorTheme = 'emerald' | 'sapphire' | 'amethyst' | 'crimson' | 'amber';

export interface ThemeModeOption {
  id: ThemeMode;
  label: string;
  sublabel: string;
  badge: string;
  bgHex: string;
  textHex: string;
  borderHex: string;
  isDarkSpectrum: boolean;
  iconName?: string;
}

export const THEME_MODES: ThemeModeOption[] = [
  {
    id: 'light',
    label: 'Light Day',
    sublabel: 'Crisp daylight reading',
    badge: 'Day',
    bgHex: '#FFFFFF',
    textHex: '#0F172A',
    borderHex: '#E2E8F0',
    isDarkSpectrum: false,
    iconName: 'Sun',
  },
  {
    id: 'dark',
    label: 'Dark Charcoal',
    sublabel: 'Classic obsidian night study',
    badge: 'Night',
    bgHex: '#0F172A',
    textHex: '#F8FAFC',
    borderHex: '#334155',
    isDarkSpectrum: true,
    iconName: 'Moon',
  },
  {
    id: 'sepia',
    label: 'Warm Sepia',
    sublabel: 'Eye-comfort paper parchment',
    badge: 'Eye Care',
    bgHex: '#F5EFE6',
    textHex: '#382E25',
    borderHex: '#DFD5BD',
    isDarkSpectrum: false,
    iconName: 'BookOpen',
  },
  {
    id: 'midnight',
    label: 'OLED Midnight',
    sublabel: 'Pure pitch black OLED saver',
    badge: 'OLED Black',
    bgHex: '#000000',
    textHex: '#FFFFFF',
    borderHex: '#262626',
    isDarkSpectrum: true,
    iconName: 'Sparkles',
  },
  {
    id: 'nord',
    label: 'Nordic Frost',
    sublabel: 'Deep Arctic slate navy',
    badge: 'Arctic Navy',
    bgHex: '#0D1527',
    textHex: '#E2E8F0',
    borderHex: '#1E293B',
    isDarkSpectrum: true,
    iconName: 'Compass',
  },
  {
    id: 'cyber',
    label: 'Cyber Matrix',
    sublabel: 'High-contrast neon terminal',
    badge: 'Neon Matrix',
    bgHex: '#040808',
    textHex: '#00FF9D',
    borderHex: '#059669',
    isDarkSpectrum: true,
    iconName: 'Terminal',
  },
  {
    id: 'forest',
    label: 'Botanical Sage',
    sublabel: 'Natural calm forest & sage earth',
    badge: 'Pine Forest',
    bgHex: '#07130E',
    textHex: '#E2ECE6',
    borderHex: '#1A3328',
    isDarkSpectrum: true,
    iconName: 'Trees',
  },
];

export interface ColorThemeOption {
  id: ColorTheme;
  label: string;
  badge: string;
  primaryHex: string;
  bgHex: string;
}

export const COLOR_THEMES: ColorThemeOption[] = [
  { id: 'emerald', label: 'Emerald Scholar', badge: 'Green', primaryHex: '#059669', bgHex: '#ecfdf5' },
  { id: 'sapphire', label: 'Sapphire Logic', badge: 'Blue', primaryHex: '#2563eb', bgHex: '#eff6ff' },
  { id: 'amethyst', label: 'Amethyst Creative', badge: 'Purple', primaryHex: '#7c3aed', bgHex: '#f5f3ff' },
  { id: 'crimson', label: 'Crimson Focus', badge: 'Rose', primaryHex: '#e11d48', bgHex: '#fff1f2' },
  { id: 'amber', label: 'Amber Solar', badge: 'Gold', primaryHex: '#d97706', bgHex: '#fffbeb' },
];

interface ThemeContextType {
  themeMode: ThemeMode;
  colorTheme: ColorTheme;
  availableModes: ThemeModeOption[];
  availableThemes: ColorThemeOption[];
  toggleThemeMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleColorTheme: () => void;
  setColorTheme: (color: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('studyzone_theme_mode');
      if (
        saved === 'light' ||
        saved === 'dark' ||
        saved === 'sepia' ||
        saved === 'midnight' ||
        saved === 'nord' ||
        saved === 'cyber' ||
        saved === 'forest'
      ) {
        return saved as ThemeMode;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // fallback
    }
    return 'light';
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    try {
      const saved = localStorage.getItem('studyzone_color_theme');
      if (
        saved === 'emerald' ||
        saved === 'sapphire' ||
        saved === 'amethyst' ||
        saved === 'crimson' ||
        saved === 'amber'
      ) {
        return saved as ColorTheme;
      }
    } catch {
      // fallback
    }
    return 'emerald';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Clear any previous mode classes
    root.classList.remove('dark', 'sepia', 'midnight', 'nord', 'cyber', 'forest', 'light');
    body?.classList.remove('dark', 'sepia', 'midnight', 'nord', 'cyber', 'forest', 'light');

    // Add current mode class and attributes
    root.classList.add(themeMode);
    body?.classList.add(themeMode);
    root.setAttribute('data-mode', themeMode);
    body?.setAttribute('data-mode', themeMode);

    const activeOption = THEME_MODES.find((m) => m.id === themeMode);
    if (activeOption?.isDarkSpectrum) {
      root.classList.add('dark');
      body?.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }

    try {
      localStorage.setItem('studyzone_theme_mode', themeMode);
    } catch {}
  }, [themeMode]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.setAttribute('data-color', colorTheme);
    body?.setAttribute('data-color', colorTheme);
    try {
      localStorage.setItem('studyzone_color_theme', colorTheme);
    } catch {}
  }, [colorTheme]);

  const toggleThemeMode = () => {
    setThemeModeState((prev) => {
      const idx = THEME_MODES.findIndex((m) => m.id === prev);
      const nextIdx = (idx + 1) % THEME_MODES.length;
      return THEME_MODES[nextIdx].id;
    });
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const toggleColorTheme = () => {
    setColorThemeState((prev) => {
      const idx = COLOR_THEMES.findIndex((c) => c.id === prev);
      const nextIdx = (idx + 1) % COLOR_THEMES.length;
      return COLOR_THEMES[nextIdx].id;
    });
  };

  const setColorTheme = (color: ColorTheme) => {
    setColorThemeState(color);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        colorTheme,
        availableModes: THEME_MODES,
        availableThemes: COLOR_THEMES,
        toggleThemeMode,
        setThemeMode,
        toggleColorTheme,
        setColorTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
