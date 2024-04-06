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
import appData from '../data/app.json';

const AppHeader = ({ menu }) => {
	const commenceLogout = useLogout();
	const [isDark, toggleColorScheme] = useColorScheme();
	const [menuAnchor, setMenuAnchor] = useState(null);
	const menuOpen = Boolean(menuAnchor);
	const handleOpenMenu = e => setMenuAnchor(e.currentTarget);
	const handleCloseMenu = () => setMenuAnchor(null);
	const navigate = useNavigate();

	const goTo = href => {
		navigate(href);
		handleCloseMenu();
	};

	const logout = () => {
		commenceLogout().then(() => {
			navigate('/');
		});
	};

	return (
		<AppBar
			position='sticky'
			className='print_hide'>
			<Container>
				<Toolbar disableGutters>
					<Avatar
						style={{ userSelect: 'none', cursor: 'default' }}
						src={AppIcon}
						alt={appData.fav_alt}
					/>
					<Typography
						ml={2}
						variant='h6'
						style={{ cursor: 'default', userSelect: 'none' }}
						noWrap>
						{appData.app_name}
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
									onClick={() => goTo(item?.href)}>
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
								onClick={logout}>
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
