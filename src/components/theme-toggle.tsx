"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle() {
  const { mode, toggleMode, isLoaded } = useTheme()

  if (!isLoaded) {
    return (
      <Button variant="outline" size="icon" disabled>
        <div className="h-4 w-4 animate-pulse bg-muted rounded" />
      </Button>
    )
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleMode} className="transition-all duration-300 hover:scale-105">
      {mode === "light" ? (
        <Sun className="h-4 w-4 transition-all duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="h-4 w-4 transition-all duration-300 rotate-0 scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
