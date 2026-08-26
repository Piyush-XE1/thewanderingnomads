import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function getInitial(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("wn-theme", theme);
  } catch {
    // ignore
  }
}

export function ThemeToggle({ variant = "dark" }: { variant?: "light" | "dark" }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitial());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  const onDark = mounted && theme === "dark";
  const base = "inline-flex h-9 w-9 items-center justify-center rounded-lg border transition";
  const styles =
    variant === "light"
      ? "border-white/20 bg-white/5 text-white hover:bg-white/15"
      : onDark
        ? "border-forest/20 bg-forest/5 text-forest hover:bg-forest/10"
        : "border-ink/10 bg-ink/3 text-ink/60 hover:bg-ink/6 hover:text-forest";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={onDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={onDark}
      className={`${base} ${styles}`}
    >
      {onDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
