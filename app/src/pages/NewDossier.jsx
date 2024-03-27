import { Save, Redo } from '@mui/icons-material';
import {
	Box,
	Button,
	TextField,
	Select,
	Typography,
	MenuItem,
	Fade,
	Collapse,
	Autocomplete,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useAuthState } from '../services/auth/AuthenticationSystem';
import axios from 'axios';
import LoadingOverlay from '../components/LoadingOverlay';
import { useNotify } from '../services/NotificationSystem';

const NewDossier = () => {
	const navigate = useNavigate();
	const notify = useNotify();
	const { token } = useAuthState();
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [isCapLoading, setIsCaoLoading] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [submitData, setSubmitData] = useState(false);
	const [patientList, setPatientList] = useState([
		{
			label: 'برای جستجو عبارتی وارد کنید',
			id: -1,
		},
	]);
	const [searchString, setSearchString] = useState('');
	const [searchTimeout, setSearchTimeout] = useState(null);
	const [patient, setPatient] = useState(-1);
	const [number, setNumber] = useState('');
	const [drugType, setDrugType] = useState('none');
	const [dossierCaps, setDossierCaps] = useState([
		{ drug: 'b2', cap: 0 },
		{ drug: 'opium', cap: 0 },
		{ drug: 'metadon', cap: 0 },
	]);
	const [isCapacityFull, setIsCapacityFull] = useState(false);

	useEffect(() => {
		const getCap = async () => {
			try {
				setIsCaoLoading(true);
				const res = await axios.get('/dossier/capacity/dossier', {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				});
				if (res.status < 300) {
					setDossierCaps(res?.data?.data);
				}
			} catch (error) {
			} finally {
				setIsCaoLoading(false);
			}
		};

		getCap();
	}, []);

	useEffect(() => {
		if (isCapLoading || drugType === 'none') {
			setIsCapacityFull(false);
			return;
		}

		const cap = dossierCaps?.find(
			d => d.drug === drugType.toLowerCase()
		).cap;

		if (!cap || cap === 0) setIsCapacityFull(true);
		else setIsCapacityFull(false);
	}, [drugType]);

	const execSearch = useCallback(async () => {
		try {
			setIsSearchLoading(true);
			const response = await axios.get('/patient/s/s/' + searchString, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			});
			if (response.status < 300) {
				const tmp = response.data.data.map(item => ({
					label:
						item.firstName +
						' ' +
						item.lastName +
						' - ' +
						item.nationalID,
					id: item.id,
				}));
				setPatientList(tmp);
			}
		} catch {
			setPatientList([
				{
					label: 'برای جستجو عبارتی وارد کنید',
					id: -1,
				},
			]);
		} finally {
			setIsSearchLoading(false);
		}
	}, [searchString]);

	useEffect(() => {
		if (searchString.trim().length === 0) {
			setPatientList([
				{
					label: 'برای جستجو عبارتی وارد کنید',
					id: -1,
				},
			]);
			return;
		}

		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}
		setSearchTimeout(setTimeout(execSearch, 1000));

		return () => searchTimeout && clearTimeout(searchTimeout);
	}, [searchString]);

	useEffect(() => {
		if (!submitData) return;
		const execSubmit = async () => {
			try {
				setIsLoading(true);

				const response = await axios.post(
					'/dossier/new',
					{
						drugType: drugType,
						patientId: patient,
						inQueue: isCapacityFull,
						number: number,
					},
					{
						headers: {
							Authorization: 'Bearer ' + token,
						},
					}
				);
				if (response.status < 300) {
					notify({
						msg: 'پرونده جدید با موفقت ایجاد شد.',
					});
					navigate('/dossiers');
				}
			} catch {
				notify({
					type: 'error',
					msg: 'امکان ساخت پرونده جدید وجود نداشت',
				});
			} finally {
				setIsLoading(false);
				setSubmitData(false);
			}
		};
		execSubmit();
	}, [submitData]);

	return (
		<>
			<LoadingOverlay open={isLoading || isCapLoading} />
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
						<Typography variant='h4'>پرونده جدید</Typography>
						<Autocomplete
							size='small'
							onClose={() =>
								setPatientList([
									{
										label: 'برای جستجو عبارتی وارد کنید',
										id: -1,
									},
								])
							}
							onChange={(e, v) => setPatient(v ? v?.id : -1)}
							options={patientList}
							getOptionDisabled={option => option.id === -1}
							loading={isSearchLoading}
							loadingText='در حال جستجو...'
							noOptionsText='موردی یافت نشد.'
							renderInput={params => (
								<TextField
									onChange={e => {
										setSearchString(e.target.value);
									}}
									value={searchString}
									{...params}
									label='انتخاب بیمار'
								/>
							)}
						/>
						<Select
							value={drugType}
							onChange={e => setDrugType(e.target.value)}
							size='small'>
							<MenuItem value='none'>-- داروی مصرفی --</MenuItem>
							<MenuItem value='B2'>B2</MenuItem>
							<MenuItem value='Metadon'>متادون</MenuItem>
							<MenuItem value='Opium'>اوپیوم</MenuItem>
						</Select>
						<Collapse in={!isCapacityFull}>
							<TextField
								fullWidth
								size='small'
								label='شماره پرونده'
								variant='outlined'
								value={number}
								onChange={e =>
									setNumber(
										/^[0-9]{0,10}$/.test(e.target.value)
											? e.target.value
											: number
									)
								}
							/>
						</Collapse>
						<Collapse in={isCapacityFull}>
							<Typography variant='body1'>
								ظرفیت برای پذیرش در گروه
								{drugType === 'Metadon'
									? ' متادون '
									: drugType === 'Opium'
									? ' اوپیوم '
									: ' B2 '}
								تکیل است.
							</Typography>
							<Typography variant='body1'>
								در صورت ثبت، پرونده به صف تشکیل وارد می شود.
							</Typography>
						</Collapse>
						<Button
							disabled={
								drugType === 'none' ||
								patient < 0 ||
								(!isCapacityFull && number.length === 0)
							}
							onClick={() => setSubmitData(true)}
							variant='contained'
							startIcon={<Save />}>
							ذخیره
						</Button>
						<Button
							onClick={() => navigate('/dossiers')}
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

export default NewDossier;
