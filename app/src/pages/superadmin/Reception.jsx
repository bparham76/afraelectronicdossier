import { Fade, Typography, Grid, Button, Box } from '@mui/material';
import { Home, Add, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';

const Reception = () => {
	const navigate = useNavigate();

	const gridHeader = [
		{
			field: 'id',
			headerName: 'ردیف',
			width: (1 / 4) * 1000,
		},
		{
			field: 'patientName',
			headerName: 'نام بیمار',
			width: (1 / 4) * 1000,
		},
		{
			field: 'dateTime',
			headerName: 'تاریخ',
			width: (1 / 4) * 1000,
		},
		,
		{
			field: 'state',
			headerName: 'وضعیت',
			width: (1 / 4) * 1000,
		},
	];
	return (
		<Fade
			in={true}
			unmountOnExit>
			<Grid
				container
				spacing={4}>
				<Grid
					sx={{ display: 'flex', justifyContent: 'space-between' }}
					item
					xs={12}>
					<Typography
						variant='h4'
						fontWeight='bold'>
						مراجعات
					</Typography>
					<Box sx={{ display: 'flex', gap: 2 }}>
						<Button
							size='small'
							variant='outlined'
							startIcon={<Add />}>
							افزودن
						</Button>
						<Button
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
	);
};

export default Reception;
