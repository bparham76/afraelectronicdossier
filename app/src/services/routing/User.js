import Home from '../../pages/Home';
import Dossiers from '../../pages/Dossiers';
import DossiersQueue from '../../pages/DossiersQueue';
import Receptions from '../../pages/Receptions';
import Patients from '../../pages/Patients';
import ViewPatient from '../../pages/ViewPatient';
import NewPatient from '../../pages/NewPatient';
import NewDossier from '../../pages/NewDossier';
import ViewDossier from '../../pages/ViewDossier';
import ViewReception from '../../pages/ViewReception';
import NewReception from '../../pages/NewReception';

export const userMenu = [
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
		title: 'صف پرونده ها',
		href: '/dossiers/queue',
	},
	{
		title: 'مراجعات',
		href: '/receptions',
	},
];

export const userRoutes = [
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/patients',
		element: <Patients />,
	},
	{
		path: '/patient/:id',
		element: <ViewPatient />,
	},
	{
		path: '/patient/new',
		element: <NewPatient />,
	},
	{
		path: '/dossiers',
		element: <Dossiers />,
	},
	{
		path: '/dossiers/queue',
		element: <DossiersQueue />,
	},
	{
		path: '/dossier/:id',
		element: <ViewDossier />,
	},
	{
		path: '/dossier/new',
		element: <NewDossier />,
	},
	{
		path: '/receptions',
		element: <Receptions />,
	},
	{
		path: '/reception/new',
		element: <NewReception />,
	},
	{
		path: '/reception/:id',
		element: <ViewReception />,
	},
];
