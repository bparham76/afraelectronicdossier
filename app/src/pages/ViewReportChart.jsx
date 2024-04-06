import {
	Grid,
	Fade,
	Typography,
	ButtonGroup,
	Button,
	Box,
} from '@mui/material';
import { Redo, Print } from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Chart } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	LineController,
	LineElement,
	BarElement,
	PointElement,
	Title,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { months } from '../data/calendar';
import { useAuthState } from '../services/auth/AuthenticationSystem';
import axios from 'axios';
import LoadingOverlay from '../components/LoadingOverlay';
import { useNotify } from '../services/NotificationSystem';

ChartJS.register(
	LineController,
	LineElement,
	BarElement,
	PointElement,
	LinearScale,
	Title,
	CategoryScale,
	Tooltip,
	Legend
);

const ViewReportChart = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const { token } = useAuthState();
	const params = useSearchParams();
	const year = parseInt(params[0].get('year'));
	const month = parseInt(params[0].get('month'));
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState({});
	const [reportType, setReportType] = useState('in');
	const [isBarChart, setIsBarChart] = useState(false);

	useEffect(() => {
		if (!isLoading) return;
		const getData = async () => {
			try {
				const response = await axios.get(
					month
						? '/report/monthly/' + year + '/' + month
						: '/report/annual/' + year,
					{
						headers: {
							Authorization: 'Bearer ' + token,
						},
					}
				);
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
	}, [isLoading]);

	return (
		<>
			<LoadingOverlay open={isLoading} />
			<Fade
				in={true}
				unmountOnExit>
				<Grid container>
					<Grid
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: 4,
						}}
						className='print_hide'
						item
						xs={12}>
						<Typography variant='h4'>گزارش انبار</Typography>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'end',
								gap: 1,
							}}>
							<ButtonGroup>
								<Button
									style={{
										fontWeight:
											reportType === 'in' && 'bold',
									}}
									onClick={() => setReportType('in')}
									variant='outlined'>
									ورود به انبار
								</Button>
								<Button
									style={{
										fontWeight:
											reportType === 'out' && 'bold',
									}}
									onClick={() => setReportType('out')}
									variant='outlined'>
									خروج از انبار
								</Button>
							</ButtonGroup>
							<ButtonGroup>
								<Button
									style={{
										fontWeight: !isBarChart && 'bold',
									}}
									onClick={() => setIsBarChart(false)}
									variant='outlined'>
									نمودار خطی
								</Button>
								<Button
									style={{ fontWeight: isBarChart && 'bold' }}
									onClick={() => setIsBarChart(true)}
									variant='outlined'>
									نمودار ستونی
								</Button>
							</ButtonGroup>
							<ButtonGroup>
								<Button
									onClick={() => window && window?.print()}
									startIcon={<Print />}>
									چاپ گزارش
								</Button>
								<Button
									onClick={() => navigate('/storage/report')}
									startIcon={<Redo />}>
									بازگشت
								</Button>
							</ButtonGroup>
						</Box>
					</Grid>
					<Grid
						sx={{
							height: '70vh',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						item
						xs={12}>
						<Chart
							redraw
							style={{ backgroundColor: 'white' }}
							options={{
								interaction: {
									mode: 'index',
									intersect: false,
								},
								scales: {
									x: {
										ticks: {
											font: {
												family: 'Yekan Bakh FaNum',
												size: 16,
											},
										},
									},
									y: {
										ticks: {
											font: {
												family: 'Yekan Bakh FaNum',
												size: 16,
											},
										},
									},
								},
								plugins: {
									subtitle: {
										font: {
											family: 'Yekan Bakh FaNum',
										},
									},
									tooltip: {
										enabled: true,
										position: 'nearest',
										labels: {
											font: {
												family: 'Yekan Bakh FaNum',
											},
										},
									},
									legend: {
										position: 'bottom',
										title: 'راهنما',
										labels: {
											font: {
												family: 'Yekan Bakh FaNum',
											},
										},
									},
									title: {
										display: true,
										text:
											'گزارش' +
											(month
												? ` ${
														months?.find(
															m => m.id === month
														)?.name
												  } ماه`
												: '') +
											' سال ' +
											year,
										font: {
											family: 'Yekan Bakh FaNum',
											size: 16,
										},
									},
								},
							}}
							type={isBarChart ? 'bar' : 'line'}
							data={{
								labels: month
									? Array(31)
											.fill(0)
											.map((_, i) => i + 1)
									: months.map(m => m.name),
								datasets: [
									{
										id: 1,
										label: 'متادون',
										data:
											reportType === 'out'
												? data?.stats?.out?.Metadon
												: data?.stats?.in?.Metadon,
										backgroundColor: 'red',
									},
									{
										id: 1,
										label: 'اوپیوم',
										data:
											reportType === 'out'
												? data?.stats?.out?.Opium
												: data?.stats?.in?.Opium,
										backgroundColor: 'blue',
									},
									{
										id: 1,
										label: 'بوپرو',
										data:
											reportType === 'out'
												? data?.stats?.out?.B2
												: data?.stats?.in?.B2,
										backgroundColor: 'cyan',
									},
								],
							}}
						/>
					</Grid>
				</Grid>
			</Fade>
		</>
	);
};

export default ViewReportChart;
