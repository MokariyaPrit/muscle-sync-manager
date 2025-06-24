"use client"
import { Check, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/hooks/use-theme"
import type { ThemeMode } from "@/lib/theme"

const themeOptions: { mode: ThemeMode; label: string; description: string }[] = [
  { mode: "light", label: "Light", description: "Clean and bright interface" },
  { mode: "dark", label: "Dark", description: "Easy on the eyes" },
]

export function ThemeSelector() {
  const { mode, setThemeMode } = useTheme()

  const handleThemeChange = (newMode: ThemeMode) => {
    setThemeMode(newMode)
  }

  const currentTheme = themeOptions.find((theme) => theme.mode === mode)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          {currentTheme?.label || "Theme"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themeOptions.map((theme) => (
          <DropdownMenuItem
            key={theme.mode}
            onClick={() => handleThemeChange(theme.mode)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{theme.label}</span>
              <span className="text-xs text-muted-foreground">{theme.description}</span>
            </div>
            {mode === theme.mode && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
   