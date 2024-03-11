import { useMemo } from 'react';
import { Button, Container, Paper, Typography } from '@mui/material';
import AppHeader from '../../components/AppHeader';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from '../../pages/ErrorPage';

const Router = () => {
	const router = useMemo(
		() =>
			createBrowserRouter([
				{
					path: '/',
					element: 'hello',
					errorElement: <ErrorPage />,
				},
				{
					path: 'test',
					element: 'test page',
				},
			]),
		[]
	);

	return (
		<>
			<Paper sx={{ borderRadius: 0, height: '100vh' }}>
				<AppHeader />
				<Container>
					<RouterProvider router={router} />
				</Container>
			</Paper>
		</>
	);
};

export default Router;
