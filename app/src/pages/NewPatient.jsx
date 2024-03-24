import { Save, Redo } from '@mui/icons-material';
import axios from 'axios';
import {
	Box,
	Typography,
	TextField,
	Select,
	MenuItem,
	Button,
	Fade,
	Grid,
	ButtonGroup,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { months } from '../data/calendar';
import LoadingOverlay from '../components/LoadingOverlay';
import { useNotify } from '../services/NotificationSystem';
import { useReducer, useEffect, useState } from 'react';
import { patientData, patientReducer } from '../services/data/newPatient';
import { useAuthState } from '../services/auth/AuthenticationSystem';

const NewPatient = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const { token } = useAuthState();
	const [data, dispatch] = useReducer(patientReducer, patientData);
	const [canSend, setCanSend] = useState(false);
	const [submitData, setSubmitData] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (
			data.firstName.length !== 0 &&
			data.lastName.length !== 0 &&
			data.address.length !== 0 &&
			data.phone.length === 11 &&
			data.landLine.length === 11 &&
			data.bd !== 0 &&
			data.by !== 0 &&
			data.bm !== 0 &&
			data.gender !== 'none' &&
			data.nationalID.length === 10
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
					'/patient',
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
					notify({ msg: 'بیمار جدید به سیستم افزوده شد.' });
					navigate('/patients');
				}
			} catch (E) {
				if (E?.response?.status < 500)
					notify({
						msg: 'امکان افزودن بیمار جدید وجود ندارد.',
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
				<Grid
					container
					spacing={4}>
					<Grid
						item
						xs={12}>
						<Typography variant='h4'>بیمار جدید</Typography>
					</Grid>
					<Grid
						sx={{
							display: 'flex',
							gap: 1,
							flexDirection: 'column',
							paddingRight: '14rem',
						}}
						item
						xs={6}>
						<TextField
							value={data.nationalID}
							onChange={e =>
								dispatch({
									type: 'nationalID',
									payload: e.target.value,
								})
							}
							size='small'
							label='شماره ملی'
							variant='outlined'
						/>
						<TextField
							value={data.firstName}
							onChange={e =>
								dispatch({
									type: 'firstName',
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
									type: 'lastName',
									payload: e.target.value,
								})
							}
							size='small'
							label='نام خانوادگی'
							variant='outlined'
						/>
						<Select
							value={data.gender}
							onChange={e =>
								dispatch({
									type: 'gender',
									payload: e.target.value,
								})
							}
							size='small'>
							<MenuItem value='none'> -- جنسیت -- </MenuItem>
							<MenuItem value='Male'>آقا</MenuItem>
							<MenuItem value='Female'>خانم</MenuItem>
						</Select>
						<Box
							sx={{
								marginTop: 2,
								marginBottom: 2,
								display: 'flex',
								gap: 1,
								alignItems: 'center',
								justifyContent: 'space-between',
							}}>
							<Typography variant='body2'>تاریخ تولد</Typography>
							<Select
								value={data.bd}
								onChange={e =>
									dispatch({
										type: 'bd',
										payload: e.target.value,
									})
								}
								size='small'
								style={{ width: 100 }}>
								<MenuItem value={0}>روز</MenuItem>
								{[...new Array(30)].map((_, i) => (
									<MenuItem
										value={i + 1}
										key={i}>
										{i + 1}
									</MenuItem>
								))}
							</Select>
							<Select
								value={data.bm}
								onChange={e =>
									dispatch({
										type: 'bm',
										payload: e.target.value,
									})
								}
								size='small'
								style={{ width: 100 }}>
								<MenuItem value={0}>ماه</MenuItem>
								{months.map(m => (
									<MenuItem
										value={m.id}
										key={m.id}>
										{m.name}
									</MenuItem>
								))}
							</Select>
							<Select
								value={data.by}
								onChange={e =>
									dispatch({
										type: 'by',
										payload: e.target.value,
									})
								}
								size='small'
								style={{ width: 100 }}>
								<MenuItem value={0}>سال</MenuItem>
								{[...new Array(60)].map((_, i) => (
									<MenuItem
										value={i + 1330}
										key={i}>
										{i + 1330}
									</MenuItem>
								))}
							</Select>
						</Box>
						<TextField
							value={data.phone}
							onChange={e =>
								dispatch({
									type: 'phone',
									payload: e.target.value,
								})
							}
							size='small'
							label='تلفن همراه'
							variant='outlined'
						/>
						<TextField
							value={data.landLine}
							onChange={e =>
								dispatch({
									type: 'landLine',
									payload: e.target.value,
								})
							}
							size='small'
							label='تلفن ثابت'
							variant='outlined'
						/>
					</Grid>
					<Grid
						sx={{
							display: 'flex',
							gap: 1,
							flexDirection: 'column',
						}}
						item
						xs={6}>
						<TextField
							value={data.address}
							onChange={e =>
								dispatch({
									type: 'address',
									payload: e.target.value,
								})
							}
							multiline
							rows={4}
							maxRows={4}
							size='small'
							label='نشانی محل سکونت'
							variant='outlined'
						/>
					</Grid>
					<Grid
						sx={{ display: 'flex', justifyContent: 'flex-end' }}
						item
						xs={12}>
						<ButtonGroup>
							<Button
								onClick={() => navigate('/patients')}
								variant='outlined'
								startIcon={<Redo />}>
								بازگشت
							</Button>
							<Button
								onClick={handleSubmit}
								disabled={!canSend}
								variant='contained'
								startIcon={<Save />}>
								ذخیره
							</Button>
						</ButtonGroup>
					</Grid>
				</Grid>
			</Fade>
		</>
	);
};

export default NewPatient;
