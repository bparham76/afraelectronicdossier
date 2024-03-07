import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const AuthenticationSystem = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	return (
		<AuthContext.Provider value={{ isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthenticationSystem;

export const useAuthState = () => useContext(AuthContext).isAuthenticated;
