import {
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	DialogContentText,
	TextField,
	Button,
} from '@mui/material';

const SearchBox = ({ content, open, onClose, search, onChange, onCommit }) => {
	const onCloseHandler = () => {
		onChange('');
		onClose();
	};

	const onCommitHandler = () => {
		onClose();
		onCommit();
	};

	return (
		<Dialog
			PaperProps={{ style: { borderRadius: 8 } }}
			open={open}
			onClose={onCloseHandler}>
			<DialogTitle>جستجو</DialogTitle>
			<DialogContent>
				<DialogContentText>{content}</DialogContentText>
				<TextField
					onChange={e => onChange(e.target.value)}
					value={search}
					label='عبارت مورد نظر'
					fullWidth
					style={{ marginTop: '1rem' }}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCloseHandler}>بستن</Button>
				<Button
					onClick={onCommitHandler}
					variant='contained'
					disabled={search?.length === 0}>
					جستجو
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default SearchBox;
