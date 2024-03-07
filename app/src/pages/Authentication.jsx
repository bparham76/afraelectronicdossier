import { Typography, Box, Stack, Card, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';

const Authentication = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	return (
		<Box
			sx={{
				height: '90vh',
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
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
						variant='contained'>
						ورود
					</Button>
				</Stack>
			</Card>
		</Box>
	);
};

export default Authentication;
