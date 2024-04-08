import {
	Box,
	Grid,
	Select,
	MenuItem,
	Fade,
	Button,
	ButtonGroup,
	Typography,
	Autocomplete,
	TextField,
} from '@mui/material';
import { Redo, Save } from '@mui/icons-material';
import { months } from '../data/calendar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import { useNotify } from '../services/NotificationSystem';
import { useAuthState } from '../services/auth/AuthenticationSystem';
import axios from 'axios';

const emptyList = [
	{
		label: 'برای جستجو عبارتی وارد کنید',
		id: -1,
	},
];

const NewReception = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const { token } = useAuthState();
	const [isLoading, setIsLoading] = useState(false);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [dossierList, setDossierList] = useState(emptyList);
	// const [quantity, setQuantity] = useState([
	// 	{ drug: 'Metadon', quantity: 0 },
	// 	{ drug: 'B2', quantity: 0 },
	// 	{ drug: 'Opium', quantity: 0 },
	// ]);
	const [dossier, setDossier] = useState(-1);
	const [day, setDay] = useState(0);
	const [month, setMonth] = useState(0);
	const [year, setYear] = useState(0);
	const [dose, setDose] = useState(0);
	const [searchString, setSearchString] = useState('');
	const [searchTimeout, setSearchTimeout] = useState(null);
	const [submitData, setSubmitData] = useState(false);
	const dossier_id = useSearchParams()[0].get('dossier_id');
	const [singleDossier, setSingleDossier] = useState(null);
	const [description, setDescription] = useState('');
	const [canSubmit, setCanSubmit] = useState(false);

	//TODO: get storage information
	//TODO: get patient restictions based on dose and date

	useEffect(() => {
		if (
			dossier < 0 ||
			day === 0 ||
			month === 0 ||
			year === 0 ||
			dose === 0 ||
			dose === ''
		)
			setCanSubmit(true);
		else setCanSubmit(false);
	}, [dose, dossier, day, month, year]);

	const execSearch = useCallback(async () => {
		try {
			const response = await axios.get('/dossier/s/s/' + searchString, {
				headers: { Authorization: 'Bearer ' + token },
			});
			if (response.status < 400) {
				setDossierList(
					response.data.data.map(d => ({
						label:
							d?.patient?.firstName +
							' ' +
							d?.patient?.lastName +
							'، ' +
							d?.dossierNumber +
							', ' +
							(d?.drugType === 'Opium'
								? 'اوپیوم'
								: d?.drugType === 'Metadon'
								? 'متادون'
								: 'بوپرو'),
						id: d?.dossierNumber,
					}))
				);
			}
		} catch (error) {
			setDossierList(emptyList);
			notify({
				type: 'error',
				msg: 'خطا در برقراری ارتباط با سرور، جستجو انجام نشد.',
			});
		} finally {
			setIsSearchLoading(false);
		}
	}, [searchString]);

	useEffect(() => {
		if (dossier_id) return;

		if (searchString.trim().length === 0) {
			setDossierList(emptyList);
			return;
		}

		setIsSearchLoading(true);
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}
		setSearchTimeout(setTimeout(execSearch, 1000));
	}, [searchString]);

	useEffect(() => {
		setDossierList(emptyList);
	}, [dossier]);

	useEffect(() => {
		if (!submitData) return;

		const exec = async () => {
			try {
				setIsLoading(true);
				const response = await axios.post(
					'/reception',
					{ dossier, day, month, year, dose, description },
					{
						headers: {
							Authorization: 'Bearer ' + token,
						},
					}
				);
				if (response.status < 400) {
					if (response.data.msg === 'insufficient') {
						notify({
							type: 'error',
							msg: 'موجودی انبار برای تحویل دارو کافی نیست.',
						});
					} else {
						notify({ msg: 'ثبت مراجعه با موفقیت انجام شد.' });
						navigate(
							dossier_id
								? '/dossier/' + dossier_id
								: '/receptions'
						);
					}
				}
			} catch (error) {
				notify({
					type: 'error',
					msg: 'خطا در برقراری ارتباط با سرور. ثبت اطلاعات انجام نشد.',
				});
			} finally {
				setIsLoading(false);
				setSubmitData(false);
			}
		};

		exec();
	}, [submitData]);

	useEffect(() => {
		if (!dossier_id) return;

		const getDossier = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get('/dossier/g/' + dossier_id, {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				});
				if (response.status < 400) {
					setDossier(response.data.data.dossierNumber);
					setSingleDossier(
						response.data.data.patient.firstName +
							' ' +
							response.data.data.patient.lastName +
							', ' +
							response.data.data.dossierNumber +
							', ' +
							(response.data.data.drugType === 'Opium'
								? 'اوپیوم'
								: response.data.data.drugType === 'Metadon'
								? 'متادون'
								: 'بوپرو')
					);
				}
			} catch (error) {
				notify({
					type: 'error',
					msg: 'خطا در برقراری ارتباط با سرور، اطلاعات دریافت نشد.',
				});
			} finally {
				setIsLoading(false);
			}
		};

		// const getQuantity = async () => {
		// 	try {
		// 		const response = await axios.get('/dossier/quantity', {
		// 			headers: { Authorization: 'Bearer ' + token },
		// 		});
		// 		if (response.status < 400) setQuantity(response.data.data);
		// 	} catch (error) {
		// 		notify({
		// 			type: 'error',
		// 			msg: 'خطا در برقراری ارتباط با سرور.',
		// 		});
		// 	} finally {
		// 		setIsLoading(false);
		// 	}
		// };

		// getQuantity();
		getDossier();
	}, []);

	useEffect(() => {
		console.log(description);
	}, [description]);

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
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}>
							<Typography variant='h4'>
								ثبت مراجعه جدید
							</Typography>
							<ButtonGroup>
								<Button
									onClick={() => setSubmitData(true)}
									disabled={canSubmit}
									variant='contained'
									startIcon={<Save />}>
									ذخیره
								</Button>
								<Button
									onClick={() =>
										navigate(
											dossier_id
												? '/dossier/' + dossier_id
												: '/receptions'
										)
									}
									variant='outlined'
									startIcon={<Redo />}>
									بازگشت
								</Button>
							</ButtonGroup>
						</Box>
					</Grid>
					<Grid
						item
						xs={4}>
						{!dossier_id && (
							<Autocomplete
								size='small'
								options={dossierList}
								onChange={(e, v) => setDossier(v ? v?.id : -1)}
								getOptionDisabled={option => option.id === -1}
								loading={isSearchLoading}
								loadingText='در حال جستجو...'
								noOptionsText='موردی یافت نشد.'
								renderInput={params => (
									<TextField
										{...params}
										label='انتخاب پرونده'
										value={searchString}
										onChange={e =>
											setSearchString(e.target.value)
										}
									/>
								)}
							/>
						)}
						{dossier_id && (
							<TextField
								fullWidth
								disabled
								size='small'
								helperText='پرونده منتخب'
								value={singleDossier}
							/>
						)}
						<Box
							sx={{
								marginTop: 1,
								marginBottom: 1,
								display: 'flex',
								gap: 1,
								alignItems: 'center',
								justifyContent: 'space-between',
							}}>
							<Typography variant='body2'>تاریخ</Typography>
							<Select
								size='small'
								style={{ width: 100 }}
								onChange={e => setDay(e.target.value)}
								value={day}>
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
								onChange={e => setMonth(e.target.value)}
								value={month}>
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
								onChange={e => setYear(e.target.value)}
								value={year}>
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
							fullWidth
							size='small'
							label='مقدار تجویز'
							value={parseInt(dose) || ''}
							onChange={e =>
								setDose(prev =>
									/^[\d]{0,5}$/.test(e.target.value)
										? e.target.value
										: prev
								)
							}
						/>
					</Grid>
					<Grid
						item
						xs={8}>
						<TextField
							multiline
							fullWidth
							label='توضیحات'
							minRows={12}
							maxRows={12}
							value={description}
							onChange={e => setDescription(e.target.value)}
							helperText='درج توضیحات اختیاری است.'
						/>
					</Grid>
				</Grid>
			</Fade>
		</>
	);
};

export default NewReception;
