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
import { useAuthState } from '../services/auth/AuthenticationSystem';
import { useNotify } from '../services/NotificationSystem';
import LoadingOverlay from '../components/LoadingOverlay';
import { useState, useEffect } from 'react';
import axios from 'axios';
import StorageReportDatePicker from '../components/StorageReportDatePicker';

const StorageReport = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const { token } = useAuthState();
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState([]);
	const [viewReport, setViewReport] = useState('none');

	useEffect(() => {
		const getData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get('/storage/transactions', {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				});
				if (response.status < 400) setData(response.data.data);
			} catch (error) {
				notify({
					type: 'error',
					msg: 'خطا در برقراری ارتباط با سرور. اطلاعات دریافت نشد.',
				});
			} finally {
				setIsLoading(false);
			}
		};
		getData();
	}, []);

	return (
		<>
			<LoadingOverlay open={isLoading} />
			<StorageReportDatePicker
				view={viewReport}
				onCancel={() => setViewReport('none')}
			/>
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
							گزارشات انبار
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
							گزارشات ورود به انبار
						</Typography>
						<DataTable
							header={entryListHeader}
							data={data.filter(d => d.type === 'NewShipment')}
						/>
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
							<ButtonGroup>
								<Button
									onClick={() => setViewReport('month')}
									size='small'
									variant='outlined'>
									گزارش ماهانه
								</Button>
								<Button
									onClick={() => setViewReport('year')}
									size='small'
									variant='outlined'>
									گزارش سالانه
								</Button>
							</ButtonGroup>
						</Box>
						<DataTable
							header={consumeListHeader}
							data={data.filter(d => d.type === 'NewReception')}
						/>
					</Grid>
				</Grid>
			</Fade>
		</>
	);
};

export default StorageReport;

const entryListHeader = [
	{
		field: 'date',
		headerName: 'تاریخ',
		width: 150,
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
		field: 'quantity',
		headerName: 'مقدار دارو',
		width: 100,
	},
];
const consumeListHeader = [
	{
		field: 'date',
		headerName: 'تاریخ',
		width: 100,
	},
	{
		field: 'drug',
		headerName: 'نوع دارو',
		width: 100,
		valueGetter: v =>
			v.value === 'Metadon'
				? 'متادون'
				: v.value === 'Opium'
				? 'اوپیوم'
				: 'B2',
	},
	{
		field: 'quantity',
		headerName: 'مقدار دارو',
		width: 100,
	},
	{
		field: 'dossierNumber',
		headerName: 'شماره پرونده',
		width: 100,
	},
	{
		field: 'patientName',
		headerName: 'نام بیمار',
		width: 100,
	},
];
