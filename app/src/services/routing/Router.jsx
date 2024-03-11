// import { useState, useEffect } from 'react';
import { Button, Container, Paper, Typography } from '@mui/material';
import AppHeader from '../../components/AppHeader';

const Router = () => {
	return (
		<>
			<AppHeader />
			<Paper sx={{ borderRadius: 0, p: 4 }}>
				<Container>
					<Typography
						variant='h2'
						fontWeight={600}>
						سلام و عرض ادب از درز جلو و عقب
					</Typography>
					<Button>Hello</Button>
					<Button variant='contained'>How are you</Button>
				</Container>
			</Paper>
		</>
	);
};

export default Router;
