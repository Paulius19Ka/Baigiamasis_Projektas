import { createContext, useEffect, useState } from "react";
import { ChildProp, ThemeContextTypes } from "../../types";

const ThemeContext = createContext<ThemeContextTypes | undefined>(undefined);
const ThemeProvider = ({ children }: ChildProp) => {

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  
  const themeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    // font
    document.documentElement.style.setProperty('--font-main', theme === 'dark' ? '#ffffff' : '#080808');
    document.documentElement.style.setProperty('--font-hover', theme === 'dark' ? '#cacaca' : '#373737');
    document.documentElement.style.setProperty('--font-active', theme === 'dark' ? '#a1a1a1' : '#656565');

    // background
    document.documentElement.style.setProperty('--background-main', theme === 'dark' ? '#202128' : '#e1e1e1');
    document.documentElement.style.setProperty('--background-dark', theme === 'dark' ? '#121317' : '#898989');

    // accent
    document.documentElement.style.setProperty('--accent-main', theme === 'dark' ? '#6ed6ff' : '#00b7ff');
    document.documentElement.style.setProperty('--accent-hover', theme === 'dark' ? '#c2eeff' : '#009cd9');
    document.documentElement.style.setProperty('--accent-active', theme === 'dark' ? '#8caab8' : '#00678f');

    // button
    document.documentElement.style.setProperty('--button-main', theme === 'dark' ? '#808080' : '#ffffff');
    document.documentElement.style.setProperty('--button-hover', theme === 'dark' ? '#bdbdbd' : '#dadada');
    document.documentElement.style.setProperty('--button-active', theme === 'dark' ? '#dcdcdc' : '#a2a2a2');

    // message
    document.documentElement.style.setProperty('--message-error', theme === 'dark' ? '#ff5c5c' : '#991717');
    document.documentElement.style.setProperty('--message-success', theme === 'dark' ? '#65ff7c' : '#27b53c');

    // modal
    document.documentElement.style.setProperty('--modal-background', theme === 'dark' ? '#414352' : '#ffffff');
    document.documentElement.style.setProperty('--modal-overlay', theme === 'dark' ? '#000000a2' : '#000000a2');
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeToggle
      }}
    >
      { children }
    </ThemeContext.Provider>
  )
}

export { ThemeProvider };
export default ThemeContext;