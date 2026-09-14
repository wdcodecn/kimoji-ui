import { useCallback, useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

import { cn } from "../lib/utils"
import { Button } from "./button"

export type ThemeMode = "light" | "dark" | "system"

const STORAGE_KEY = "kimoji-ui-theme"

function resolveMode(mode: ThemeMode): "light" | "dark" {
  if (mode !== "system") return mode
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyMode(mode: ThemeMode) {
  const resolved = resolveMode(mode)
  document.documentElement.classList.toggle("dark", resolved === "dark")
  document.documentElement.style.colorScheme = resolved
}

/** Class-based (.dark) theme toggle with localStorage persistence. */
export function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system"
    return (window.localStorage.getItem(STORAGE_KEY) as ThemeMode) || "system"
  })

  useEffect(() => {
    applyMode(mode)
    try {
      window.localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // Private browsing can disable storage; the theme still applies.
    }
  }, [mode])

  useEffect(() => {
    if (mode !== "system") return
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => applyMode("system")
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [mode])

  const cycle = useCallback(() => {
    setMode((m) => (m === "light" ? "dark" : m === "dark" ? "system" : "light"))
  }, [])

  const resolved = typeof window === "undefined" ? "light" : resolveMode(mode)

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={cycle}
      aria-label={resolved === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={`Theme: ${mode}`}
      className={cn(className)}
    >
      {resolved === "dark" ? <Sun /> : <Moon />}
    </Button>
  )
}

/** Apply the persisted (or system) theme before paint. Render inside <head>. */
export function ThemeInitScript({ storageKey = STORAGE_KEY }: { storageKey?: string }) {
  const code = `(function(){try{var m=localStorage.getItem(${JSON.stringify(storageKey)})||"system";var d=m==="system"?matchMedia("(prefers-color-scheme: dark)").matches:m==="dark";document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`
  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
