import { Fade, Typography, Grid, Button, ButtonGroup } from '@mui/material';
import { Home, Add, Search, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SearchBox from '../components/SearchBox';
import LoadingOverlay from '../components/LoadingOverlay';
import DataTable from '../components/DataTable';
import { useNotify } from '../services/NotificationSystem';
import axios from 'axios';
import { useAuthState } from '../services/auth/AuthenticationSystem';

const Patients = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const { token } = useAuthState();
	const [patientList, setPatientList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSearch, setIsSearch] = useState(false);
	const [searchString, setSearchString] = useState('');
	const [showSearchDialog, setShowSearchDialog] = useState(false);
	const handleShowSearch = () => {
		if (searchString.trim() !== '') {
			setSearchString('');
			setIsLoading(true);
			setIsSearch(false);
		} else setShowSearchDialog(true);
	};
	const handleHideSearch = () => setShowSearchDialog(false);
	const handleCommitSearch = () => setIsLoading(true);

	const gridHeader = [
		{
			field: 'id',
			headerName: 'شماره',
			width: 100,
		},
		{
			field: 'nationalID',
			headerName: 'شماره ملی',
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
			field: 'gender',
			headerName: 'جنسیت',
			width: 200,
			valueGetter: v => (v.value === 'Male' ? 'آقا' : 'خانم'),
		},
		{
			field: 'phone',
			headerName: 'تلفن همراه',
			width: 200,
		},
	];

	useEffect(() => {
		if (!isLoading) return;
		const exec = async () => {
			try {
				const response = await axios.get('/patient', {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				});
				if (response.status < 300) {
					setPatientList(response.data.data);
				}
			} catch {
				notify({ msg: 'خطا در برقراری ارتباط با سرور', type: 'error' });
			} finally {
				setIsLoading(false);
			}
		};
		exec();
	}, [isLoading]);

	useEffect(() => {
		if (!isLoading || searchString.trim() === '') return;

		const search = async () => {
			try {
				const response = await axios.get('/patient/s/' + searchString, {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				});
				if (response.status < 300) {
					setIsSearch(true);
					setPatientList(response.data.data);
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
						جستجو بر اساس کد ملی، شماره تلفن و نام بیمار'
			/>
			<Fade
				in={true}
				unmountOnExit>
				<Grid
					container
					spacing={4}>
					<Grid
						item
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
						xs={12}>
						<Typography
							variant='h4'
							fontWeight='bold'>
							بیماران {isSearch && `جستجو برای: ${searchString}`}
						</Typography>
						<ButtonGroup>
							<Button
								onClick={() => navigate('/patient/new')}
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
							data={patientList}
						/>
					</Grid>
				</Grid>
			</Fade>
			<LoadingOverlay open={isLoading} />
		</>
	);
};

export default Patients;
