import { Fade, Typography, Grid, Button, ButtonGroup } from '@mui/material';
import { Home, Add, ViewComfy } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import LoadingOverlay from '../components/LoadingOverlay';
import { useNotify } from '../services/NotificationSystem';
import { useAuthState } from '../services/auth/AuthenticationSystem';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Storage = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const { token } = useAuthState();
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState([]);

	useEffect(() => {
		const getData = async () => {
			try {
				const response = await axios.get('/storage', {
					headers: { Authorization: 'Bearer ' + token },
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
						<DataTable
							header={gridHeader}
							data={data}
						/>
					</Grid>
				</Grid>
			</Fade>
		</>
	);
};

export default Storage;

const gridHeader = [
	{
		field: 'drug',
		headerName: 'نوع دارو',
		width: 200,
		valueGetter: v =>
			v.value === 'Metadon'
				? 'متادون'
				: v.value === 'Opium'
				? 'اوپیوم'
				: 'B2',
	},
	,
	{
		field: 'quantity',
		headerName: 'موجودی',
		width: 200,
	},
];
