import { Fade, Typography, Grid, Button } from '@mui/material';
import { Home } from '@mui/icons-material';
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
					<Button
						onClick={() => navigate('/')}
						size='small'
						variant='outlined'
						startIcon={<Home />}>
						صفحه اصلی
					</Button>
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
