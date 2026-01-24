"use client";
import { useState, useEffect, useCallback, use } from "react";
import { useTheme } from "next-themes";
import { MoonIcon } from "lucide-react";
import { SunIcon } from "lucide-react";
const ThemeSwitcher = () =>{
    const {theme,setTheme, systemTheme} = useTheme();
    const [mounted,setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if(!mounted) return null;

    const current = theme == 'system' ? systemTheme : theme;
    const isDark = current === "dark";

    return(
        <button
            aria-label="Toggle theme"
            role="switch"
            aria-checked={isDark}
            onClick={() => setTheme (isDark ? 'light' : 'dark') }
            className="p-2 rounded bg-gray-200 dark:bg-gray-800"        

        >
            {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
    );
};


export default ThemeSwitcher;