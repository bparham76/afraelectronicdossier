import { ThemeProvider, createTheme } from '@mui/material';

const Theme = ({ children }) => {
	const theme = createTheme({
		typography: {
			fontFamily: 'Yekan Bakh FaNum',
		},
	});

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
