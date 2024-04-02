import Home from '../../pages/Home';
import Settings from '../../pages/Settings';
import Dossiers from '../../pages/Dossiers';
import DossiersQueue from '../../pages/DossiersQueue';
import Receptions from '../../pages/Receptions';
import Patients from '../../pages/Patients';
import Storage from '../../pages/Storage';
import ViewPatient from '../../pages/ViewPatient';
import NewPatient from '../../pages/NewPatient';
import NewDossier from '../../pages/NewDossier';
import ViewDossier from '../../pages/ViewDossier';
import ViewReception from '../../pages/ViewReception';
import NewReception from '../../pages/NewReception';
import NewUser from '../../pages/NewUser';
import EditUser from '../../pages/EditUser';
import ShipmentEntry from '../../pages/ShipmentEntry';
import StorageReport from '../../pages/StorageReport';
import NewAttachment from '../../pages/NewAttachment';

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
		title: 'صف پرونده ها',
		href: '/dossiers/queue',
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
	{
		path: '/storage',
		element: <Storage />,
	},
	{
		path: '/storage/report',
		element: <StorageReport />,
	},
	{
		path: '/storage/entry',
		element: <ShipmentEntry />,
	},
	{
		path: '/settings',
		element: <Settings />,
	},
	{
		path: '/settings/user/new',
		element: <NewUser />,
	},
	{
		path: '/settings/user/:id',
		element: <EditUser />,
	},
	{
		path: '/attachment/:id/:type',
		element: <NewAttachment />,
	},
];
