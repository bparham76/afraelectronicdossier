import {
	Fade,
	Box,
	Button,
	TextField,
	Typography,
	Select,
	MenuItem,
} from '@mui/material';
import { Save, Redo } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { months } from '../data/calendar';
import LoadingOverlay from '../components/LoadingOverlay';
import { useNotify, useOkCancelDialog } from '../services/NotificationSystem';
import { useAuthState } from '../services/auth/AuthenticationSystem';
import axios from 'axios';
import { useState, useEffect, useReducer } from 'react';
import { newStorageData, newStorageReducer } from '../services/data/newStorage';

const ShipmentEntry = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const dialog = useOkCancelDialog();
	const { token } = useAuthState();
	const [data, dispatch] = useReducer(newStorageReducer, newStorageData);
	const [isLoading, setIsLoading] = useState(false);
	const [canSubmit, setCanSubmit] = useState(false);

	useEffect(() => {
		if (
			(data.B2 > 0 || data.Metadon > 0 || data.Opium > 0) &&
			data.year > 0 &&
			data.month > 0 &&
			data.day > 0
		)
			setCanSubmit(true);
		else setCanSubmit(false);
	}, [data]);

	const handleSubmit = () =>
		dialog({
			title: 'توجه',
			caption: 'ورود دارو به انبار در سیستم ثبت می شود.',
			onAccept: async () => {
				try {
					setIsLoading(true);
					const response = await axios.post('/storage', data, {
						headers: {
							Authorization: 'Bearer ' + token,
						},
					});
					if (response.status < 400) {
						notify({
							msg: 'ورود دارو به انبار با موفقیت در سیستم ثبت شد.',
						});
						navigate('/storage');
					}
				} catch (error) {
					notify({
						type: 'error',
						msg: 'خطا در برقراری ارتباط با سرور. ورودی به انبار ثبت نشد.',
					});
				} finally {
					setIsLoading(false);
				}
			},
		});

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
						marginTop: 2,
					}}>
					<Box
						sx={{
							display: 'flex',
							gap: 1,
							flexDirection: 'column',
						}}>
						<Typography variant='h4'>ورودی به انبار</Typography>
						<Box
							sx={{
								marginTop: 2,
								marginBottom: 2,
								display: 'flex',
								gap: 2,
								alignItems: 'center',
								justifyContent: 'space-between',
							}}>
							<Typography variant='body2'>تاریخ</Typography>
							<Select
								size='small'
								style={{ width: 100 }}
								value={data.day}
								onChange={e =>
									dispatch({
										type: 'day',
										payload: e.target.value,
									})
								}>
								<MenuItem value={0}>روز</MenuItem>
								{[...new Array(31)].map((_, i) => (
									<MenuItem
										value={i + 1}
										key={i}>
										{i + 1}
									</MenuItem>
								))}
							</Select>
							<Select
								size='small'
								style={{ width: 100 }}
								value={data.month}
								onChange={e =>
									dispatch({
										type: 'month',
										payload: e.target.value,
									})
								}>
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
								size='small'
								style={{ width: 100 }}
								value={data.year}
								onChange={e =>
									dispatch({
										type: 'year',
										payload: e.target.value,
									})
								}>
								<MenuItem value={0}>سال</MenuItem>
								{[...new Array(50)].map((_, i) => (
									<MenuItem
										value={i + 1390}
										key={i}>
										{i + 1390}
									</MenuItem>
								))}
							</Select>
						</Box>
						<TextField
							size='small'
							label='مقدار اوپیوم'
							value={parseInt(data.Opium) || ''}
							onChange={e =>
								dispatch({
									type: 'Opium',
									payload: e.target.value,
								})
							}
						/>
						<TextField
							size='small'
							label='مقدار متادون'
							value={parseInt(data.Metadon) || ''}
							onChange={e =>
								dispatch({
									type: 'Metadon',
									payload: e.target.value,
								})
							}
						/>
						<TextField
							size='small'
							label='مقدار بوپرو'
							value={parseInt(data.B2) || ''}
							onChange={e =>
								dispatch({
									type: 'B2',
									payload: e.target.value,
								})
							}
						/>
						<Button
							onClick={handleSubmit}
							variant='contained'
							startIcon={<Save />}
							disabled={!canSubmit}>
							ثبت
						</Button>
						<Button
							onClick={() => navigate('/storage')}
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

export default ShipmentEntry;
