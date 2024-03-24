import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthenticationSystem = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [token, setToken] = useState(null);
	const [role, setRole] = useState('');
	const [canView, setCanView] = useState(false);

	useEffect(() => {
		const _token = sessionStorage.getItem('token');
		const _role = sessionStorage.getItem('role');
		if (typeof _token == 'string' && typeof _role == 'string') {
			setToken(_token);
			setRole(_role);
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
		setCanView(true);
	}, []);

	if (!canView) return;

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				token,
				setIsAuthenticated,
				setToken,
				role,
				setRole,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthenticationSystem;

export const useAuthState = () => {
	const { isAuthenticated, role, token } = useContext(AuthContext);
	return { isAuthenticated, role, token };
};

export const useLogin = () => {
	const { setToken, setRole, setIsAuthenticated } = useContext(AuthContext);

	return async (username = '', password = '') => {
		try {
			const response = await axios.post('/auth', {
				username: username,
				password: password,
			});

			if (response?.status < 400) {
				setIsAuthenticated(true);
				setToken(response?.data?.token);
				setRole(response?.data?.role);
				sessionStorage.setItem('token', response?.data?.token);
				sessionStorage.setItem('role', response?.data?.role);
				return true;
			} else return false;
		} catch {
			return false;
		}
	};
};

export const useLogout = () => {
	const { token, setToken, setRole, setIsAuthenticated } =
		useContext(AuthContext);
	return async () => {
		try {
			const response = await axios.delete('/auth', {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			});

			if (response?.status < 400) {
				setIsAuthenticated(false);
				setToken(null);
				setRole(null);
				sessionStorage.removeItem('token');
				sessionStorage.removeItem('role');
				return true;
			} else return false;
		} catch {
			return false;
		}
	};
};
