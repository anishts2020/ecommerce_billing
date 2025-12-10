import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative inline-flex items-center w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none ring-1 ring-gray-300 dark:ring-gray-600 bg-gray-200 dark:bg-gray-700"
    >
      <span className="absolute left-2 text-gray-700 dark:text-gray-300 text-xs">●</span>
      <span className="absolute right-2 text-gray-700 dark:text-gray-300 text-xs">☾</span>
      <span
        className={
          "absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 " +
          (isDark ? "translate-x-8" : "translate-x-0")
        }
      />
    </button>
  );
}
