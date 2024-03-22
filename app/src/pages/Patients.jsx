import { Fade, Typography, Grid, Button, Box } from '@mui/material';
import { Home, Add, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SearchBox from '../components/SearchBox';
import LoadingOverlay from '../components/LoadingOverlay';
import DataTable from '../components/DataTable';

const Patients = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [searchString, setSearchString] = useState('');
	const [showSearchDialog, setShowSearchDialog] = useState(false);
	const handleShowSearch = () => setShowSearchDialog(true);
	const handleHideSearch = () => setShowSearchDialog(false);
	const handleCommitSearch = () => {
		alert(searchString);
		setIsLoading(true);
	};

	const gridHeader = [
		{
			field: 'id',
			headerName: 'ردیف',
			width: 100,
		},
		{
			field: 'nationalId',
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
		},
		{
			field: 'phone',
			headerName: 'تلفن همراه',
			width: 200,
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
						جستجو بر اساس کد ملی و نام بیمار'
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
							بیماران
						</Typography>
						<Box sx={{ display: 'flex', gap: 2 }}>
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
						</Box>
					</Grid>
					<Grid
						item
						xs={12}>
						<DataTable header={gridHeader} />
					</Grid>
				</Grid>
			</Fade>
			<LoadingOverlay open={isLoading} />
		</>
	);
};

export default Patients;
