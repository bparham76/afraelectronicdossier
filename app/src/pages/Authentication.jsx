import {
	Typography,
	Box,
	Stack,
	Card,
	TextField,
	Button,
	Snackbar,
	Alert,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useLogin } from '../services/auth/AuthenticationSystem';

const Authentication = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

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
		<Box
			sx={{
				height: '90vh',
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
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
			<Card
				elevation={4}
				sx={{ padding: 4, borderRadius: 4 }}>
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
						disabled={username.length == 0 || password.length == 0}
						onClick={() => setIsLoading(true)}
						variant='contained'>
						ورود
					</Button>
				</Stack>
			</Card>
		</Box>
	);
};

export default Authentication;
