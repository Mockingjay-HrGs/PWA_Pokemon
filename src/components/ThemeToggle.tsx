import React from "react";
import { useTheme } from "../theme/ThemeContext";

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Mode sombre" : "☀️ Mode clair"}
        </button>
    );
};

export default ThemeToggle;
