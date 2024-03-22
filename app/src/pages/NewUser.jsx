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

const NewUser = () => {
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
						size='small'
						label='نام'
						variant='outlined'
					/>
					<TextField
						size='small'
						label='نام خانوادگی'
						variant='outlined'
					/>
					<TextField
						size='small'
						label='نام کاربری'
						variant='outlined'
					/>
					<TextField
						size='small'
						label='رمز عبور'
						variant='outlined'
						type='password'
					/>
					<Select
						defaultValue={0}
						size='small'>
						<MenuItem value={0}> -- نقش -- </MenuItem>
						<MenuItem value={1}>منشی</MenuItem>
						<MenuItem value={2}>دکتر</MenuItem>
					</Select>
					<Select
						defaultValue={0}
						size='small'>
						<MenuItem value={0}> -- وضعیت -- </MenuItem>
						<MenuItem value={1}>فعال</MenuItem>
						<MenuItem value={2}>غیر فعال</MenuItem>
					</Select>
					<Button
						disabled
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
	);
};

export default NewUser;
