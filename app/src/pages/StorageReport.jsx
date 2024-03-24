import {
	Grid,
	Box,
	Button,
	ButtonGroup,
	Typography,
	Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Redo } from '@mui/icons-material';
import DataTable from '../components/DataTable';

const StorageReport = () => {
	const navigate = useNavigate();
	const entryListHeader = [
		{
			field: 'id',
			headerName: 'شماره',
			width: 100,
		},
		{
			field: 'dateTime',
			headerName: 'تاریخ',
			width: 200,
		},
		{
			field: 'Opium',
			headerName: 'اوپیوم',
			width: 70,
		},
		{
			field: 'metadon',
			headerName: 'متادون',
			width: 70,
		},
		{
			field: 'B2',
			headerName: 'B2',
			width: 70,
		},
	];
	const consumeListHeader = [
		{
			field: 'id',
			headerName: 'شماره',
			width: 100,
		},
		{
			field: 'dateTime',
			headerName: 'تاریخ',
			width: 200,
		},
		{
			field: 'drugType',
			headerName: 'نوع دارو',
			width: 100,
		},
		{
			field: 'amount',
			headerName: 'مقدار',
			width: 100,
		},
	];
	return (
		<Fade
			in={true}
			unmountOnExit>
			<Grid
				sx={{ marginTop: -4 }}
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
						width='auto'
						variant='h4'>
						مشاهده گزارشات انبار
					</Typography>
					<Button
						onClick={() => navigate('/storage')}
						variant='outlined'
						startIcon={<Redo />}>
						بازگشت
					</Button>
				</Grid>
				<Grid
					item
					xs={6}>
					<Typography
						mb={1}
						width='auto'
						variant='h6'>
						گزارشات ورود دارو به انبار
					</Typography>
					<DataTable header={entryListHeader} />
				</Grid>
				<Grid
					item
					xs={6}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}>
						<Typography
							mb={1}
							width='auto'
							variant='h6'>
							گزارشات مصرف
						</Typography>
						<Button
							size='small'
							variant='outlined'>
							گزارش ماهانه
						</Button>
					</Box>
					<DataTable header={consumeListHeader} />
				</Grid>
			</Grid>
		</Fade>
	);
};

export default StorageReport;
