import { useState } from 'react';
import {
	AppBar,
	IconButton,
	Box,
	Avatar,
	Typography,
	Container,
	Toolbar,
	Tooltip,
	Menu,
	MenuItem,
} from '@mui/material';
import { LightMode, DarkMode, Logout, Apps } from '@mui/icons-material';
import AppIcon from '../maple-white.png';
import { useLogout } from '../services/auth/AuthenticationSystem';
import { useColorScheme } from './Theme';
import { useNavigate } from 'react-router-dom';

const AppHeader = ({ user, menu }) => {
	const commenceLogout = useLogout();
	const [isDark, toggleColorScheme] = useColorScheme();
	const [menuAnchor, setMenuAnchor] = useState(null);
	const menuOpen = Boolean(menuAnchor);
	const handleOpenMenu = e => setMenuAnchor(e.currentTarget);
	const handleCloseMenu = () => setMenuAnchor(null);
	const navigate = useNavigate();

	return (
		<AppBar position='sticky'>
			<Container>
				<Toolbar disableGutters>
					<Avatar
						src={AppIcon}
						alt='fuck'
					/>
					<Typography
						ml={2}
						variant='h6'
						noWrap>
						سیستم پرونده الکترونیک افرا
					</Typography>
					<Box
						sx={{
							display: 'flex',
							flexGrow: 1,
							gap: 2,
							justifyContent: 'end',
						}}>
						<Tooltip title='منو'>
							<IconButton
								onClick={handleOpenMenu}
								sx={{
									color: 'white',
								}}>
								<Apps />
							</IconButton>
						</Tooltip>
						<Menu
							open={menuOpen}
							anchorEl={menuAnchor}
							onClose={handleCloseMenu}>
							{menu?.map((item, index) => (
								<MenuItem
									key={index}
									onClick={() => navigate(item?.href)}>
									{item?.title}
								</MenuItem>
							))}
						</Menu>
						<Tooltip title={isDark ? 'حالت روشن' : 'حالت تاریک'}>
							<IconButton
								sx={{
									color: 'white',
								}}
								onClick={toggleColorScheme}>
								{!isDark ? <DarkMode /> : <LightMode />}
							</IconButton>
						</Tooltip>
						<Tooltip title='خروج'>
							<IconButton
								sx={{
									color: 'white',
								}}
								onClick={commenceLogout}>
								<Logout />
							</IconButton>
						</Tooltip>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default AppHeader;
