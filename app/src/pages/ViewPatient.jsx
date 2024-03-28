import {
	Grid,
	Typography,
	TextField,
	Button,
	ButtonGroup,
	Fade,
	Table,
	TableRow,
	TableCell,
	Box,
	Collapse,
	Select,
	MenuItem,
} from '@mui/material';
import { Edit, Redo, Delete, Add, Close, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useReducer, useRef, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import axios from 'axios';
import { useOkCancelDialog, useNotify } from '../services/NotificationSystem';
import { patientData, patientReducer } from '../services/data/newPatient';
import { useAuthState } from '../services/auth/AuthenticationSystem';
import { useParams } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { months } from '../data/calendar';

const ViewPatient = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const patientDataRef = useRef();
	const { token } = useAuthState();
	const { id } = useParams();
	const [data, dispatch] = useReducer(patientReducer, patientData);
	const [isEdit, setIsEdit] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [canSubmit, setCanSubmit] = useState(false);
	const [submitData, setSubmitData] = useState(false);
	const dialog = useOkCancelDialog();

	const handleGoEdit = () =>
		isEdit && !canSubmit
			? setIsEdit(false)
			: dialog({
					title: 'توجه',
					caption: isEdit
						? 'تغییرات انجام شده ذخیره نمیشود.'
						: 'اطلاعات بیمار ویرایش می شود.',
					onAccept: () => {
						if (isEdit)
							setTimeout(() => {
								dispatch({
									type: 'full',
									payload: patientDataRef.current,
								});
							}, 1000);
						setIsEdit(prev => !prev);
					},
			  });

	const handleSaveEdition = () =>
		dialog({
			title: 'توجه',
			caption: 'تغییرات انجام شده ذخیره می شود.',
			onAccept: () => setSubmitData(true),
		});

	const handleReturnBack = () => navigate('/patients');

	const handleAddAttachment = () =>
		isEdit
			? dialog({
					title: 'توجه',
					caption: 'تغییرات انجام شده ذخیره نمیشود.',
					onAccept: () => navigate(`/attachment/${id}/patient`),
			  })
			: navigate(`/attachment/${id}/patient`);

	useEffect(() => {
		const getData = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get('/patient/' + id, {
					headers: { Authorization: 'Bearer ' + token },
				});
				if (response.status < 400) {
					dispatch({ type: 'init', payload: response.data.data });
					patientDataRef.current = patientReducer(null, {
						type: 'init',
						payload: response.data.data,
					});
				}
			} catch (error) {
				notify({
					type: 'error',
					msg: 'خطا در برقراری ارتباط با سرور، اطلاعات بیمار دریافت نشد',
				});
			} finally {
				setIsLoading(false);
			}
		};
		getData();
	}, []);

	useEffect(() => {
		if (!submitData) return;
		const exec = async () => {
			try {
				setIsLoading(true);
				setSubmitData(false);
				const response = await axios.put('/patient', data, {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				});
				if (response.status < 400) {
					notify({
						msg: 'ویرایش اطلاعات بیمار انجام شد.',
					});
					setIsLoading(false);
					setIsEdit(false);
					patientDataRef.current = patientReducer(null, {
						type: 'full',
						payload: data,
					});
				}
			} catch (error) {
				notify({
					type: 'error',
					msg: 'خطا در برقراری ارتباط با سرور، ویرایش انجام نشد.',
				});
			} finally {
				setIsLoading(false);
			}
		};
		exec();
	}, [submitData]);

	useEffect(() => {
		if (!isEdit) return;

		if (
			data.firstName === patientDataRef.current.firstName &&
			data.lastName === patientDataRef.current.lastName &&
			data.phone === patientDataRef.current.phone &&
			data.landLine === patientDataRef.current.landLine &&
			data.address === patientDataRef.current.address &&
			data.gender === patientDataRef.current.gender &&
			data.by === patientDataRef.current.by &&
			data.bm === patientDataRef.current.bm &&
			data.bd === patientDataRef.current.bd
		)
			setCanSubmit(false);
		else setCanSubmit(true);
	}, [data]);

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
							justifyContent: 'space-between',
						}}>
						<Typography variant='h4'>مشخصات بیمار</Typography>
						<ButtonGroup>
							<Button
								onClick={handleGoEdit}
								variant='outlined'
								color={isEdit ? 'error' : 'primary'}
								startIcon={isEdit ? <Close /> : <Edit />}>
								{isEdit ? 'انصراف' : 'ویرایش'}
							</Button>
							{!isEdit ? (
								<>
									<Button
										variant='outlined'
										color='error'
										startIcon={<Delete />}>
										حذف
									</Button>
									<Button
										onClick={handleReturnBack}
										variant='outlined'
										startIcon={<Redo />}>
										بازگشت
									</Button>
								</>
							) : (
								<Button
									disabled={!canSubmit}
									variant='outlined'
									onClick={handleSaveEdition}
									startIcon={<Save />}>
									ذخیره
								</Button>
							)}
						</ButtonGroup>
					</Grid>
					<Grid
						item
						xs={5}
						sx={{ height: '70vh' }}>
						<Table
							size='small'
							sx={{
								'& td': {
									borderBottom: 0,
									height: '3rem',
								},
								'& tr>td:nth-of-type(1)': {
									width: '30%',
								},
							}}>
							<TableRow>
								<TableCell>
									<Typography
										fontWeight='bold'
										variant='body1'>
										شماره
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='body1'>
										{patientDataRef.current?.id}
									</Typography>
								</TableCell>
							</TableRow>
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
										{patientDataRef.current?.nationalID}
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
									<Collapse in={!isEdit}>
										<Typography variant='body1'>
											{patientDataRef.current?.firstName}
										</Typography>
									</Collapse>
									<Collapse in={isEdit}>
										<TextField
											size='small'
											variant='outlined'
											value={data.firstName}
											onChange={e =>
												dispatch({
													type: 'firstName',
													payload: e.target.value,
												})
											}
										/>
									</Collapse>
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
									<Collapse in={!isEdit}>
										<Typography variant='body1'>
											{patientDataRef.current?.lastName}
										</Typography>
									</Collapse>
									<Collapse in={isEdit}>
										<TextField
											size='small'
											variant='outlined'
											value={data.lastName}
											onChange={e =>
												dispatch({
													type: 'lastName',
													payload: e.target.value,
												})
											}
										/>
									</Collapse>
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
									<Collapse in={!isEdit}>
										<Typography variant='body1'>
											{patientDataRef.current?.gender ===
											'Male'
												? 'آقا'
												: 'خانم'}
										</Typography>
									</Collapse>
									<Collapse in={isEdit}>
										<Select
											size='small'
											value={data.gender}
											onChange={e =>
												dispatch({
													type: 'gender',
													payload: e.target.value,
												})
											}>
											<MenuItem value='Male'>
												آقا
											</MenuItem>
											<MenuItem value='Female'>
												خانم
											</MenuItem>
										</Select>
									</Collapse>
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
									<Collapse in={!isEdit}>
										<Typography variant='body1'>
											{patientDataRef.current?.by}/
											{patientDataRef.current?.bm}/
											{patientDataRef.current?.bd}
										</Typography>
									</Collapse>
									<Collapse in={isEdit}>
										<Box
											sx={{
												display: 'flex',
												gap: 1,
												alignItems: 'center',
											}}>
											<Select
												size='small'
												value={data.bd + ''}
												onChange={e =>
													dispatch({
														type: 'bd',
														payload: e.target.value,
													})
												}>
												{[...new Array(30)].map(
													(_, i) => (
														<MenuItem
															value={i + 1 + ''}
															key={i}>
															{i + 1}
														</MenuItem>
													)
												)}
											</Select>
											<Select
												size='small'
												value={data.bm + ''}
												onChange={e =>
													dispatch({
														type: 'bm',
														payload: e.target.value,
													})
												}>
												{months.map(m => (
													<MenuItem
														value={m.id + ''}
														key={m.id}>
														{m.name}
													</MenuItem>
												))}
											</Select>
											<Select
												size='small'
												value={data.by + ''}
												onChange={e =>
													dispatch({
														type: 'by',
														payload: e.target.value,
													})
												}>
												{[...new Array(100)].map(
													(_, i) => (
														<MenuItem
															value={
																i + 1300 + ''
															}
															key={i}>
															{i + 1300}
														</MenuItem>
													)
												)}
											</Select>
										</Box>
									</Collapse>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<Typography
										fontWeight='bold'
										variant='body1'>
										تلفن همراه
									</Typography>
								</TableCell>
								<TableCell>
									<Collapse in={!isEdit}>
										<Typography variant='body1'>
											{patientDataRef.current?.phone}
										</Typography>
									</Collapse>
									<Collapse in={isEdit}>
										<TextField
											size='small'
											variant='outlined'
											value={data.phone}
											onChange={e =>
												dispatch({
													type: 'phone',
													payload: e.target.value,
												})
											}
										/>
									</Collapse>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<Typography
										fontWeight='bold'
										variant='body1'>
										تلفن ثابت
									</Typography>
								</TableCell>
								<TableCell>
									<Collapse in={!isEdit}>
										<Typography variant='body1'>
											{patientDataRef.current?.landLine}
										</Typography>
									</Collapse>
									<Collapse in={isEdit}>
										<TextField
											size='small'
											variant='outlined'
											value={data.landLine}
											onChange={e =>
												dispatch({
													type: 'landLine',
													payload: e.target.value,
												})
											}
										/>
									</Collapse>
								</TableCell>
							</TableRow>
						</Table>
					</Grid>
					<Grid
						item
						xs={7}
						sx={{ height: '70vh' }}>
						<Table
							sx={{
								'& td': {
									borderBottom: 'none',
									height: '3rem',
								},
							}}>
							<TableRow>
								<TableCell>
									<Typography
										fontWeight='bold'
										variant='body1'>
										نشانی محل سکونت
									</Typography>
								</TableCell>
								<TableCell>
									<Collapse in={!isEdit}>
										<Typography variant='body1'>
											{patientDataRef.current?.address}
										</Typography>
									</Collapse>
									<Collapse in={isEdit}>
										<TextField
											fullWidth
											size='small'
											variant='outlined'
											value={data.address}
											onChange={e =>
												dispatch({
													type: 'address',
													payload: e.target.value,
												})
											}
										/>
									</Collapse>
								</TableCell>
							</TableRow>
						</Table>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								marginBottom: 2,
							}}>
							<Typography
								variant='h5'
								fontWeight='bold'>
								پیوست ها
							</Typography>
							<Button
								onClick={handleAddAttachment}
								startIcon={<Add />}
								variant='outlined'>
								افزودن
							</Button>
						</Box>
						<DataTable
							height='50vh'
							header={attachmentHeader}
							data={attachmentsData}
						/>
					</Grid>
				</Grid>
			</Fade>
		</>
	);
};

export default ViewPatient;

const attachmentHeader = [
	{
		field: 'id',
		headerName: 'شماره',
		width: 100,
	},
	{
		field: 'title',
		headerName: 'عنوان',
		width: 300,
	},
	{
		field: 'action',
		headerName: '',
		width: 200,
		sortable: false,
		renderCell: params => {
			return (
				<>
					<Button
						sx={{ mr: 1 }}
						variant='outlined'
						size='small'>
						مشاهده
					</Button>
					<Button
						color='error'
						variant='outlined'
						size='small'>
						حذف
					</Button>
				</>
			);
		},
	},
];

const attachmentsData = [
	{ id: 1, title: 'کارت ملی' },
	{ id: 2, title: 'شناسنامه' },
];
