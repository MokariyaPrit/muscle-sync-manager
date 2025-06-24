"use client"

import { useEffect, useState } from "react"
import { applyTheme, getSystemTheme, getSavedTheme, saveTheme, type ThemeMode } from "@/lib/theme"

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>("light")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Get saved theme or system preference
    const savedTheme = getSavedTheme()
    const initialMode = savedTheme || getSystemTheme()

    setMode(initialMode)
    applyTheme(initialMode)
    setIsLoaded(true)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no saved preference
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

  return {
    mode,
    toggleMode,
    setThemeMode,
    isLoaded,
    isDark: mode === "dark",
    isLight: mode === "light",
  }
}
  