import {
	Inventory,
	People,
	Warehouse,
	MeetingRoom,
	Settings,
} from '@mui/icons-material';
import { Box, Button, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ItemContainer = ({ children, href }) => {
	const navigate = useNavigate();
	const goTo = dest =>
		setTimeout(() => {
			navigate(dest);
		}, 150);

	return (
		<Button
			onClick={() => goTo(href)}
			variant='outlined'
			style={{
				width: '200px',
				aspectRatio: '1/1',
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
				fontSize: '1.5rem',
			}}>
			{children}
		</Button>
	);
};

const Home = () => {
	return (
		<Fade in={true}>
			<Box
				gap={4}
				height='100%'
				display='flex'
				alignItems='center'
				justifyContent='center'>
				<ItemContainer href='/receptions'>
					<MeetingRoom style={{ scale: '200%' }} />
					مراجعات
				</ItemContainer>
				<ItemContainer href='/patients'>
					<People style={{ scale: '200%' }} />
					بیماران
				</ItemContainer>
				<ItemContainer href='/dossiers'>
					<Inventory style={{ scale: '200%' }} />
					پرونده ها
				</ItemContainer>
				<ItemContainer href='/storage'>
					<Warehouse style={{ scale: '200%' }} />
					انبار
				</ItemContainer>
				<ItemContainer href='/settings'>
					<Settings style={{ scale: '200%' }} />
					تنظیمات
				</ItemContainer>
			</Box>
		</Fade>
	);
};

export default Home;
