import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Switch,
	Box,
	Select,
	MenuItem,
	Collapse,
	Typography,
} from '@mui/material';

import { months } from '../data/calendar';

const SearchByDate = ({
	open = false,
	onClose,
	dateData,
	dateDispatch,
	onSubmit,
}) => {
	const [canSubmit, setCanSubmit] = useState(false);

	useEffect(() => {
		if (!dateData.isRange) {
			if (dateData.year > 0 && dateData.month > 0 && dateData.day > 0)
				setCanSubmit(true);
			else setCanSubmit(false);
		} else {
			if (
				dateData.year > 0 &&
				dateData.month > 0 &&
				dateData.day > 0 &&
				dateData.toYear >= dateData.year &&
				dateData.toMonth > 0 &&
				dateData.toDay > 0
			)
				setCanSubmit(true);
			else setCanSubmit(false);
		}
	}, [dateData]);

	return (
		<Dialog
			slotProps={{
				backdrop: {
					sx: {
						backdropFilter: 'blur(3px)',
					},
				},
			}}
			onClose={onClose}
			PaperProps={{ style: { borderRadius: 8 } }}
			open={open}>
			<DialogTitle>جستجو</DialogTitle>
			<DialogContent>
				<DialogContentText>
					<Typography variant='body1'>
						جستجو بر اساس بازه تاریخی
						<Switch
							checked={dateData.isRange}
							defaultChecked={false}
							onChange={e =>
								dateDispatch({
									type: 'isRange',
									payload: e.target.checked,
								})
							}
						/>
					</Typography>
				</DialogContentText>
				<Collapse
					in={dateData.isRange}
					unmountOnExit>
					<Typography variant='body1'>از تاریخ:</Typography>
				</Collapse>
				<Box
					sx={{
						marginTop: 2,
						marginBottom: 2,
						display: 'flex',
						gap: 2,
						alignItems: 'center',
						justifyContent: 'space-between',
					}}>
					<Select
						style={{ width: 100 }}
						value={dateData.day}
						onChange={e =>
							dateDispatch({
								type: 'day',
								payload: e.target.value,
							})
						}>
						<MenuItem value={0}>روز</MenuItem>
						{[...new Array(31)].map((_, i) => (
							<MenuItem
								value={i + 1}
								key={i}>
								{i + 1}
							</MenuItem>
						))}
					</Select>
					<Select
						style={{ width: 100 }}
						value={dateData.month}
						onChange={e =>
							dateDispatch({
								type: 'month',
								payload: e.target.value,
							})
						}>
						<MenuItem value={0}>ماه</MenuItem>
						{months.map(m => (
							<MenuItem
								value={m.id}
								key={m.id}>
								{m.name}
							</MenuItem>
						))}
					</Select>
					<Select
						style={{ width: 100 }}
						value={dateData.year}
						onChange={e =>
							dateDispatch({
								type: 'year',
								payload: e.target.value,
							})
						}>
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
				<Collapse in={dateData.isRange}>
					<Typography variant='body1'>تا تاریخ:</Typography>
					<Box
						sx={{
							marginTop: 2,
							display: 'flex',
							gap: 2,
							alignItems: 'center',
							justifyContent: 'space-between',
						}}>
						<Select
							style={{ width: 100 }}
							value={dateData.toDay}
							onChange={e =>
								dateDispatch({
									type: 'toDay',
									payload: e.target.value,
								})
							}>
							<MenuItem value={0}>روز</MenuItem>
							{[...new Array(31)].map((_, i) => (
								<MenuItem
									value={i + 1}
									key={i}>
									{i + 1}
								</MenuItem>
							))}
						</Select>
						<Select
							style={{ width: 100 }}
							value={dateData.toMonth}
							onChange={e =>
								dateDispatch({
									type: 'toMonth',
									payload: e.target.value,
								})
							}>
							<MenuItem value={0}>ماه</MenuItem>
							{months.map(m => (
								<MenuItem
									value={m.id}
									key={m.id}>
									{m.name}
								</MenuItem>
							))}
						</Select>
						<Select
							style={{ width: 100 }}
							value={dateData.toYear}
							onChange={e =>
								dateDispatch({
									type: 'toYear',
									payload: e.target.value,
								})
							}>
							<MenuItem value={0}>سال</MenuItem>
							{[...new Array(30)].map((_, i) => (
								<MenuItem
									value={i + 1390}
									key={i}>
									{i + 1390}
								</MenuItem>
							))}
						</Select>
					</Box>
				</Collapse>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>بستن</Button>
				<Button
					onClick={() => {
						onClose();
						onSubmit();
					}}
					disabled={!canSubmit}
					variant='contained'>
					جستجو
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default SearchByDate;
