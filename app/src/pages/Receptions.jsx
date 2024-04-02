import { Fade, Typography, Grid, Button, ButtonGroup } from '@mui/material';
import { Home, Add, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import LoadingOverlay from '../components/LoadingOverlay';
import { useEffect, useState } from 'react';
import SearchByDate from '../components/SearchByDate';
import { useAuthState } from '../services/auth/AuthenticationSystem';
import { useNotify, useOkCancelDialog } from '../services/NotificationSystem';
import axios from 'axios';

const Receptions = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const dialog = useOkCancelDialog();
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

	const handleRowClick = params => navigate('/reception/' + params.row.id);

	const handleDeleteRecord = (r_date, r_id, r_number) =>
		dialog({
			title: 'توجه',
			caption: `مراجعه با تاریخ ${r_date} از پرونده شماره ${r_number} حذف می شود.`,
			onAccept: () =>
				setTimeout(
					() =>
						dialog({
							title: 'توجه',
							caption:
								'حذف رکورد بر گزارشگیری از مصرف دارو تاثیرگذار خواهد بود.',
							onAccept: async () => {
								try {
									setIsLoading(true);
									const response = await axios.delete(
										'/reception/' + r_id,
										{
											headers: {
												Authorization:
													'Bearer ' + token,
											},
										}
									);
									if (response.status < 400) {
										notify({
											msg: 'رکورد مراجعه با موفقیت حذف شد.',
										});
										setData(prev =>
											prev.filter(
												item => item.id !== r_id
											)
										);
									}
								} catch (error) {
									notify({
										type: 'error',
										msg: 'خطا در برقراری ارتباط با سرور.',
									});
								} finally {
									setIsLoading(false);
								}
							},
						}),
					150
				),
		});

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
		{
			field: 'drug',
			headerName: 'نوع دارو',
			width: 150,
			valueGetter: v =>
				v.value === 'Metadon'
					? 'متادون'
					: v.value === 'Opium'
					? 'اوپیوم'
					: 'B2',
		},
		{
			field: 'dose',
			headerName: 'مقدار تجویز',
			width: 150,
		},
		{
			field: 'control',
			headerName: '',
			width: 200,
			sortable: false,
			disableClickEventBubbling: true,
			renderCell: params => (
				<>
					<Button
						onClick={e => {
							e.stopPropagation();
							handleDeleteRecord(
								params.row.date,
								params.row.id,
								params.row.number
							);
						}}
						size='small'
						variant='outlined'
						color='error'>
						حذف
					</Button>
				</>
			),
		},
	];

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
							onRowClick={handleRowClick}
						/>
					</Grid>
				</Grid>
			</Fade>
			<LoadingOverlay open={isLoading} />
		</>
	);
};

export default Receptions;
