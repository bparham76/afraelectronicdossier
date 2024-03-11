import { Box, Button, Typography } from '@mui/material';
import { useColorScheme } from '../components/Theme';
import ErrorLight from '../error-light.png';
import ErrorDark from '../error-dark.png';
import { useNavigate } from 'react-router-dom';
import { Redo } from '@mui/icons-material';

const ErrorPage = () => {
	const [isDark, _] = useColorScheme();
	const navigate = useNavigate();
	const handleReturn = () => navigate('/');

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				height: '100%',
				gap: 4,
			}}>
			<img
				height={300}
				width={300}
				src={isDark ? ErrorDark : ErrorLight}
				alt='error lamp'
			/>
			<Typography variant='h4'>خطایی رخ داده است...</Typography>
			<Button
				variant='outlined'
				startIcon={<Redo />}
				onClick={handleReturn}>
				بازگشت
			</Button>
		</Box>
	);
};

export default ErrorPage;
