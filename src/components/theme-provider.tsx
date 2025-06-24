"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { applyTheme, getSystemTheme, getSavedTheme, saveTheme, type ThemeMode } from "@/lib/theme"

type ThemeContextType = {
  mode: ThemeMode
  toggleMode: () => void
  setThemeMode: (mode: ThemeMode) => void
  isLoaded: boolean
  isDark: boolean
  isLight: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedTheme = getSavedTheme()
    const initialMode = savedTheme || getSystemTheme()

    setMode(initialMode)
    applyTheme(initialMode)
    setIsLoaded(true)

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      if (!getSavedTheme()) {
        const newMode = e.matches ? "dark" : "light"
        setMode(newMode)
        applyTheme(newMode)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light"
    setMode(newMode)
    applyTheme(newMode)
    saveTheme(newMode)
  }

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode)
    applyTheme(newMode)
    saveTheme(newMode)
  }

  const value = {
    mode,
    toggleMode,
    setThemeMode,
    isLoaded,
    isDark: mode === "dark",
    isLight: mode === "light",
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }
  return context
}
   