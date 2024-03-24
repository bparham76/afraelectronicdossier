import { Fade, Typography, Grid, Button, TextField, Box } from '@mui/material';
import { Add, Home, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import LoadingOverlay from '../components/LoadingOverlay';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNotify, useOkCancelDialog } from '../services/NotificationSystem';
import { useAuthState } from '../services/auth/AuthenticationSystem';

const Settings = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const showDialog = useOkCancelDialog();
	const [isUsersLoading, setIsUsersLoading] = useState(true);
	const [usersData, setUsersData] = useState([]);
	const { token } = useAuthState();

	const handleShowUser = id =>
		showDialog({
			title: 'ویرایش کاربر',
			caption: 'آیا مایل به ویرایش کاربر هستید؟',
			onAccept: () => navigate('/settings/user/' + id),
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
				if (response.status < 300) {
					setUsersData(response.data.data);
				}
			} catch {
				notify({ msg: 'خطا در برقراری ارتباط با سرور', type: 'error' });
			} finally {
				setIsUsersLoading(false);
			}
		};

		execUsers();
	}, [isUsersLoading]);

	const gridHeader = [
		{
			field: 'id',
			headerName: 'شماره',
			width: 100,
		},
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
	];

	return (
		<>
			<LoadingOverlay open={isUsersLoading} />
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
									variant='outlined'
									size='small'
								/>
							</Grid>
							<Grid
								item
								xs={4}></Grid>
							<Grid
								item
								xs={4}
								sx={{
									display: 'flex',
									justifyContent: 'flex-end',
								}}>
								<Button
									disabled
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
							onRowClick={e => handleShowUser(e.id)}
						/>
					</Grid>
				</Grid>
			</Fade>
		</>
	);
};

export default Settings;
