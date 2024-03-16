import { ThemeProvider, createTheme } from '@mui/material';
import {
	useState,
	useMemo,
	useCallback,
	useContext,
	createContext,
} from 'react';

const ThemeContext = createContext();

const Theme = ({ children }) => {
	const [isDark, setIsDark] = useState(
		sessionStorage.getItem('isDark') || false
	);

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode: isDark ? 'dark' : 'light',
				},
				typography: {
					fontFamily: 'Yekan Bakh FaNum',
				},
			}),
		[isDark]
	);

	const toggleColorMode = useCallback(() => {
		setIsDark(prev => !prev);
		sessionStorage.setItem('isDark', isDark);
	}, []);

	return (
		<ThemeContext.Provider value={[isDark, toggleColorMode]}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</ThemeContext.Provider>
	);
};

export default Theme;

export const useColorScheme = () => useContext(ThemeContext);
