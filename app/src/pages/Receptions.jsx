import { Fade, Typography, Grid, Button, ButtonGroup } from '@mui/material';
import { Home, Add, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import LoadingOverlay from '../components/LoadingOverlay';
import { useEffect, useState } from 'react';
import SearchByDate from '../components/SearchByDate';
import { useAuthState } from '../services/auth/AuthenticationSystem';
import { useNotify } from '../services/NotificationSystem';
import axios from 'axios';

const Receptions = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const { token } = useAuthState();
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState([]);
	const [searchString, setSearchString] = useState('');
	const [showSearchDialog, setShowSearchDialog] = useState(false);
	const handleShowSearch = () => setShowSearchDialog(true);
	const handleHideSearch = () => setShowSearchDialog(false);
	const handleCommitSearch = () => {
		alert(searchString);
		setIsLoading(true);
	};

	useEffect(() => {
		const getData = async () => {
			try {
				const response = await axios.get('/reception', {
					headers: { Authorization: 'Bearer ' + token },
				});

				if (response.status < 400) setData(response.data.data);
			} catch (error) {
				notify({
					type: 'error',
					msg: 'خطا در برقراری ارتباط با سرور.',
				});
			} finally {
				setIsLoading(false);
			}
		};
		getData();
	}, []);

	return (
		<>
			<SearchByDate
				open={showSearchDialog}
				onClose={handleHideSearch}
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
							مراجعات
						</Typography>
						<ButtonGroup>
							<Button
								onClick={() => navigate('/reception/new')}
								size='small'
								variant='outlined'
								startIcon={<Add />}>
								افزودن
							</Button>
							<Button
								onClick={handleShowSearch}
								size='small'
								variant='outlined'
								startIcon={<Search />}>
								جستجو
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
							data={data}
						/>
					</Grid>
				</Grid>
			</Fade>
			<LoadingOverlay open={isLoading} />
		</>
	);
};

export default Receptions;

const gridHeader = [
	{
		field: 'number',
		headerName: 'شماره پرونده',
		width: 200,
	},
	{
		field: 'date',
		headerName: 'تاریخ',
		width: 200,
	},
	{
		field: 'name',
		headerName: 'نام بیمار',
		width: 200,
	},
	,
	{
		field: 'dose',
		headerName: 'مقدار تجویز',
		width: 200,
	},
	{
		field: 'control',
		headerName: 'کنترل',
		width: 200,
		sortable: false,
		disableClickEventBubbling: true,
		renderCell: params => (
			<>
				<Button
					size='small'
					variant='outlined'
					color='error'>
					حذف
				</Button>
			</>
		),
	},
];
