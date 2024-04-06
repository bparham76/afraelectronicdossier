import { useMemo } from 'react';
import { Container, Paper } from '@mui/material';
import AppHeader from '../../components/AppHeader';
import ErrorPage from '../../pages/ErrorPage';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { useAuthState } from '../auth/AuthenticationSystem';
import { adminMenu, adminRoutes } from './Admin';
import { userMenu, userRoutes } from './User';
import NotificationSystem from '../NotificationSystem';

const Router = () => {
	const { role } = useAuthState();

	const menu = useMemo(
		() =>
			role === 'SuperAdmin'
				? adminMenu
				: role === 'Doctor'
				? adminMenu
				: role === 'Secretary'
				? userMenu
				: role === 'Admin' && userMenu,
		[]
	);

	const router = useMemo(
		() =>
			createBrowserRouter([
				{
					path: '/',
					element: (
						<>
							<AppHeader menu={menu} />
							<Container
								style={{
									paddingTop: '1rem',
									height: '90vh',
								}}>
								<NotificationSystem>
									<Outlet />
								</NotificationSystem>
							</Container>
						</>
					),
					children:
						role === 'SuperAdmin'
							? adminRoutes
							: role === 'Doctor'
							? adminRoutes
							: role === 'Secretary'
							? userRoutes
							: role === 'Admin' && userRoutes,
					errorElement: <ErrorPage />,
				},
			]),
		[]
	);

	return (
		<>
			<Paper
				sx={{ borderRadius: 0, height: '100vh', overflow: 'hidden' }}>
				<RouterProvider router={router} />
			</Paper>
		</>
	);
};

export default Router;
