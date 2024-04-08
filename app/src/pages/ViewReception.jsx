import {
	Fade,
	Grid,
	Button,
	ButtonGroup,
	Typography,
	Table,
	TableRow,
	TableCell,
} from '@mui/material';
import { Redo, Delete } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams, useSearchParams } from 'react-router-dom';
import { useNotify, useOkCancelDialog } from '../services/NotificationSystem';
import { useAuthState } from '../services/auth/AuthenticationSystem';
import LoadingOverlay from '../components/LoadingOverlay';

const ViewReception = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const notify = useNotify();
	const dialog = useOkCancelDialog();
	const { token } = useAuthState();
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState(null);
	const searchParams = useSearchParams()[0];

	const handleDelete = () =>
		dialog({
			title: 'توجه',
			caption: 'رکورد مراجعه بیمار از سیستم حذف می شود.',
			onAccept: () =>
				setTimeout(
					() =>
						dialog({
							title: 'توجه',
							caption:
								'حذف رکورد مراجعه بر گزارش مصرف دارو و گزارش انبار تاثیرگذار خواهد بود.',
							onAccept: async () => {
								try {
									setIsLoading(true);
									const response = await axios.delete(
										'/reception/' + id,
										{
											headers: {
												Authorization:
													'Bearer ' + token,
											},
										}
									);
									if (response.status < 400) {
										notify({
											msg: 'رکورد مراجعه با موفقیت حذف شد.',
										});
										handleReturn();
									}
								} catch (error) {
									notify({
										type: 'error',
										msg: 'خطا در برقراری ارتباط با سرور.',
									});
								} finally {
									setIsLoading(false);
								}
							},
						}),
					200
				),
		});

	const handleReturn = () =>
		navigate(
			searchParams.get('d_id')
				? '/dossier/' + searchParams.get('d_id')
				: '/receptions'
		);

	useEffect(() => {
		const getData = async () => {
			try {
				const response = await axios.get('/reception/o/' + id, {
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
			<Fade
				in={true}
				unmountOnExit>
				<Grid
					container
					spacing={4}>
					<Grid
						item
						xs={12}
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}>
						<Typography variant='h4'>
							مشاهده اطلاعات مراجعه بیمار
						</Typography>
						<ButtonGroup>
							<Button
								onClick={handleDelete}
								color='error'
								variant='outlined'
								startIcon={<Delete />}>
								حذف
							</Button>
							<Button
								onClick={handleReturn}
								variant='outlined'
								startIcon={<Redo />}>
								بازگشت
							</Button>
						</ButtonGroup>
					</Grid>
					<Grid
						item
						xs={4}>
						<Table
							size='small'
							sx={{
								'& td': {
									borderBottom: 0,
								},
								'& tr>td:nth-of-type(1)': {
									width: '50%',
								},
							}}>
							<TableRow>
								<TableCell>
									<Typography
										fontWeight='bold'
										variant='body1'>
										شماره پرونده
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='body1'>
										{data?.dossier?.dossierNumber}
									</Typography>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<Typography
										fontWeight='bold'
										variant='body1'>
										نام و نام خانوادگی
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='body1'>
										{data?.dossier?.patient?.firstName +
											' ' +
											data?.dossier?.patient?.lastName}
									</Typography>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<Typography
										fontWeight='bold'
										variant='body1'>
										تاریخ
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='body1'>
										{data?.datetime}
									</Typography>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<Typography
										fontWeight='bold'
										variant='body1'>
										نوع دارو
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='body1'>
										{(() => {
											switch (data?.dossier?.drugType) {
												case 'Opium':
													return 'اوپیوم';
												case 'Metadon':
													return 'متادون';
												case 'B2':
													return 'بوپرو';
												default:
													return '';
											}
										}).call()}
									</Typography>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<Typography
										fontWeight='bold'
										variant='body1'>
										مقدار تحویل شده
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='body1'>
										{data?.drugDose}
									</Typography>
								</TableCell>
							</TableRow>
						</Table>
					</Grid>
					<Grid
						item
						xs={8}>
						<Table
							size='small'
							sx={{
								'& td': {
									borderBottom: 0,
								},
							}}>
							<TableRow>
								<TableCell
									style={{
										display: 'flex',
										alignItems: 'start',
									}}>
									<Typography
										fontWeight='bold'
										variant='body1'>
										توضیحات
									</Typography>
								</TableCell>
								<TableCell>
									<Typography
										variant='body1'
										style={{
											width: '100%',
											height: '60vh',
											overflowY: 'scroll',
										}}>
										{data?.description}
									</Typography>
								</TableCell>
							</TableRow>
						</Table>
					</Grid>
				</Grid>
			</Fade>
		</>
	);
};

export default ViewReception;
