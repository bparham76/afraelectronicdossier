import {
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	TextField,
	Button,
	Grid,
} from '@mui/material';

const EditUser = ({ userId = -1, onDelete, onClose, onSubmit }) => {
	return (
		<Dialog
			slotProps={{
				backdrop: {
					sx: {
						backdropFilter: 'blur(3px)',
					},
				},
			}}
			PaperProps={{ style: { borderRadius: 8 } }}
			open={userId > 0}>
			<DialogTitle>ویرایش کاربر</DialogTitle>
			<DialogContent>
				<Grid
					container
					spacing={4}>
					<Grid
						item
						xs={6}>
						<TextField
							label='عبارت مورد نظر'
							fullWidth
							style={{ marginTop: '1rem' }}
						/>
					</Grid>
					<Grid
						item
						xs={6}>
						<TextField
							label='عبارت مورد نظر'
							fullWidth
							style={{ marginTop: '1rem' }}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>انصراف</Button>
				<Button
					onClick={onDelete}
					variant='contained'
					color='error'>
					حذف
				</Button>
				<Button
					onClick={onSubmit}
					variant='contained'
					disabled>
					بروزرسانی
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditUser;
