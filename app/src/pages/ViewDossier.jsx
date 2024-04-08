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
	Dialog,
	DialogActions,
	DialogTitle,
	TextField,
	DialogContent,
} from '@mui/material';
import {
	Delete,
	Redo,
	Visibility,
	Add,
	GetApp,
	DoneAll,
	RemoveDone,
	Save,
	Launch,
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
	const [deleteDossier, setDeleteDossier] = useState(false);
	const [submitData, setSubmitData] = useState(false);
	const [showFile, setShowFile] = useState(-1);
	const [dossierNumber, setDossierNumber] = useState('-1');
	const [submitDossierNumber, setSubmitDossierNumber] = useState(false);

	const isQueue = params[0].get('queue') !== null;
	const canCreate = params[0].get('can') !== null;

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
						onClick={e => {
							e.stopPropagation();
							handleDeleteRecord(
								params.row.datetime,
								params.row.id
							);
						}}
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

	const handleDossierState = () =>
		dialog({
			title: 'توجه',
			caption: `پرونده ${dossierState ? 'غیر فعال' : 'فعال'} می شود ${
				dossierState
					? ' و امکان ثبت پیوست و مراجعات جدید در آن وجود نخواهد داشت.'
					: '. در صورتی که بیمار پرونده ی فعال دیگری داشته باشد، آن پرونده غیرفعال خواهد گردید.'
			}`,
			onAccept: () => setSubmitData(true),
		});

	const handleDeleteDossier = () =>
		dialog({
			title: 'توجه',
			caption: 'پرونده از سیستم حذف خواهد شد.',
			onAccept: () =>
				setTimeout(() => {
					dialog({
						title: 'توجه',
						caption:
							'تمامی پیوست ها و مراجعات مربوط به پرونده بصورت بی بازگشت حذف خواهند شد.',
						onAccept: () =>
							setTimeout(() => {
								dialog({
									title: 'توجه',
									caption:
										'پس از حذف اطلاعات، امکان بازیابی آنها وجود نخواهد داشت.',
									onAccept: () => setDeleteDossier(true),
								});
							}, [200]),
					});
				}, [200]),
		});

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

	const handleRecordRowClick = params =>
		navigate('/reception/' + params.row.id + '?d_id=' + id);

	const handleDeleteRecord = (r_date, r_id) =>
		dialog({
			title: 'توجه',
			caption: `مراجعه با تاریخ ${r_date} حذف می شود.`,
			onAccept: () =>
				setTimeout(
					() =>
						dialog({
							title: 'توجه',
							caption:
								'حذف رکورد ها روی سیستم گزارش مصرف دارو تاثیرگذار خواهد بود.',
							onAccept: async () => {
								try {
									setIsLoading(true);
									const response = await axios.delete(
										'/reception/' + r_id,
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
										setData(prev => ({
											...prev,
											records: prev.records.filter(
												item => item.id !== r_id
											),
										}));
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
					150
				),
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
					setDossierState(response.data.data.state === 'Active');
					setDossierNumber(response.data.data.dossierNumber);
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

	useEffect(() => {
		if (!submitData) return;
		setSubmitData(false);
		const exec = async () => {
			try {
				setIsLoading(true);
				const response = await axios.put(
					`/dossier/u/${id}/${dossierState ? 'deactive' : 'active'}/${
						data.patient.id
					}`,
					null,
					{
						headers: {
							Authorization: 'Bearer ' + token,
						},
					}
				);
				if (response.status < 400) {
					notify({ msg: 'وضعیت پرونده با موفقیت تغییر یافت.' });
					setDossierState(prev => !prev);
				}
			} catch (error) {
				notify({ msg: 'خطا در برقراری ارتباط با سرور', type: 'error' });
			} finally {
				setIsLoading(false);
			}
		};
		exec();
	}, [submitData]);

	useEffect(() => {
		if (!deleteDossier) return;
		const exec = async () => {
			try {
				const response = await axios.delete('/dossier/' + id, {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				});
				if (response.status < 400) {
					notify({
						msg: 'پرونده و پیوست ها با موفقیت از سیستم حذف شدند.',
					});
					navigate('/dossiers');
				}
			} catch (error) {
				notify({
					type: 'error',
					msg: 'خطا در برقراری ارتباط با سرور. پرونده حذف نشد.',
				});
			} finally {
				setIsLoading(false);
			}
		};
		exec();
	}, [deleteDossier]);

	useEffect(() => {
		if (!submitDossierNumber) return;
		const exec = async () => {
			try {
				const response = await axios.put(
					'/dossier/u/' + id,
					{ dossierNumber: dossierNumber },
					{ headers: { Authorization: 'Bearer ' + token } }
				);
				if (response.status < 400) {
					notify({ msg: 'شماره پرونده با موفقیت درج شد.' });
					setData(data => ({
						...data,
						dossierNumber: dossierNumber,
					}));
					dataRef.current.dossierNumber = dossierNumber;
				}
			} catch (error) {
				notify({
					type: 'error',
					msg: 'خطا در برقراری ارتباط با سرور. شماره پرونده درج نشد.',
				});
			} finally {
				setIsLoading(false);
			}
		};
		exec();
	}, [submitDossierNumber]);

	return (
		<>
			<Dialog
				open={dataRef.current?.dossierNumber === null}
				slotProps={{
					backdrop: {
						sx: {
							backdropFilter: 'blur(3px)',
						},
					},
				}}>
				<DialogTitle> شماره پرونده را وارد کنید:</DialogTitle>
				<DialogContent>
					<TextField
						sx={{ marginTop: 1 }}
						label='شماره پرونده'
						value={dossierNumber || ''}
						onChange={e =>
							setDossierNumber(prev =>
								/^[0-9]{0,16}$/.test(e.target.value)
									? e.target.value
									: prev
							)
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => navigate('/dossiers')}
						startIcon={<Redo />}>
						بازگشت
					</Button>
					<Button
						disabled={dossierNumber?.length === 0}
						onClick={() =>
							dialog({
								title: 'توجه',
								caption:
									'پس از درج در سیستم، شماره پرونده قابل تغییر نخواهد بود.',
								onAccept: () => setSubmitDossierNumber(true),
							})
						}
						startIcon={<Save />}>
						ذخیره
					</Button>
				</DialogActions>
			</Dialog>
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
								</>
							) : (
								<>
									{canCreate && (
										<Button
											variant='outlined'
											startIcon={<GetApp />}>
											تشکیل
										</Button>
									)}
								</>
							)}
							<Button
								onClick={handleDeleteDossier}
								variant='outlined'
								color='error'
								startIcon={<Delete />}>
								حذف
							</Button>
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
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1,
								marginBottom: 1,
							}}>
							<Typography variant='h6'>مشخصات بیمار</Typography>
							<Button
								onClick={() =>
									navigate(
										'/patient/' +
											data.patientId +
											'?d_ref=' +
											id
									)
								}>
								<Launch />
							</Button>
						</Box>
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
													return 'بوپرو';
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
									{dossierState && (
										<Button
											onClick={handleAddAttachment}
											size='small'
											variant='outlined'
											startIcon={<Add />}>
											افزودن
										</Button>
									)}
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
									{dossierState && (
										<Button
											onClick={handleAddReception}
											size='small'
											variant='outlined'
											startIcon={<Add />}>
											افزودن
										</Button>
									)}
								</Box>
								<DataTable
									height='60vh'
									header={receptionsHeader}
									data={data?.records}
									onRowClick={handleRecordRowClick}
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
