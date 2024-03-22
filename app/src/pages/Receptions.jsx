import { Fade, Typography, Grid, Button, Box } from '@mui/material';
import { Home, Add, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import SearchBox from '../components/SearchBox';
import LoadingOverlay from '../components/LoadingOverlay';
import { useState } from 'react';
import SearchByDate from '../components/SearchByDate';

const Receptions = () => {
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
			field: 'dateTime',
			headerName: 'تاریخ',
			width: 200,
		},
		{
			field: 'patientName',
			headerName: 'نام بیمار',
			width: 200,
		},
		,
		{
			field: 'drugDose',
			headerName: 'مقدار تجویز',
			width: 200,
		},
	];
	return (
		<>
			<SearchByDate
				open={showSearchDialog}
				onClose={handleHideSearch}
			/>
			{/* <SearchBox
				onCommit={handleCommitSearch}
				open={showSearchDialog}
				onClose={handleHideSearch}
				search={searchString}
				onChange={setSearchString}
				content='جستجوی مراجعات'
			/> */}
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
						<Box sx={{ display: 'flex', gap: 2 }}>
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

export default Receptions;
