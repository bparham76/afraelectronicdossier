import { Grid, Button, ButtonGroup, Typography, Fade } from '@mui/material';
import { Delete, Edit, Redo } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DataTable from '../components/DataTable';

const ViewDossier = () => {
	const navigate = useNavigate();
	const params = useSearchParams();

	const isQueue = params[0].get('action') !== null;

	const receptionsHeader = [
		{
			field: 'id',
			headerName: 'شماره',
			width: 100,
		},
		{
			field: 'dateTime',
			headerName: 'تاریخ',
			width: 100,
		},
		{
			field: 'drugDose',
			headerName: 'مقدار تجویز',
			width: 100,
		},
	];

	return (
		<Fade
			in={true}
			unmountOnExit>
			<Grid
				container
				spacing={4}>
				<Grid
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
					}}
					item
					xs={12}>
					<Typography
						width='auto'
						variant='h4'>
						مشاهده جزئیات پرونده
					</Typography>
					<ButtonGroup>
						<Button
							variant='outlined'
							startIcon={<Edit />}>
							ویرایش
						</Button>
						<Button
							variant='outlined'
							color='error'
							startIcon={<Delete />}>
							حذف
						</Button>
						<Button
							onClick={() =>
								navigate(
									isQueue ? '/dossiers/queue' : '/dossiers'
								)
							}
							variant='outlined'
							startIcon={<Redo />}>
							بازگشت
						</Button>
					</ButtonGroup>
				</Grid>
				<Grid
					item
					xs={4}>
					<Typography
						variant='h6'
						mb={1}>
						مشخصات بیمار
					</Typography>
				</Grid>
				{!isQueue && (
					<>
						<Grid
							item
							xs={4}>
							<Typography
								variant='h6'
								mb={1}>
								پیوست ها
							</Typography>
							<DataTable header={attachmentsHeader} />
						</Grid>
						<Grid
							item
							xs={4}>
							<Typography
								variant='h6'
								mb={1}>
								مراجعات بیمار
							</Typography>
							<DataTable header={receptionsHeader} />
						</Grid>
					</>
				)}
			</Grid>
		</Fade>
	);
};

export default ViewDossier;

const attachmentsHeader = [
	{
		field: 'id',
		headerName: 'شماره',
		width: 100,
	},
	{
		field: 'title',
		headerName: 'عنوان',
		width: 200,
	},
];
