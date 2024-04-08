import {
	Grid,
	Fade,
	Typography,
	ButtonGroup,
	Button,
	Box,
	Collapse,
	Table,
	TableRow,
	TableCell,
} from '@mui/material';
import { Redo, Print, Error, CheckCircle } from '@mui/icons-material';
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
import { useColorScheme } from '../components/Theme';

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
	const [isDark, toggleDark] = useColorScheme();
	const { token } = useAuthState();
	const params = useSearchParams();
	const year = parseInt(params[0].get('year'));
	const month = parseInt(params[0].get('month'));
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState({});
	const [reportType, setReportType] = useState('out');
	const [isBarChart, setIsBarChart] = useState(false);
	const [showSummary, setShowSummary] = useState(true);
	const [showChart, setShowChart] = useState(false);

	const handleToggleSummary = () => {
		if (showSummary) {
			setShowSummary(false);
			setTimeout(() => {
				setShowChart(true);
			}, 300);
		} else {
			setShowChart(false);
			setTimeout(() => {
				setShowSummary(true);
			}, 300);
		}
	};

	const handlePrint = () => {
		if (typeof window !== 'undefined') {
			if (isDark) {
				toggleDark();
				setTimeout(() => {
					window.print();
					toggleDark();
				}, 100);
			} else window.print();
		}
	};

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
							<Collapse in={showChart}>
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
									<Button
										style={{
											fontWeight: isBarChart && 'bold',
										}}
										onClick={() => setIsBarChart(true)}
										variant='outlined'>
										نمودار ستونی
									</Button>
									<Button
										style={{
											fontWeight: !isBarChart && 'bold',
										}}
										onClick={() => setIsBarChart(false)}
										variant='outlined'>
										نمودار خطی
									</Button>
								</ButtonGroup>
							</Collapse>
							<Button
								onClick={handleToggleSummary}
								variant='outlined'>
								{showSummary
									? 'نمایش نمودار'
									: 'نمایش صورت وضعیت'}
							</Button>
							<ButtonGroup>
								<Button
									onClick={handlePrint}
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
						item
						xs={12}>
						<Fade
							in={showChart}
							unmountOnExit>
							<Box
								sx={{
									height: '70vh',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}>
								<Chart
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
													(reportType === 'in'
														? ' ورود به انبار'
														: ' خروج از انبار') +
													(month
														? ` ${
																months?.find(
																	m =>
																		m.id ===
																		month
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
														? data?.stats?.out
																?.Metadon
														: data?.stats?.in
																?.Metadon,
												backgroundColor: 'red',
											},
											{
												id: 1,
												label: 'اوپیوم',
												data:
													reportType === 'out'
														? data?.stats?.out
																?.Opium
														: data?.stats?.in
																?.Opium,
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
							</Box>
						</Fade>
						<Fade
							in={showSummary}
							unmountOnExit>
							<Box
								sx={{
									marginTop: 4,
									height: '70vh',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'start',
									flexDirection: 'column',
									gap: 2,
								}}>
								<Typography
									variant='h5'
									fontWeight='bold'>
									{'خلاصه وضعیت' +
										(month
											? ` ${
													months?.find(
														m => m.id === month
													)?.name
											  } ماه`
											: '') +
										' سال ' +
										year}
								</Typography>
								<Table
									style={{
										width: '40vw',
									}}>
									<TableRow>
										<TableCell
											style={{
												fontWeight: 'bold',
											}}>
											نوع دارو
										</TableCell>
										<TableCell
											style={{ fontWeight: 'bold' }}>
											ورود به انبار
										</TableCell>
										<TableCell
											style={{ fontWeight: 'bold' }}>
											خروج از انبار
										</TableCell>
										<TableCell
											style={{ fontWeight: 'bold' }}>
											وضعیت
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>بوپرو</TableCell>
										<TableCell>
											{data?.aggregate?.in?.B2}
										</TableCell>
										<TableCell>
											{data?.aggregate?.out?.B2}
										</TableCell>
										<TableCell>
											{data?.aggregate?.in?.B2 ===
											data?.aggregate?.out?.B2 ? (
												<CheckCircle />
											) : (
												<Error />
											)}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>متادون</TableCell>
										<TableCell>
											{data?.aggregate?.in?.Metadon}
										</TableCell>
										<TableCell>
											{data?.aggregate?.out?.Metadon}
										</TableCell>
										<TableCell>
											{data?.aggregate?.in?.Metadon ===
											data?.aggregate?.out?.Metadon ? (
												<CheckCircle />
											) : (
												<Error />
											)}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>اوپیوم</TableCell>
										<TableCell>
											{data?.aggregate?.in?.Opium}
										</TableCell>
										<TableCell>
											{data?.aggregate?.out?.Opium}
										</TableCell>
										<TableCell>
											{data?.aggregate?.in?.Opium ===
											data?.aggregate?.out?.Opium ? (
												<CheckCircle />
											) : (
												<Error />
											)}
										</TableCell>
									</TableRow>
								</Table>
							</Box>
						</Fade>
					</Grid>
					{/* <Grid
						sx={{
							height: '70vh',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						item
						xs={12}>
					</Grid> */}
				</Grid>
			</Fade>
		</>
	);
};

export default ViewReportChart;
