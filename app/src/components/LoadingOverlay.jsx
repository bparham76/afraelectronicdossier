import { Backdrop, CircularProgress } from '@mui/material';

const LoadingOverlay = ({ open }) => (
	<Backdrop
		open={open}
		sx={{
			color: '#fff',
			zIndex: 999,
			backdropFilter: 'blur(3px)',
		}}>
		<CircularProgress />
	</Backdrop>
);

export default LoadingOverlay;
