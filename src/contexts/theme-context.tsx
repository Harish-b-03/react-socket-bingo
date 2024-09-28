import {
	ReactElement,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

type ThemeType = "light" | "dark" | "galaxyMoon";

interface ThemeContextType {
	theme: ThemeType;
	updateTheme: (val: ThemeType) => void;
	themeVariables: Object;
}

const ThemeContext = createContext<ThemeContextType>({
	theme: "galaxyMoon",
	updateTheme: (val: ThemeType) => {},
	themeVariables: {},
});

const DEFAULT_THEME_VARIABLES = {
	"--poster-bg": "transparent",
	"--board-bg": "transparent",
	"--border-color": "rgb(229 231 235)",
	"--backdrop-blur": "0px",
	"--box-shadow": "",
	"--text-color": "black",
	"--text-color-hover": "rgb(109 40 217)",
};

const DARK_THEME_VARIABLES = {
	"--poster-bg": "#070F2B",
	"--board-bg": "rgba(255, 255, 255, 0.5);",
	"--border-color": "#535C91",
	"--backdrop-blur": "4px",
	"--box-shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
	"--text-color": "#ebebeb",
	"--text-color-hover": "rgb(109 40 217)",
};

const GALAXY_MOON_THEME_VARIABLES = {
	"--poster-bg": "rgba(0,0,0,0.9)",
	"--board-bg": "rgba(255, 255, 255, 0.25);",
	"--border-color": "black",
	"--backdrop-blur": "40px",
	"--box-shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
	"--text-color": "black",
	"--text-color-hover": "rgb(109 40 217)",
};

export const ThemeProvider: React.FC<{ children: ReactElement }> = ({
	children,
}) => {
	const [theme, setTheme] = useState<ThemeType>("galaxyMoon");
	const [themeVariables, setThemeVariables] = useState<Object>(
		DEFAULT_THEME_VARIABLES
	);

	const updateTheme = (value: ThemeType) => {
		setTheme(value);
		updateThemeVariables(value);
	};

	const updateThemeVariables = (value: ThemeType) => {
		switch (value) {
			case "dark":
				setThemeVariables(DARK_THEME_VARIABLES);
				break;
			case "galaxyMoon":
				setThemeVariables(GALAXY_MOON_THEME_VARIABLES);
				break;
			default:
				setThemeVariables(DEFAULT_THEME_VARIABLES);
				break;
		}
		setTheme(value);
	};

	// useEffect(() => {
	//  // we will use galaxyMoon as the default theme
	// 	if (
	// 		window.matchMedia &&
	// 		window.matchMedia("(prefers-color-scheme: dark)").matches
	// 	) {
	// 		updateTheme("dark");
	// 		updateThemeVariables("dark");
	// 	} else {
	// 		updateTheme("galaxyMoon");
	// 		updateThemeVariables("galaxyMoon");
	// 	}
	// }, []);

	return (
		<ThemeContext.Provider value={{ theme, updateTheme, themeVariables }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useThemeContext = () => useContext(ThemeContext);
