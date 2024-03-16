import { useMemo } from 'react';
import { Container, Paper } from '@mui/material';
import AppHeader from '../../components/AppHeader';
import ErrorPage from '../../pages/ErrorPage';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { useAuthState } from '../auth/AuthenticationSystem';
import { superAdminMenu, superAdminRoutes } from './SuperAdmin';
import { doctorMenu, doctorRoutes } from './Doctor';
import { secretaryMenu, secretaryRoutes } from './Secretary';
import { adminMenu, adminRoutes } from './Admin';

const Router = () => {
	const { role } = useAuthState();

	const menu = useMemo(
		() =>
			role === 'SuperAdmin'
				? superAdminMenu
				: role === 'Doctor'
				? doctorMenu
				: role === 'Secretary'
				? secretaryMenu
				: role === 'Admin' && adminMenu,
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
								<Outlet />
							</Container>
						</>
					),
					children:
						role === 'SuperAdmin'
							? superAdminRoutes
							: role === 'Doctor'
							? doctorRoutes
							: role === 'Secretary'
							? secretaryRoutes
							: role === 'Admin' && adminRoutes,
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
