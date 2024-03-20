import { Fade, Typography, Grid, Box, Button } from '@mui/material';
import { Home, Add, ViewComfy } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Storage = () => {
	const navigate = useNavigate();

	return (
		<Fade
			in={true}
			unmountOnExit>
			<Grid
				container
				spacing={4}>
				<Grid
					item
					sx={{ display: 'flex', justifyContent: 'space-between' }}
					xs={12}>
					<Typography
						variant='h4'
						fontWeight='bold'>
						انبار
					</Typography>
					<Box sx={{ display: 'flex', gap: 2 }}>
						<Button
							size='small'
							variant='outlined'
							startIcon={<ViewComfy />}>
							گزارشات
						</Button>
						<Button
							size='small'
							variant='outlined'
							startIcon={<Add />}>
							افزودن موجودی
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
					xs={6}>
					salam
				</Grid>
				<Grid
					item
					xs={6}>
					khubi
				</Grid>
			</Grid>
		</Fade>
	);
};

export default Storage;
