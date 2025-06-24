export type ThemeMode = "light" | "dark"

export const deepBlueTheme = {
  light: {
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%",
    card: "0 0% 100%",
    "card-foreground": "222.2 84% 4.9%",
    popover: "0 0% 100%",
    "popover-foreground": "222.2 84% 4.9%",
    primary: "230 100% 50%",
    "primary-foreground": "210 40% 98%",
    secondary: "230 100% 95%",
    "secondary-foreground": "222.2 84% 4.9%",
    muted: "230 100% 95%",
    "muted-foreground": "215.4 16.3% 46.9%",
    accent: "230 100% 92%",
    "accent-foreground": "222.2 84% 4.9%",
    destructive: "0 84.2% 60.2%",
    "destructive-foreground": "210 40% 98%",
    border: "230 100% 88%",
    input: "230 100% 88%",
    ring: "230 100% 50%",
    radius: "0.75rem",
    // Sidebar colors
    "sidebar-background": "230 100% 98%",
    "sidebar-foreground": "222.2 84% 4.9%",
    "sidebar-primary": "230 100% 50%",
    "sidebar-primary-foreground": "210 40% 98%",
    "sidebar-accent": "230 100% 92%",
    "sidebar-accent-foreground": "222.2 84% 4.9%",
    "sidebar-border": "230 100% 88%",
    "sidebar-ring": "230 100% 50%",
  },
  dark: {
    background: "222.2 84% 4.9%",
    foreground: "210 40% 98%",
    card: "222.2 84% 4.9%",
    "card-foreground": "210 40% 98%",
    popover: "222.2 84% 4.9%",
    "popover-foreground": "210 40% 98%",
    primary: "230 100% 65%",
    "primary-foreground": "222.2 84% 4.9%",
    secondary: "230 50% 12%",
    "secondary-foreground": "210 40% 98%",
    muted: "230 50% 12%",
    "muted-foreground": "215 20.2% 65.1%",
    accent: "230 50% 12%",
    "accent-foreground": "210 40% 98%",
    destructive: "0 62.8% 30.6%",
    "destructive-foreground": "210 40% 98%",
    border: "230 50% 12%",
    input: "230 50% 12%",
    ring: "230 100% 65%",
    // Sidebar colors
    "sidebar-background": "230 50% 6%",
    "sidebar-foreground": "210 40% 98%",
    "sidebar-primary": "230 100% 65%",
    "sidebar-primary-foreground": "222.2 84% 4.9%",
    "sidebar-accent": "230 50% 12%",
    "sidebar-accent-foreground": "210 40% 98%",
    "sidebar-border": "230 50% 12%",
    "sidebar-ring": "230 100% 65%",
  },
}

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  const colors = deepBlueTheme[mode]

  // Remove existing mode classes
  root.classList.remove("light", "dark")
  // Add current mode class
  root.classList.add(mode)

  // Apply CSS variables
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })
}

export function getSystemTheme(): ThemeMode {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  return "light"
}

export function saveTheme(mode: ThemeMode) {
  if (typeof window !== "undefined") {
    localStorage.setItem("theme-mode", mode)
  }
}

export function getSavedTheme(): ThemeMode | null {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("theme-mode")
    return saved === "dark" || saved === "light" ? saved : null
  }
  return null
}
 