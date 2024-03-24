import { Save, Redo } from '@mui/icons-material';
import {
	Fade,
	Box,
	TextField,
	Select,
	MenuItem,
	Typography,
	Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useReducer, useEffect, useState } from 'react';
import { userReducer, userData } from '../services/data/newUser';
import LoadingOverlay from '../components/LoadingOverlay';
import { useNotify } from '../services/NotificationSystem';
import axios from 'axios';
import { useAuthState } from '../services/auth/AuthenticationSystem';

const NewUser = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const { token } = useAuthState();
	const [data, dispatch] = useReducer(userReducer, userData);
	const [canSend, setCanSend] = useState(false);
	const [submitData, setSubmitData] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (
			data.firstName.length !== 0 &&
			data.lastName.length !== 0 &&
			data.username.length !== 0 &&
			data.password.length !== 0 &&
			data.role !== 'none' &&
			data.state !== 'none'
		)
			setCanSend(true);
		else setCanSend(false);
	}, [data]);

	const handleSubmit = () => setSubmitData(true);

	useEffect(() => {
		if (!submitData) return;
		setIsLoading(true);

		const exec = async () => {
			try {
				const response = await axios.post(
					'/auth/user',
					{
						data: data,
					},
					{
						headers: {
							Authorization: 'Bearer ' + token,
						},
					}
				);
				if (response.status < 400) {
					notify({ msg: 'کاربر جدید به سیستم افزوده شد.' });
					navigate('/settings');
				}
			} catch (E) {
				if (E?.response?.status < 500)
					notify({
						msg: 'امکان ساخت کاربر وجود ندارد.',
						type: 'error',
					});
				else
					notify({
						msg: 'خطا در برقراری ارتباط با سرور',
						type: 'error',
					});

				setIsLoading(false);
				setSubmitData(false);
			}
		};

		exec();
	}, [submitData]);

	return (
		<>
			<LoadingOverlay open={isLoading} />
			<Fade
				in={true}
				unmountOnExit>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 4,
					}}>
					<Box
						sx={{
							display: 'flex',
							gap: 1,
							flexDirection: 'column',
						}}>
						<Typography variant='h4'>کاربر جدید</Typography>
						<TextField
							value={data.firstName}
							onChange={e =>
								dispatch({
									type: 'firstname',
									payload: e.target.value,
								})
							}
							size='small'
							label='نام'
							variant='outlined'
						/>
						<TextField
							value={data.lastName}
							onChange={e =>
								dispatch({
									type: 'lastname',
									payload: e.target.value,
								})
							}
							size='small'
							label='نام خانوادگی'
							variant='outlined'
						/>
						<TextField
							value={data.username}
							onChange={e =>
								dispatch({
									type: 'username',
									payload: e.target.value,
								})
							}
							size='small'
							label='نام کاربری'
							variant='outlined'
						/>
						<TextField
							value={data.password}
							onChange={e =>
								dispatch({
									type: 'password',
									payload: e.target.value,
								})
							}
							size='small'
							label='رمز عبور'
							variant='outlined'
							type='password'
						/>
						<Select
							value={data.role}
							onChange={e =>
								dispatch({
									type: 'role',
									payload: e.target.value,
								})
							}
							size='small'>
							<MenuItem value='none'>-- نقش --</MenuItem>
							<MenuItem value='Secretary'>منشی</MenuItem>
							<MenuItem value='Doctor'>دکتر</MenuItem>
						</Select>
						<Select
							value={data.state}
							onChange={e =>
								dispatch({
									type: 'state',
									payload: e.target.value,
								})
							}
							size='small'>
							<MenuItem value='none'> -- وضعیت -- </MenuItem>
							<MenuItem value='Active'>فعال</MenuItem>
							<MenuItem value='Suspended'>غیر فعال</MenuItem>
						</Select>
						<Button
							onClick={handleSubmit}
							disabled={!canSend}
							variant='contained'
							startIcon={<Save />}>
							ذخیره
						</Button>
						<Button
							onClick={() => navigate('/settings')}
							variant='outlined'
							startIcon={<Redo />}>
							بازگشت
						</Button>
					</Box>
				</Box>
			</Fade>
		</>
	);
};

export default NewUser;
