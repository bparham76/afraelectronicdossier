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
import { useState } from 'react';

const NewDossier = () => {
	const navigate = useNavigate();
	const [isCapacityFull, setIsCapacityFull] = useState(false);
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
					{/* <TextField
						size='small'
						label='کد بیمار'
						variant='outlined'
					/> */}
					<Autocomplete
						size='small'
						options={[
							{ label: 'برای جستجو عبارتی وارد کنید', id: -1 },
						]}
						getOptionDisabled={option => option.id === -1}
						loading={false}
						loadingText='در حال جستجو...'
						noOptionsText='موردی یافت نشد.'
						renderInput={params => (
							<TextField
								{...params}
								label='انتخاب بیمار'
							/>
						)}
					/>
					{/* <TextField
						size='small'
						label='تلفن همراه'
						variant='outlined'
					/>
					<TextField
						size='small'
						label='تلفن ثابت'
						variant='outlined'
					/>
					<TextField
						multiline
						rows={4}
						maxRows={4}
						size='small'
						label='نشانی محل سکونت'
						variant='outlined'
					/> */}
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
