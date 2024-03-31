import { Fade, Grid, Typography, Button, ButtonGroup } from '@mui/material';
import { Home, Search, Inventory, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SearchBox from '../components/SearchBox';
import LoadingOverlay from '../components/LoadingOverlay';
import DataTable from '../components/DataTable';
import { useNotify } from '../services/NotificationSystem';
import { useAuthState } from '../services/auth/AuthenticationSystem';
import axios from 'axios';

const DossiersQueue = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const { token } = useAuthState();
	const [dataList, setDataList] = useState([]);
	const [dossierCaps, setDossierCaps] = useState([
		{ drug: 'b2', cap: 0 },
		{ drug: 'opium', cap: 0 },
		{ drug: 'metadon', cap: 0 },
	]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSearch, setIsSearch] = useState(false);
	const [searchString, setSearchString] = useState('');
	const [showSearchDialog, setShowSearchDialog] = useState(false);
	const handleShowSearch = () => {
		if (searchString.trim() !== '' || isSearch) {
			setSearchString('');
			setIsLoading(true);
			setIsSearch(false);
		} else setShowSearchDialog(true);
	};
	const handleHideSearch = () => setShowSearchDialog(false);
	const handleCommitSearch = () => {
		setIsSearch(true);
		setIsLoading(true);
	};

	const gridHeader = [
		// {
		// 	field: 'id',
		// 	headerName: 'شماره',
		// 	width: 100,
		// },
		{
			field: 'firstName',
			headerName: 'نام',
			width: 200,
		},
		{
			field: 'lastName',
			headerName: 'نام خانوادگی',
			width: 200,
		},
		{
			field: 'drugType',
			headerName: 'صف تشکیل',
			width: 200,
			valueGetter: v =>
				v.value === 'Metadon'
					? 'متادون'
					: v.value === 'Opium'
					? 'اوپیوم'
					: 'B2',
		},
		{
			field: 'phone',
			headerName: 'تلفن همراه',
			width: 200,
		},

		{
			field: 'action',
			headerName: '',
			sortable: false,
			width: 200,
			disableClickEventBubbling: true,
			sortable: false,
			renderCell: params => {
				const can =
					dossierCaps.find(
						c => c.drug === params.row.drugType.toLowerCase()
					).cap > 0;
				return (
					<>
						{can && (
							<Button
								onClick={e => {
									e.stopPropagation();
									alert('create dossier');
								}}
								variant='outlined'
								size='small'>
								تشکیل
							</Button>
						)}
						<Button
							sx={{ marginLeft: 1 }}
							onClick={e => {
								e.stopPropagation();
								alert('delete queue dossier');
							}}
							color='error'
							variant='outlined'
							size='small'>
							حذف
						</Button>
					</>
				);
			},
		},
	];

	const handleRowClick = row => navigate('/dossier/' + row.id + '?queue=1');

	useEffect(() => {
		if (!isLoading || isSearch) return;

		const getList = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get('/dossier/all?queue=1', {
					headers: { Authorization: 'Bearer ' + token },
				});
				if (response.status < 400) {
					setDataList(
						response.data.data?.map(r => ({
							id: r?.id,
							firstName: r.patient?.firstName,
							lastName: r.patient?.lastName,
							drugType: r?.drugType,
							phone: r.patient.phone,
						}))
					);
				}
				const res = await axios.get('/dossier/capacity/dossier', {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				});
				if (res.status < 300) {
					setDossierCaps(res?.data?.data);
				}
			} catch (error) {
				setDataList([]);
				notify({
					type: 'error',
					msg: 'خطا در برقراری ارتباط با سرور، لیست پرونده ها دریافت نشد.',
				});
			} finally {
				setIsLoading(false);
			}
		};

		getList();
	}, [isLoading]);

	useEffect(() => {
		if (!isLoading || searchString.trim() === '') return;

		const search = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(
					'/dossier/s/' + searchString + '?queue=1',
					{
						headers: {
							Authorization: 'Bearer ' + token,
						},
					}
				);
				if (response.status < 300) {
					setIsSearch(true);
					setDataList(
						response.data.data?.map(r => ({
							id: r?.id,
							firstName: r.patient?.firstName,
							lastName: r.patient?.lastName,
							drugType: r?.drugType,
							phone: r?.patient?.phone,
						}))
					);
				}
			} catch {
				setIsSearch(false);
				notify({
					msg: 'جستجوی ناموفق، خطا در برقراری ارتباط با سرور',
					type: 'error',
				});
			} finally {
				setIsLoading(false);
			}
		};
		search();
	}, [isLoading]);

	return (
		<>
			<SearchBox
				onCommit={handleCommitSearch}
				open={showSearchDialog}
				onClose={handleHideSearch}
				search={searchString}
				onChange={setSearchString}
				content='
						جستجو بر اساس شماره پرونده، کد ملی، تلفن همراه و نام
						بیمار'
			/>
			<Fade
				in={true}
				unmountOnExit>
				<Grid
					container
					spacing={4}>
					<Grid
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
						item
						xs={12}>
						<Typography
							variant='h4'
							fontWeight='bold'>
							پرونده های در صف تشکیل
							{isSearch && `؛ جستجو برای: ${searchString}`}
						</Typography>
						<ButtonGroup>
							<Button
								onClick={handleShowSearch}
								size='small'
								variant='outlined'
								startIcon={!isSearch ? <Search /> : <Close />}>
								{!isSearch ? 'جستجو' : 'نمایش لیست اصلی'}
							</Button>
							<Button
								onClick={() => navigate('/dossiers')}
								size='small'
								variant='outlined'
								startIcon={<Inventory />}>
								پرونده ها
							</Button>
							<Button
								onClick={() => navigate('/')}
								size='small'
								variant='outlined'
								startIcon={<Home />}>
								صفحه اصلی
							</Button>
						</ButtonGroup>
					</Grid>
					<Grid
						item
						xs={12}>
						<DataTable
							header={gridHeader}
							data={dataList}
							onRowClick={handleRowClick}
						/>
					</Grid>
				</Grid>
			</Fade>
			<LoadingOverlay open={isLoading} />
		</>
	);
};

export default DossiersQueue;
