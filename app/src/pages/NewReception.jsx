import {
	Box,
	Select,
	MenuItem,
	Fade,
	Button,
	Typography,
	Autocomplete,
	TextField,
} from '@mui/material';
import { Redo, Save } from '@mui/icons-material';
import { months } from '../data/calendar';
import { useNavigate } from 'react-router-dom';
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
	const [dossier, setDossier] = useState(-1);
	const [day, setDay] = useState(0);
	const [month, setMonth] = useState(0);
	const [year, setYear] = useState(0);
	const [searchString, setSearchString] = useState('');
	const [searchTimeout, setSearchTimeout] = useState(null);

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
							d?.dossierNumber,
						id: d?.id,
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
						<Typography variant='h4'>ثبت مراجعه جدید</Typography>
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
						<Button
							disabled={
								dossier < 0 ||
								day === 0 ||
								month === 0 ||
								year === 0
							}
							variant='contained'
							startIcon={<Save />}>
							ذخیره
						</Button>
						<Button
							onClick={() => navigate('/receptions')}
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

export default NewReception;
