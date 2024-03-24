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

const NewDossier = () => {
	const navigate = useNavigate();
	const { token } = useAuthState();
	const [isLoading, setIsLoading] = useState(false);
	const [patientList, setPatientList] = useState([
		{
			label: 'برای جستجو عبارتی وارد کنید',
			id: -1,
		},
	]);
	const [searchString, setSearchString] = useState('');

	const [isCapacityFull, setIsCapacityFull] = useState(false);

	const search = useCallback(() => {
		if (searchString.trim().length == 0) {
			setPatientList([
				{
					label: 'برای جستجو عبارتی وارد کنید',
					id: -1,
				},
			]);
			return;
		}

		setIsLoading(true);

		const exec = async () => {
			try {
				const response = await axios.get(
					'/patient/s/s/' + searchString,
					{
						headers: {
							Authorization: 'Bearer ' + token,
						},
					}
				);
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
				setIsLoading(false);
			}
		};

		setTimeout(exec, 1000);
	}, [searchString]);

	useEffect(search, [searchString]);

	// useEffect(() => {
	// 	if (searchString.trim().length < 3) {
	// 		setPatientList([
	// 			{
	// 				label: 'برای جستجو عبارتی وارد کنید',
	// 				id: -1,
	// 			},
	// 		]);
	// 		return;
	// 	}

	// 	const exec = async () => {
	// 		try {
	// 			const response = await axios.get(
	// 				'/patient/s/s/' + searchString,
	// 				{
	// 					headers: {
	// 						Authorization: 'Bearer ' + token,
	// 					},
	// 				}
	// 			);
	// 			if (response.status < 300) {
	// 				const tmp = response.data.data.map(item => ({
	// 					label: item.firstName + ' ' + item.lastName,
	// 					id: item.id,
	// 				}));
	// 				setPatientList(tmp);
	// 			}
	// 		} catch {
	// 			setPatientList([
	// 				{
	// 					label: 'برای جستجو عبارتی وارد کنید',
	// 					id: -1,
	// 				},
	// 			]);
	// 		} finally {
	// 			setIsLoading(false);
	// 		}
	// 	};

	// 	exec();
	// }, [searchString]);

	return (
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
						options={patientList}
						getOptionDisabled={option => option.id === -1}
						loading={isLoading}
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
						onChange={e =>
							e.target.value == 1
								? setIsCapacityFull(true)
								: setIsCapacityFull(false)
						}
						defaultValue={0}
						size='small'>
						<MenuItem value={0}> -- داروی مصرفی -- </MenuItem>
						<MenuItem value={1}>B2</MenuItem>
						<MenuItem value={2}>متادون</MenuItem>
						<MenuItem value={3}>اوپیوم</MenuItem>
					</Select>
					<Collapse in={isCapacityFull}>
						<Typography variant='body1'>
							ظرفیت برای پذیرش در گروه B2 تکیل است.
						</Typography>
						<Typography variant='body1'>
							در صورت ثبت، پرونده به صف تشکیل وارد می شود.
						</Typography>
					</Collapse>
					<Button
						disabled
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
	);
};

export default NewDossier;
