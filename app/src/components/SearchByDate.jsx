import { useState } from 'react';
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

const SearchByDate = ({ open = false, onClose }) => {
	const [isRange, setIsRange] = useState(false);

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
							checked={isRange}
							defaultChecked={false}
							onChange={e => setIsRange(e.target.checked)}
						/>
					</Typography>
				</DialogContentText>
				<Collapse
					in={isRange}
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
						defaultValue={0}>
						<MenuItem value={0}>روز</MenuItem>
						{[...new Array(30)].map((_, i) => (
							<MenuItem
								value={i + 1}
								key={i}>
								{i + 1}
							</MenuItem>
						))}
					</Select>
					<Select
						style={{ width: 100 }}
						defaultValue={0}>
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
						defaultValue={0}>
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
				<Collapse in={isRange}>
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
							defaultValue={0}>
							<MenuItem value={0}>روز</MenuItem>
							{[...new Array(30)].map((_, i) => (
								<MenuItem
									value={i + 1}
									key={i}>
									{i + 1}
								</MenuItem>
							))}
						</Select>
						<Select
							style={{ width: 100 }}
							defaultValue={0}>
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
							defaultValue={0}>
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
					disabled
					variant='contained'>
					جستجو
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default SearchByDate;
