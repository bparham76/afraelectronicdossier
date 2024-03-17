import { Fade, Typography, Grid, Button, Box } from '@mui/material';
import { Home, Add, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Reception = () => {
	const navigate = useNavigate();

	return (
		<Fade
			in={true}
			unmountOnExit>
			<Grid
				container
				spacing={4}>
				<Grid
					sx={{ display: 'flex', justifyContent: 'space-between' }}
					item
					xs={12}>
					<Typography
						variant='h4'
						fontWeight='bold'>
						پرونده ها
					</Typography>
					<Box sx={{ display: 'flex', gap: 2 }}>
						<Button
							size='small'
							variant='outlined'
							startIcon={<Add />}>
							افزودن
						</Button>
						<Button
							size='small'
							variant='outlined'
							startIcon={<Search />}>
							جستجو
						</Button>
						<Button
							onClick={() => navigate('/')}
							size='small'
							variant='outlined'
							startIcon={<Home />}>
							صفحه اصلی
						</Button>
					</Box>
				</Grid>
				<Grid
					item
					xs={12}>
					Reception List
				</Grid>
			</Grid>
		</Fade>
	);
};

export default Reception;
