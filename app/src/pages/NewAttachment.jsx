import {
	Fade,
	TextField,
	Button,
	Typography,
	Box,
	Collapse,
} from '@mui/material';
import { FileUpload } from '@mui/icons-material';
import { Save, Redo, Close } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import { useNotify, useOkCancelDialog } from '../services/NotificationSystem';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthState } from '../services/auth/AuthenticationSystem';
import axios from 'axios';
import ViewAttachment from '../components/ViewAttachment';

const NewAttachment = () => {
	const notify = useNotify();
	const navigate = useNavigate();
	const dialog = useOkCancelDialog();
	const { id, type } = useParams();
	const { token } = useAuthState();
	const [isLoading, setIsLoading] = useState(false);
	const [canSubmit, setCanSubmit] = useState(false);
	const [submitData, setSubmitData] = useState(false);
	const [title, setTitle] = useState('');
	const [file, setFile] = useState(null);
	const [showFile, setShowFile] = useState(false);
	const fileNameRef = useRef();

	const handleReturn = () =>
		navigate(type === 'patient' ? '/patient/' + id : '/dossier/' + id);

	const handleGoSubmit = () =>
		dialog({
			title: 'توجه',
			caption: 'فایل پیوست در سیستم ثبت می شود.',
			onAccept: () => setSubmitData(true),
		});

	useEffect(() => {
		if (title.trim().length !== 0 && file !== null) setCanSubmit(true);
		else setCanSubmit(false);
	}, [title, file]);

	useEffect(() => {
		if (!submitData) return;

		const exec = async () => {
			try {
				setIsLoading(true);
				const data = new FormData();
				data.append('cargo', file);
				data.append('title', title);
				data.append('id', id);
				data.append('type', type === 'patient' ? 'patient' : 'dossier');
				const response = await axios.post('/attachment', data, {
					headers: {
						Authorization: 'Bearer ' + token,
						'Content-Type': 'multipart/form-data',
					},
				});
				if (response.status < 400) {
					notify({ msg: 'پیوست با موفقیت بارگذاری گردید' });
					handleReturn();
				}
			} catch (error) {
				notify({
					type: 'error',
					msg: 'خطا در ارتباط با سرور، بارگذاری پیوست انجام نشد.',
				});
			} finally {
				setIsLoading(false);
			}
		};
		exec();
	}, [submitData]);

	return (
		<>
			<ViewAttachment
				isLocal
				open={showFile}
				onClose={() => setShowFile(false)}
				file={file && URL.createObjectURL(file)}
			/>
			<LoadingOverlay open={isLoading} />
			<Fade in={true}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 4,
					}}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1,
							flexDirection: 'column',
						}}>
						<Typography
							mb={1}
							variant='h4'>
							افزودن پیوست
						</Typography>
						<TextField
							label='عنوان'
							value={title}
							onChange={e => setTitle(e.target.value)}
						/>
						<Button
							variant='outlined'
							color={file ? 'error' : 'primary'}
							size='large'
							fullWidth
							component='label'
							role={undefined}
							onClick={e => {
								if (file) {
									e.preventDefault();
									setFile(null);
								}
							}}
							sx={{
								borderStyle: 'dashed',
								borderWidth: 2,
								paddingTop: 4,
								paddingBottom: 4,
								'&:hover': {
									borderStyle: 'dashed',
									borderWidth: 2,
								},
							}}
							startIcon={file ? <Close /> : <FileUpload />}>
							{file ? 'حذف فایل' : 'انتخاب فایل'}
							{!file && (
								<input
									onChange={e => {
										setFile(e.target.files[0]);
										fileNameRef.current =
											e.target.files[0].name;
									}}
									type='file'
									style={{ display: 'none' }}
								/>
							)}
						</Button>
						<Collapse
							in={file}
							unmountOnExit>
							<Typography
								style={{
									textAlign: 'center',
									display: 'block',
									width: 200,
									wordWrap: 'break-word',
								}}
								variant='body1'>
								{fileNameRef.current}
							</Typography>
							<Button
								size='small'
								fullWidth
								onClick={() => setShowFile(true)}>
								نمایش
							</Button>
						</Collapse>
						<Button
							fullWidth
							size='large'
							variant='contained'
							onClick={handleGoSubmit}
							disabled={!canSubmit}
							startIcon={<Save />}>
							ذخیره
						</Button>
						<Button
							fullWidth
							size='large'
							variant='outlined'
							onClick={handleReturn}
							startIcon={<Redo />}>
							بازگشت
						</Button>
					</Box>
				</Box>
			</Fade>
		</>
	);
};

export default NewAttachment;
