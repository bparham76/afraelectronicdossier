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

const ShipmentEntry = () => {
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
					<TextField
						size='small'
						label='مقدار اوپیوم'
					/>
					<TextField
						size='small'
						label='مقدار متادون'
					/>
					<TextField
						size='small'
						label='مقدار B2'
					/>
					<Button
						variant='outlined'
						startIcon={<Save />}
						disabled>
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
	);
};

export default ShipmentEntry;
