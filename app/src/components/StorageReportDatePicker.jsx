import {
	Dialog,
	DialogContent,
	DialogActions,
	DialogTitle,
	Typography,
	Button,
	Select,
	MenuItem,
	Box,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { months } from '../data/calendar';

const StorageReportDatePicker = ({ view = 'none', onCancel }) => {
	const navigate = useNavigate();
	const [year, setYear] = useState(0);
	const [month, setMonth] = useState(0);

	useEffect(() => {
		if (view !== 'none') return;
		setYear(0);
		setMonth(0);
	}, [view]);

	const goToReports = () =>
		navigate(
			'/storage/report/view?year=' +
				year +
				(view === 'month' ? '&month=' + month : '')
		);

	return (
		<Dialog
			slotProps={{ backdrop: { style: { backdropFilter: 'blur(3px)' } } }}
			open={view !== 'none'}>
			<DialogTitle>
				<Typography variant='h6'>
					{view === 'year' ? 'گزارش سالانه' : 'گزارش ماهانه'}
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Box
					sx={{
						marginTop: 2,
						marginBottom: 2,
						display: 'flex',
						gap: 2,
						alignItems: 'center',
						justifyContent: 'center',
						width: 250,
					}}>
					{view === 'month' && (
						<Select
							style={{ width: 100 }}
							value={month}
							onChange={e => setMonth(e.target.value)}>
							<MenuItem value={0}>ماه</MenuItem>
							{months.map(m => (
								<MenuItem
									value={m.id}
									key={m.id}>
									{m.name}
								</MenuItem>
							))}
						</Select>
					)}
					<Select
						style={{ width: 100 }}
						value={year}
						onChange={e => setYear(e.target.value)}>
						<MenuItem value={0}>سال</MenuItem>
						{[...new Array(50)].map((_, i) => (
							<MenuItem
								value={i + 1390}
								key={i}>
								{i + 1390}
							</MenuItem>
						))}
					</Select>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel}>انصراف</Button>
				<Button
					onClick={goToReports}
					disabled={year === 0 || (view === 'month' && month === 0)}>
					نمایش
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default StorageReportDatePicker;
