import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_KEY = "theme";

type Props = {
    children: React.ReactNode;
};

export const ThemeProvider: React.FC<Props> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem(THEME_KEY);
        if (stored === "light" || stored === "dark") {
            setTheme(stored);
        }
    }, []);

    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.dataset.theme = theme;
        }
        if (typeof window !== "undefined") {
            window.localStorage.setItem(THEME_KEY, theme);
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }, []);

    const value: ThemeContextValue = { theme, toggleTheme };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return ctx;
};
