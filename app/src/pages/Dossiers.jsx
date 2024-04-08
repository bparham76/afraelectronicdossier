import {
	Fade,
	Grid,
	Typography,
	Button,
	ButtonGroup,
	Badge,
	Box,
} from '@mui/material';
import { Home, Add, Search, Inventory, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SearchBox from '../components/SearchBox';
import LoadingOverlay from '../components/LoadingOverlay';
import DataTable from '../components/DataTable';
import { useAuthState } from '../services/auth/AuthenticationSystem';
import { useNotify } from '../services/NotificationSystem';
import axios from 'axios';

const Dossiers = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const { token } = useAuthState();
	const [dataList, setDataList] = useState([]);
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

	const handleViewDetails = e => navigate('/dossier/' + e.id);

	useEffect(() => {
		if (!isLoading || isSearch) return;

		const getList = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get('/dossier/all', {
					headers: { Authorization: 'Bearer ' + token },
				});
				if (response.status < 400) {
					setDataList(
						response.data.data?.map(r => ({
							id: r?.id,
							firstName: r.patient?.firstName,
							lastName: r.patient?.lastName,
							drugType: r?.drugType,
							dossierNumber: r?.dossierNumber,
							state: r?.state,
						}))
					);
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
				const response = await axios.get('/dossier/s/' + searchString, {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				});
				if (response.status < 300) {
					setIsSearch(true);
					setDataList(
						response.data.data?.map(r => ({
							id: r?.id,
							firstName: r.patient?.firstName,
							lastName: r.patient?.lastName,
							drugType: r?.drugType,
							dossierNumber: r?.dossierNumber,
							state: r?.state,
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
							پرونده ها
							{isSearch && `؛ جستجو برای: ${searchString}`}
						</Typography>
						<ButtonGroup>
							<Button
								onClick={() => navigate('/dossier/new')}
								size='small'
								variant='outlined'
								startIcon={<Add />}>
								افزودن
							</Button>
							<Button
								onClick={handleShowSearch}
								size='small'
								variant='outlined'
								startIcon={!isSearch ? <Search /> : <Close />}>
								{!isSearch ? 'جستجو' : 'نمایش لیست اصلی'}
							</Button>
							<Button
								onClick={() => navigate('/dossiers/queue')}
								size='small'
								variant='outlined'
								startIcon={<Inventory />}>
								پرونده های در صف
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
							onRowClick={handleViewDetails}
						/>
					</Grid>
				</Grid>
			</Fade>
			<LoadingOverlay open={isLoading} />
		</>
	);
};

export default Dossiers;

const gridHeader = [
	{
		field: 'state',
		headerName: 'فعال',
		width: 100,
		renderCell: params =>
			params.value === 'Active' && (
				<Box
					sx={{
						width: 100,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<Badge
						badgeContent=' '
						color='primary'
					/>
				</Box>
			),
	},
	{
		field: 'dossierNumber',
		headerName: 'شماره پرونده',
		width: 200,
	},
	{
		field: 'firstName',
		headerName: 'نام',
		width: 200,
	},
	,
	{
		field: 'lastName',
		headerName: 'نام خانوادگی',
		width: 200,
	},
	{
		field: 'drugType',
		headerName: 'نوع مصرف',
		width: 200,
		valueGetter: v =>
			v.value === 'Metadon'
				? 'متادون'
				: v.value === 'Opium'
				? 'اوپیوم'
				: 'بوپرو',
	},
	// {
	// 	field: 'action',
	// 	headerName: 'کنترل',
	// 	sortable: false,
	// 	width: 200,
	// 	disableClickEventBubbling: true,
	// 	renderCell: params => {
	// 		const handleClick = () =>
	// 			alert(params.row.firstName + ' ' + params.row.lastName);
	// 		return (
	// 			<Button
	// 				onClick={handleClick}
	// 				variant='outlined'
	// 				size='small'>
	// 				نمایش
	// 			</Button>
	// 		);
	// 	},
	// },
];
