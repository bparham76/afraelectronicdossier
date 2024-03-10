import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthenticationSystem = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [token, setToken] = useState(null);
	const [canView, setCanView] = useState(false);

	useEffect(() => {
		const _token = sessionStorage.getItem('token');
		if (typeof _token == 'string') {
			setToken(_token);
			setIsAuthenticated(true);
		}
		setCanView(true);
	}, []);

	if (!canView) return;

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, token, setIsAuthenticated, setToken }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthenticationSystem;

export const useAuthState = () => useContext(AuthContext).isAuthenticated;

export const useLogin = () => {
	const { setToken, setIsAuthenticated } = useContext(AuthContext);

	return async (username, password) => {
		try {
			const response = await axios.post('/auth', {
				username: username,
				password: password,
			});

			if (response.status < 400) {
				setIsAuthenticated(true);
				setToken(response?.data?.token);
				sessionStorage.setItem('token', response?.data?.token);
				return true;
			} else return false;
		} catch {
			return false;
		}
	};
};
