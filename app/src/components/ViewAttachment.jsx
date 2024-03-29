import { Zoom, Box, Button, Backdrop } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useState, useEffect } from 'react';

const ViewAttachment = ({ file, open = false, onClose }) => {
	const [show, setShow] = useState(false);

	const exitView = () => {
		setShow(false);
		setTimeout(onClose, 100);
	};

	useEffect(() => {
		if (!open) return;
		setTimeout(() => {
			setShow(true);
		}, 100);
	}, [open]);

	return (
		<Backdrop
			open={open}
			sx={{ backdropFilter: 'blur(3px)', zIndex: 1001 }}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					gap: 2,
				}}>
				<Zoom in={show}>
					<img
						style={{
							height: 400,
							width: 600,
							objectFit: 'contain',
						}}
						src={
							document
								.querySelector('#afra_app')
								?.getAttribute('data-server') +
							'/static/' +
							file
						}
					/>
				</Zoom>
				<Button onClick={exitView}>
					<Close />
				</Button>
			</Box>
		</Backdrop>
	);
};

export default ViewAttachment;
