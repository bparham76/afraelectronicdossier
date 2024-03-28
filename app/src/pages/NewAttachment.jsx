import {
	Fade,
	TextField,
	ButtonGroup,
	Button,
	Typography,
	Grid,
} from '@mui/material';
import { Save, Redo } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import { useNotify, useOkCancelDialog } from '../services/NotificationSystem';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthState } from '../services/auth/AuthenticationSystem';

const NewAttachment = () => {
	const notify = useNotify();
	const navigate = useNavigate();
	const dialog = useOkCancelDialog();
	const { id, type } = useParams();
	const { token } = useAuthState();
	const [isLoading, setIsLoading] = useState(false);
	const [canSubmit, setCanSubmit] = useState(true);
	const [submitData, setSubmitData] = useState(false);

	const handleReturn = () => navigate('/patient/' + id);

	const handleGoSubmit = () =>
		dialog({
			title: 'توجه',
			caption: 'فایل پیوست در سیستم ثبت می شود.',
			onAccept: () => setSubmitData(true),
		});

	return (
		<>
			<LoadingOverlay open={false} />
			<Fade in={true}>
				<Grid
					container
					spacing={4}>
					<Grid
						item
						xs={12}
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
						}}>
						<Typography variant='h4'>افزودن پیوست</Typography>
						<ButtonGroup>
							<Button
								onClick={handleGoSubmit}
								disabled={!canSubmit}
								startIcon={<Save />}>
								ذخیره
							</Button>
							<Button
								onClick={handleReturn}
								startIcon={<Redo />}>
								بازگشت
							</Button>
						</ButtonGroup>
					</Grid>
				</Grid>
			</Fade>
		</>
	);
};

export default NewAttachment;
