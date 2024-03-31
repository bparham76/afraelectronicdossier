import {
	Grid,
	Button,
	ButtonGroup,
	Typography,
	Fade,
	Box,
	Table,
	TableRow,
	TableCell,
} from '@mui/material';
import {
	Delete,
	Edit,
	Redo,
	Visibility,
	Add,
	GetApp,
	DoneAll,
	RemoveDone,
} from '@mui/icons-material';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { useState, useEffect, useRef } from 'react';
import { useAuthState } from '../services/auth/AuthenticationSystem';
import { useNotify, useOkCancelDialog } from '../services/NotificationSystem';
import ViewAttachment from '../components/ViewAttachment';
import LoadingOverlay from '../components/LoadingOverlay';
import axios from 'axios';

const ViewDossier = () => {
	const navigate = useNavigate();
	const params = useSearchParams();
	const { id } = useParams();
	const notify = useNotify();
	const dialog = useOkCancelDialog();
	const { token } = useAuthState();
	const [data, setData] = useState(null);
	const dataRef = useRef();
	const [isLoading, setIsLoading] = useState(true);
	const [dossierState, setDossierState] = useState(true);
	const [canSubmit, setCanSubmit] = useState(false);
	const [submitData, setSubmitData] = useState(false);
	const [showFile, setShowFile] = useState(-1);

	const isQueue = params[0].get('queue') !== null;

	const receptionsHeader = [
		{
			field: 'datetime',
			headerName: 'تاریخ',
			width: 100,
		},
		{
			field: 'drugDose',
			headerName: 'مقدار تجویز',
			width: 100,
		},
		{
			field: 'control',
			headerName: '',
			width: 100,
			sortable: false,
			disableClickEventBubbling: true,
			renderCell: params => (
				<>
					<Button
						size='small'
						variant='outlined'
						color='error'>
						<Delete />
					</Button>
				</>
			),
		},
	];

	const attachmentsHeader = [
		{
			field: 'title',
			headerName: 'عنوان',
			width: 150,
		},
		{
			field: 'control',
			headerName: '',
			sortable: false,
			disableClickEventBubbling: true,
			width: 150,
			renderCell: params => (
				<>
					<Button
						onClick={() => setShowFile(params.row.id)}
						sx={{ marginRight: 1 }}
						variant='outlined'
						size='small'>
						<Visibility />
					</Button>
					<Button
						onClick={() =>
							handleDeleteAttachment(
								params.row.id,
								params.row.title
							)
						}
						variant='outlined'
						color='error'
						size='small'>
						<Delete />
					</Button>
				</>
			),
		},
	];

	const handleAddReception = () =>
		navigate('/reception/new?dossier_id=' + id);

	const handleAddAttachment = () =>
		navigate('/attachment/' + id + '/dossier');

	const handleDossierState = () => setDossierState(prev => !prev);

	const handleDeleteAttachment = (a_id, a_title) =>
		dialog({
			title: 'توجه',
			caption: `پیوست با عنوان "${a_title}" حذف می شود.`,
			onAccept: async () => {
				try {
					setIsLoading(true);
					const response = await axios.delete('/attachment/' + a_id, {
						headers: {
							Authorization: 'Bearer ' + token,
						},
					});
					if (response.status < 400) {
						setData(data => ({
							...data,
							attachments: data.attachments.filter(
								d => d.id !== a_id
							),
						}));
						notify({ msg: 'پیوست با موفقیت حذف شد.' });
					}
				} catch {
					notify({
						type: 'error',
						msg: 'عدم برقراری ارتباط با سرور، پیوست حذف نشد.',
					});
				} finally {
					setIsLoading(false);
				}
			},
		});

	useEffect(() => {
		if (!isLoading) return;

		const getData = async () => {
			try {
				const response = await axios.get('dossier/g/' + id, {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				});
				if (response.status < 400) {
					setData(response.data.data);
					dataRef.current = response.data.data;
				}
			} catch (error) {
				notify({
					type: 'error',
					msg: 'خطا در برقراری ارتباط با سرور. اطلاعات پرونده دریافت نشد.',
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
			<ViewAttachment
				open={showFile > 0}
				file={
					data?.attachments?.find(d => d.id === showFile)?.fileAddress
				}
				onClose={() => setShowFile(-1)}
			/>
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
							width='auto'
							variant='h4'>
							مشاهده جزئیات پرونده
							{isQueue && ' در صف'}
						</Typography>
						<ButtonGroup>
							{!isQueue ? (
								<>
									<Button
										onClick={handleDossierState}
										variant='outlined'
										startIcon={
											dossierState ? (
												<RemoveDone />
											) : (
												<DoneAll />
											)
										}>
										{dossierState
											? 'غیرفعال سازی'
											: 'فعال سازی'}
									</Button>
									<Button
										variant='outlined'
										color='error'
										startIcon={<Delete />}>
										حذف
									</Button>
								</>
							) : (
								<Button
									variant='outlined'
									startIcon={<GetApp />}>
									تشکیل
								</Button>
							)}
							<Button
								onClick={() =>
									navigate(
										isQueue
											? '/dossiers/queue'
											: '/dossiers'
									)
								}
								variant='outlined'
								startIcon={<Redo />}>
								بازگشت
							</Button>
						</ButtonGroup>
					</Grid>
					<Grid
						item
						xs={4}>
						<Typography
							variant='h6'
							mb={1}>
							مشخصات بیمار
						</Typography>
						<Table
							size='small'
							sx={{
								'& td': {
									borderBottom: 0,
									// height: '3rem',
								},
								'& tr>td:nth-of-type(1)': {
									width: '40%',
								},
							}}>
							{!isQueue && (
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
											{dataRef.current?.dossierNumber}
										</Typography>
									</TableCell>
								</TableRow>
							)}
							<TableRow>
								<TableCell>
									<Typography
										fontWeight='bold'
										variant='body1'>
										شماره ملی
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='body1'>
										{dataRef.current?.patient?.nationalID}
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
											switch (dataRef.current?.drugType) {
												case 'B2':
													return 'B2';
												case 'Opium':
													return 'اوپیوم';
												case 'Metadon':
													return 'متادون';
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
										نام
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='body1'>
										{dataRef.current?.patient?.firstName}
									</Typography>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<Typography
										fontWeight='bold'
										variant='body1'>
										نام خانوادگی
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='body1'>
										{dataRef.current?.patient?.lastName}
									</Typography>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<Typography
										fontWeight='bold'
										variant='body1'>
										جنسیت
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='body1'>
										{dataRef.current?.patient?.gender ===
										'Male'
											? 'آقا'
											: 'خانم'}
									</Typography>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<Typography
										fontWeight='bold'
										variant='body1'>
										تاریخ تولد
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='body1'>
										{dataRef.current?.patient?.birthDate}
									</Typography>
								</TableCell>
							</TableRow>
						</Table>
					</Grid>
					{!isQueue && (
						<>
							<Grid
								item
								xs={4}>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										mb: 1,
									}}>
									<Typography
										variant='h6'
										mb={1}>
										پیوست ها
									</Typography>
									<Button
										onClick={handleAddAttachment}
										size='small'
										variant='outlined'
										startIcon={<Add />}>
										افزودن
									</Button>
								</Box>
								<DataTable
									height='60vh'
									header={attachmentsHeader}
									data={data?.attachments}
								/>
							</Grid>
							<Grid
								item
								xs={4}>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										mb: 1,
									}}>
									<Typography
										variant='h6'
										mb={1}>
										مراجعات بیمار
									</Typography>
									<Button
										onClick={handleAddReception}
										size='small'
										variant='outlined'
										startIcon={<Add />}>
										افزودن
									</Button>
								</Box>
								<DataTable
									height='60vh'
									header={receptionsHeader}
									data={data?.records}
								/>
							</Grid>
						</>
					)}
				</Grid>
			</Fade>
		</>
	);
};

export default ViewDossier;
