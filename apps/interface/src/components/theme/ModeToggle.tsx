"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  return (
    <>
      {!isDark ? (
        // biome-ignore lint/a11y/useButtonType: <explanation>
        <button onClick={() => setTheme("dark")}>
          <MoonIcon />
          <span className="sr-only">Toggle dark mode</span>
        </button>
      ) : (
        // biome-ignore lint/a11y/useButtonType: <explanation>
        <button onClick={() => setTheme("light")}>
          <SunIcon />
          <span className="sr-only">Toggle light mode</span>
        </button>
      )}
    </>
  );
}
