"use client";
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { MoonIcon } from "lucide-react";
import { SunIcon } from "lucide-react";
const ThemeSwitcher = () =>{
    const {theme,setTheme, systemTheme} = useTheme();
    const [mounted,setMounted] = useState(false);

    useCallback(() => setMounted(true), []);

    if(!mounted) return null;

    const current = theme == 'system' ? systemTheme : theme;

    return(
        <button
            aria-label="Toggle theme"
            role="switch"
            onClick={() => setTheme (current == 'dark' ? 'light' : 'dark') }
            className="p-2 rounded bg-gray-200 dark:bg-gray-800"

        >
            {current == 'dark' ? 'Dark' : 'Light' }
        </button>
    );
};


export default ThemeSwitcher;