import { Fade, Typography, Grid, Button, TextField, Box } from '@mui/material';
import { Add, Home, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';

const Settings = () => {
	const navigate = useNavigate();

	const gridHeader = [
		{
			field: 'id',
			headerName: 'ردیف',
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
		},
	];

	return (
		<Fade
			in={true}
			unmountOnExit>
			<Grid
				container
				spacing={4}>
				<Grid
					item
					sx={{ display: 'flex', justifyContent: 'space-between' }}
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
						height='50vh'
					/>
				</Grid>
			</Grid>
		</Fade>
	);
};

export default Settings;
