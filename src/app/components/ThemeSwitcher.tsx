"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("antigravity-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = saved ? saved === "dark" : prefersDark;
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("antigravity-theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      title={isDark ? "Mudar para Tema Claro" : "Mudar para Tema Escuro"}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium transition-all duration-150"
      style={{
        backgroundColor: "var(--bg-input)",
        borderColor: "var(--border)",
        color: "var(--text-secondary)",
      }}
    >
      {isDark ? <Sun size={13} /> : <Moon size={13} />}
      <span>{isDark ? "Claro" : "Escuro"}</span>
    </button>
  );
}
