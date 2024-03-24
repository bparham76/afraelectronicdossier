import { Fade, Grid, Typography, Button, ButtonGroup } from '@mui/material';
import { Home, Add, Search, Inventory } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SearchBox from '../components/SearchBox';
import LoadingOverlay from '../components/LoadingOverlay';
import DataTable from '../components/DataTable';

const Dossiers = () => {
	const navigate = useNavigate();
	const [dataList, setDataList] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [searchString, setSearchString] = useState('');
	const [showSearchDialog, setShowSearchDialog] = useState(false);
	const handleShowSearch = () => setShowSearchDialog(true);
	const handleHideSearch = () => setShowSearchDialog(false);
	const handleCommitSearch = () => {
		alert(searchString);
		setIsLoading(true);
	};

	const handleViewDetails = e => navigate('/dossier/' + e.id);

	const gridHeader = [
		{
			field: 'id',
			headerName: 'شماره',
			width: 100,
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
	const data = [
		{
			id: 1,
			firstName: 'عزیز اله',
			lastName: 'رجب نیا',
			drugType: 'متادون',
		},
		{
			id: 2,
			firstName: 'اکبر',
			lastName: 'رمضانی',
			drugType: 'اوپیوم',
		},
	];

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
								startIcon={<Search />}>
								جستجو
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
							data={data}
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
