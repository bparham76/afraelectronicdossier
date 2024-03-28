import { useState, useContext, createContext } from 'react';
import {
	Snackbar,
	Alert,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	DialogContentText,
	Button,
} from '@mui/material';

const NotificationContext = createContext();

const NotificationSystem = ({ children }) => {
	/* start alert */
	const [showNotif, setShowNotif] = useState(false);
	const [notifType, setNotifType] = useState('info');
	const [notifMessage, setNotifMessage] = useState('');

	const handleCloseAlert = (e, r) => r !== 'clickaway' && setShowNotif(false);

	const fireNotif = ({ msg = '', type = 'info' }) => {
		setNotifMessage(msg);
		setNotifType(type);
		setShowNotif(true);
	};
	/* end alert */

	/* start okcancel dialog */
	const [showOkCancel, setShowOkCancel] = useState(false);
	const [titleOkCancel, setTitleOkCancel] = useState('');
	const [captionOkCancel, setCaptionOkCancel] = useState('');
	const [okCancelAccept, setOkCancelAccept] = useState(() => {});
	const [okCancelReject, setOkCancelReject] = useState(() => {});

	const handleCloseOkCancel = (e, r) =>
		r !== 'clickaway' && setShowOkCancel(false);

	const fireOkCancel = ({
		title = '',
		caption = '',
		onAccept = () => {},
		onReject = () => {},
	}) => {
		setCaptionOkCancel(caption);
		setTitleOkCancel(title);
		if (typeof onAccept === 'function') setOkCancelAccept(() => onAccept);
		if (typeof onReject === 'function') setOkCancelReject(() => onReject);
		setShowOkCancel(true);
	};
	/* end okcancel dialog */

	return (
		<NotificationContext.Provider value={{ fireNotif, fireOkCancel }}>
			{children}
			<Snackbar
				autoHideDuration={5000}
				onClose={handleCloseAlert}
				open={showNotif}>
				<Alert
					variant='filled'
					severity={notifType}
					onClose={handleCloseAlert}>
					{notifMessage}
				</Alert>
			</Snackbar>
			<Dialog
				slotProps={{
					backdrop: {
						sx: {
							backdropFilter: 'blur(3px)',
						},
					},
				}}
				open={showOkCancel}>
				<DialogTitle>{titleOkCancel}</DialogTitle>
				<DialogContent>
					<DialogContentText>{captionOkCancel}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							if (typeof okCancelReject === 'function')
								okCancelReject();
							handleCloseOkCancel();
						}}>
						انصراف
					</Button>
					<Button
						onClick={() => {
							if (typeof okCancelAccept === 'function')
								okCancelAccept();
							handleCloseOkCancel();
						}}>
						ادامه
					</Button>
				</DialogActions>
			</Dialog>
		</NotificationContext.Provider>
	);
};

export default NotificationSystem;

export const useNotify = () => useContext(NotificationContext).fireNotif;
export const useOkCancelDialog = () =>
	useContext(NotificationContext).fireOkCancel;
