import { Save, Redo } from '@mui/icons-material';
import {
	Box,
	Typography,
	TextField,
	Select,
	MenuItem,
	Button,
	Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NewPatient = () => {
	const navigate = useNavigate();
	return (
		<Fade
			in={true}
			unmountOnExit>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					marginTop: 1,
				}}>
				<Box
					sx={{
						display: 'flex',
						gap: 1,
						flexDirection: 'column',
					}}>
					<Typography variant='h4'>بیمار جدید</Typography>
					<TextField
						size='small'
						label='نام'
						variant='outlined'
					/>
					<TextField
						size='small'
						label='نام خانوادگی'
						variant='outlined'
					/>
					<Select
						defaultValue={0}
						size='small'>
						<MenuItem value={0}> -- جنسیت -- </MenuItem>
						<MenuItem value={1}>آقا</MenuItem>
						<MenuItem value={2}>خانم</MenuItem>
					</Select>
					<TextField
						size='small'
						label='شماره ملی'
						variant='outlined'
					/>
					<TextField
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
					/>
					<Button
						disabled
						variant='contained'
						startIcon={<Save />}>
						ذخیره
					</Button>
					<Button
						onClick={() => navigate('/patients')}
						variant='outlined'
						startIcon={<Redo />}>
						بازگشت
					</Button>
				</Box>
			</Box>
		</Fade>
	);
};

export default NewPatient;
