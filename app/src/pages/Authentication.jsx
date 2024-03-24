import {
	Typography,
	Box,
	Paper,
	Stack,
	Card,
	TextField,
	Button,
	Snackbar,
	Alert,
	IconButton,
	Fade,
} from '@mui/material';
import { useState, useEffect } from 'react';
import {
	LightMode,
	DarkMode,
	AdminPanelSettings,
	Login,
} from '@mui/icons-material';
import { useLogin } from '../services/auth/AuthenticationSystem';
import { useColorScheme } from '../components/Theme';

const Authentication = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [isDark, toggleColorScheme] = useColorScheme();

	const commenceLogin = useLogin();

	useEffect(() => {
		if (!isLoading) return;
		commenceLogin(username, password).then(r => {
			setIsLoading(false);
			if (!r) setShowAlert(true);
		});
	}, [isLoading]);

	const handleCloseAlert = (e, r) => r !== 'clickaway' && setShowAlert(false);

	return (
		<Paper
			elevation={0}
			sx={{
				height: '100vh',
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				borderRadius: 0,
			}}>
			<Snackbar
				open={showAlert}
				autoHideDuration={5000}
				onClose={handleCloseAlert}>
				<Alert
					severity='error'
					variant='filled'
					onClose={handleCloseAlert}>
					خطا در اعتبار سنجی. مجددا امتحان کنید.
				</Alert>
			</Snackbar>
			<Fade
				in={true}
				unmountOnExit>
				<Card
					elevation={4}
					sx={{ padding: 4, borderRadius: 4 }}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							padding: '1rem',
							margin: 0,
						}}>
						<AdminPanelSettings
							sx={{
								fontSize: '6rem',
							}}
						/>
					</Box>
					<Typography
						mb={4}
						variant='h4'
						fontWeight='bold'>
						ورود به سیستم
					</Typography>
					<Stack gap={1}>
						<TextField
							value={username}
							onChange={e => setUsername(e.target.value)}
							size='small'
							type='text'
							label='نام کاربری'
						/>
						<TextField
							value={password}
							onChange={e => setPassword(e.target.value)}
							size='small'
							type='password'
							label='رمز عبور'
						/>
						<Button
							startIcon={<Login />}
							disabled={
								username.length === 0 || password.length === 0
							}
							onClick={() => setIsLoading(true)}
							variant='contained'>
							ورود
						</Button>
					</Stack>
				</Card>
			</Fade>

			<IconButton
				sx={{
					position: 'fixed',
					left: '2rem',
					bottom: '2rem',
				}}
				onClick={toggleColorScheme}>
				{!isDark ? <DarkMode /> : <LightMode />}
			</IconButton>
		</Paper>
	);
};

export default Authentication;
