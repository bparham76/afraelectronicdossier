import {
	Fade,
	Typography,
	Grid,
	Box,
	Button,
	ButtonGroup,
} from '@mui/material';
import { Home, Add, ViewComfy } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';

const Storage = () => {
	const navigate = useNavigate();
	const gridHeader = [
		{
			field: 'id',
			headerName: 'شماره',
			width: 100,
		},
		{
			field: 'drugType',
			headerName: 'نوع دارو',
			width: 200,
		},
		,
		{
			field: 'amount',
			headerName: 'موجودی',
			width: 200,
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
					item
					sx={{ display: 'flex', justifyContent: 'space-between' }}
					xs={12}>
					<Typography
						variant='h4'
						fontWeight='bold'>
						انبار
					</Typography>
					<ButtonGroup>
						<Button
							onClick={() => navigate('/storage/report')}
							size='small'
							variant='outlined'
							startIcon={<ViewComfy />}>
							گزارشات
						</Button>
						<Button
							onClick={() => navigate('/storage/entry')}
							size='small'
							variant='outlined'
							startIcon={<Add />}>
							افزودن موجودی
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
					<DataTable header={gridHeader} />
				</Grid>
			</Grid>
		</Fade>
	);
};

export default Storage;
