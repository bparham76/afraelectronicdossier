import { Typography, Box, Card, TextField, Button } from '@mui/material';

const Authentication = () => {
	return (
		<Box
			sx={{
				height: '90vh',
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<Card sx={{ padding: 2 }}>
				<Typography
					variant='h4'
					fontWeight='bold'>
					ورود به سیستم
				</Typography>
			</Card>
		</Box>
	);
};

export default Authentication;
