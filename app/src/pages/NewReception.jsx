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

const NewReception = () => {
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
					<Typography variant='h4'>ثبت مراجعه جدید</Typography>
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
							defaultValue={0}>
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
							size='small'
							style={{ width: 100 }}
							defaultValue={0}>
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
							defaultValue={0}>
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
						disabled
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
	);
};

export default NewReception;
