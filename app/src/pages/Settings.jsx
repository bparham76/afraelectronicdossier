import { Fade, Typography, Grid, Button, TextField, Box } from '@mui/material';
import { Add, Home, Save, Delete, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import LoadingOverlay from '../components/LoadingOverlay';
import axios from 'axios';
import { useState, useEffect, useRef, useReducer } from 'react';
import { useNotify, useOkCancelDialog } from '../services/NotificationSystem';
import { useAuthState } from '../services/auth/AuthenticationSystem';
import { storageReducer, storageData } from '../services/data/storage';
import EditUser from '../components/EditUser';

const Settings = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const showDialog = useOkCancelDialog();
	const [isUsersLoading, setIsUsersLoading] = useState(true);
	const [isStorageLoading, setIsStoragesLoading] = useState(true);
	const [usersData, setUsersData] = useState([]);
	const { token } = useAuthState();
	const capacityRef = useRef();
	const [capacity, dispatch] = useReducer(storageReducer, storageData);
	const [canUpdateStorage, setCanUpdateStorage] = useState(false);
	const [submitStorageData, setSubmitStorageData] = useState(false);
	const [editUser, setEditUser] = useState(-1);
	const [isUserDeleted, setIsUserDeleted] = useState(false);

	useEffect(() => {
		capacityRef.current = storageData;
	}, []);

	const handleShowEditUser = id =>
		showDialog({
			title: 'ویرایش کاربر',
			caption: 'آیا مایل به ویرایش کاربر هستید؟',
			onAccept: () =>
				setTimeout(() => {
					setEditUser(id);
				}, 200),
		});

	const handleDeleteUser = id =>
		showDialog({
			title: 'توجه',
			caption: `کاربر ${usersData.find(i => i.id === id).firstName} ${
				usersData.find(i => i.id === id).lastName
			} از سیستم حذف می شود.`,
			onAccept: async () => {
				try {
					setIsUsersLoading(true);
					const response = await axios.delete('/auth/user/' + id, {
						headers: {
							Authorization: 'Bearer ' + token,
						},
					});
					if (response.status < 400) {
						notify({
							msg: `${
								usersData.find(i => i.id === id).firstName
							} ${
								usersData.find(i => i.id === id).lastName
							} از سیستم حذف شد.`,
						});
						setUsersData(data => data.filter(i => i.id !== id));
					}
				} catch (error) {
					notify({
						type: 'error',
						msg: 'خطا در برقراری ارتباط با سرور. کاربر حذف نشد.',
					});
				} finally {
					setIsUsersLoading(false);
				}
			},
		});

	const handleEditUser = () =>
		showDialog({ title: '', caption: '', onAccept: () => {} });

	const handleCancelUpdateStorage = () =>
		showDialog({
			title: 'توجه',
			caption: 'تغییرات در ظرفیت پذیرش پرونده ثبت نمی شود',
			onAccept: () => {
				setSubmitStorageData(false);
				dispatch({ type: 'full', payload: capacityRef.current });
			},
		});

	const handleSubmitStorage = () =>
		showDialog({
			title: 'توجه',
			caption: 'تغییرات در ظرفیت پذیرش پرونده ثبت می شود',
			onAccept: () => {
				setSubmitStorageData(true);
				capacityRef.current = capacity;
			},
		});

	useEffect(() => {
		if (!isUsersLoading) return;

		const execUsers = async () => {
			try {
				const response = await axios.get('/auth/users', {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				});
				if (response.status < 400) {
					setUsersData(response.data.data);
				}
			} catch {
				notify({
					msg: 'خطا در برقراری ارتباط با سرور، فهرست کاربران دریافت نشد.',
					type: 'error',
				});
			} finally {
				setIsUsersLoading(false);
			}
		};

		execUsers();
	}, [isUsersLoading]);

	useEffect(() => {
		if (!isStorageLoading || submitStorageData) return;

		const execStorage = async () => {
			try {
				const response = await axios.get('/dossier/capacity', {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				});
				if (response.status < 400) {
					const B2 = response.data.data?.find(
						p => p.drug == 'b2'
					)?.cap;
					const Metadon = response.data.data?.find(
						p => p.drug == 'metadon'
					)?.cap;
					const Opium = response.data.data?.find(
						p => p.drug == 'opium'
					)?.cap;
					capacityRef.current = {
						Opium: Opium,
						Metadon: Metadon,
						B2: B2,
					};
					dispatch({ type: 'init', payload: response.data.data });
				}
			} catch {
				notify({
					msg: 'خطا در برقراری ارتباط با سرور، ظرفیت پرونده ها دریافت نشد.',
					type: 'error',
				});
			} finally {
				setIsStoragesLoading(false);
			}
		};

		execStorage();
	}, [isStorageLoading]);

	useEffect(() => {
		if (isStorageLoading) return;

		if (
			capacity.B2 === capacityRef.current.B2 &&
			capacity.Opium === capacityRef.current.Opium &&
			capacity.Metadon === capacityRef.current.Metadon
		)
			setCanUpdateStorage(false);
		else setCanUpdateStorage(true);
	}, [capacity]);

	useEffect(() => {
		if (!submitStorageData) return;

		const submitData = async () => {
			try {
				setIsStoragesLoading(true);
				const response = await axios.post(
					'/dossier/capacity',
					capacity,
					{
						headers: {
							Authorization: 'Bearer ' + token,
						},
					}
				);
				if (response.status < 400) {
					notify({
						msg: 'ظرفیت پذیرش با موفقیت به روز شد.',
					});
					setCanUpdateStorage(false);
				}
			} catch {
				notify({
					msg: 'خطا در برقراری ارتباط با سرور، بروز رسانی تنظیمات انجام نشد',
					type: 'error',
				});
			} finally {
				setIsStoragesLoading(false);
				setSubmitStorageData(false);
			}
		};

		submitData();
	}, [submitStorageData]);

	const gridHeader = [
		{
			field: 'firstName',
			headerName: 'نام',
			width: 100,
		},
		,
		{
			field: 'lastName',
			headerName: 'نام خانوادگی',
			width: 100,
		},
		{
			field: 'username',
			headerName: 'نام کاربری',
			width: 100,
		},
		{
			field: 'role',
			headerName: 'نقش',
			width: 100,
			valueGetter: v =>
				v.value === 'Doctor'
					? 'پزشک'
					: v.value === 'Secretary'
					? 'منشی'
					: 'پشتیبان',
		},
		{
			field: 'control',
			headerName: '',
			sortable: false,
			disableClickEventBubbling: true,
			width: 200,
			renderCell: params =>
				params.row.role !== 'SuperAdmin' && (
					<>
						<Button
							size='small'
							style={{ marginLeft: 2 }}
							variant='outlined'
							onClick={() => handleShowEditUser(params.row.id)}>
							<Edit />
						</Button>
						<Button
							size='small'
							variant='outlined'
							onClick={() => handleDeleteUser(params.row.id)}
							color='error'>
							<Delete />
						</Button>
					</>
				),
		},
	];

	return (
		<>
			<LoadingOverlay open={isUsersLoading || isStorageLoading} />
			<EditUser
				userId={editUser}
				onClose={() => setEditUser(-1)}
				onSubmit={handleEditUser}
				data={usersData.find(i => i.id === editUser)}
			/>
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
							تنظیمات
						</Typography>
						<Button
							onClick={() => navigate('/')}
							size='small'
							variant='outlined'
							startIcon={<Home />}>
							صفحه اصلی
						</Button>
					</Grid>
					<Grid
						item
						xs={6}>
						<Typography variant='h6'>ظرفیت پذیرش</Typography>
						<Grid
							mt={4}
							container
							gap={2}>
							<Grid
								sx={{
									display: 'flex',
									alignItems: 'center',
									paddingLeft: 2,
								}}
								item
								xs={4}>
								<Typography variant='body1'>
									تعداد پرونده متادون
								</Typography>
							</Grid>
							<Grid
								item
								xs={4}>
								<TextField
									value={capacity.Metadon}
									onChange={e =>
										dispatch({
											type: 'Metadon',
											payload: e.target.value,
										})
									}
									variant='outlined'
									size='small'
								/>
							</Grid>
							<Grid
								sx={{
									display: 'flex',
									alignItems: 'center',
									paddingLeft: 2,
								}}
								item
								xs={4}>
								<Typography variant='body1'>
									تعداد پرونده B2
								</Typography>
							</Grid>
							<Grid
								item
								xs={4}>
								<TextField
									value={capacity.B2}
									onChange={e =>
										dispatch({
											type: 'B2',
											payload: e.target.value,
										})
									}
									variant='outlined'
									size='small'
								/>
							</Grid>
							<Grid
								sx={{
									display: 'flex',
									alignItems: 'center',
									paddingLeft: 2,
								}}
								item
								xs={4}>
								<Typography variant='body1'>
									تعداد پرونده اوپیوم
								</Typography>
							</Grid>
							<Grid
								item
								xs={4}>
								<TextField
									value={capacity.Opium}
									onChange={e =>
										dispatch({
											type: 'Opium',
											payload: e.target.value,
										})
									}
									variant='outlined'
									size='small'
								/>
							</Grid>
							<Grid
								item
								xs={8}
								sx={{
									display: 'flex',
									justifyContent: 'flex-end',
									gap: 2,
								}}>
								{canUpdateStorage && (
									<Button
										onClick={handleCancelUpdateStorage}
										variant='outlined'
										size='small'
										color='error'>
										انصراف
									</Button>
								)}
								<Button
									// onClick={() => setSubmitStorageData(true)}
									onClick={handleSubmitStorage}
									disabled={!canUpdateStorage}
									size='small'
									variant='contained'
									startIcon={<Save />}>
									ذخیره سازی
								</Button>
							</Grid>
						</Grid>
					</Grid>
					<Grid
						item
						xs={6}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								marginBottom: 2,
							}}>
							<Typography variant='h6'>کاربران</Typography>
							<Button
								onClick={() => navigate('/settings/user/new')}
								size='small'
								startIcon={<Add />}
								variant='outlined'>
								کاربر جدید
							</Button>
						</Box>
						<DataTable
							header={gridHeader}
							data={usersData}
							height='50vh'
						/>
					</Grid>
				</Grid>
			</Fade>
		</>
	);
};

export default Settings;
