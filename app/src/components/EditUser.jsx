import {
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	TextField,
	Button,
	Grid,
	Switch,
	Typography,
} from '@mui/material';
import { useState, useEffect, useReducer, useRef } from 'react';
import { userData, userReducer } from '../services/data/newUser';

const EditUser = ({
	userId = -1,
	onClose,
	onSubmit,
	setEdittedUserData,
	data,
}) => {
	const [_data, dispatch] = useReducer(userReducer, userData);
	const [canSubmit, setCanSubmit] = useState(false);
	const dataRef = useRef();

	useEffect(() => {
		dispatch({ type: 'init', payload: data });
		dataRef.current = data;
	}, [data]);

	useEffect(() => {
		if (
			_data.firstName !== dataRef.current?.firstName ||
			_data.lastName !== dataRef.current?.lastName ||
			(_data.firstName?.length > 0 && _data.lastName?.length > 0) ||
			_data.password?.length > 0
		)
			setCanSubmit(true);
		else setCanSubmit(false);
	}, [_data]);

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
							label='نام'
							value={_data?.firstName}
							onChange={e =>
								dispatch({
									type: 'firstName',
									payload: e.target.value,
								})
							}
							fullWidth
							style={{ marginTop: '1rem' }}
						/>
					</Grid>
					<Grid
						item
						xs={6}>
						<TextField
							label='نام خانوادگی'
							fullWidth
							value={_data?.lastName}
							onChange={e =>
								dispatch({
									type: 'lastName',
									payload: e.target.value,
								})
							}
							style={{ marginTop: '1rem' }}
						/>
					</Grid>
					<Grid
						item
						xs={6}>
						<TextField
							label='رمز عبور'
							type='password'
							fullWidth
							value={_data?.password}
							onChange={e =>
								dispatch({
									type: 'password',
									payload: e.target.value,
								})
							}
							helperText='در صورت خالی ماندن، رمز عبور تغییر نمی کند.'
						/>
					</Grid>
					<Grid
						item
						xs={6}>
						<Typography variant='body1'>
							وضعیت کاربر
							<Switch
								checked={_data.state === 'Active'}
								onChange={e =>
									dispatch({
										type: 'state',
										payload: e.target.checked
											? 'Active'
											: 'Suspended',
									})
								}
							/>
						</Typography>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					variant='outlined'
					onClick={onClose}>
					انصراف
				</Button>
				<Button
					onClick={onSubmit}
					variant='contained'
					disabled={!canSubmit}>
					بروزرسانی
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditUser;
