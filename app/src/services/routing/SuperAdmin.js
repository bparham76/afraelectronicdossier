import Home from '../../pages/superadmin/Home';
import Settings from '../../pages/superadmin/Settings';
import Dossiers from '../../pages/superadmin/Dossiers';
import Reception from '../../pages/superadmin/Reception';
import Patients from '../../pages/superadmin/Patients';
import Storage from '../../pages/superadmin/Storage';

export const superAdminMenu = [
	{
		title: 'صفحه اصلی',
		href: '/',
	},
	{
		title: 'بیماران',
		href: '/patients',
	},
	{
		title: 'پرونده ها',
		href: '/dossiers',
	},
	{
		title: 'مراجعات',
		href: '/receptions',
	},
	{
		title: 'انبار',
		href: '/storage',
	},
	{
		title: 'تنظیمات',
		href: '/settings',
	},
];

export const superAdminRoutes = [
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/patients',
		element: <Patients />,
	},
	{
		path: '/dossiers',
		element: <Dossiers />,
	},
	{
		path: '/receptions',
		element: <Reception />,
	},
	{
		path: '/storage',
		element: <Storage />,
	},
	{
		path: '/settings',
		element: <Settings />,
	},
];
