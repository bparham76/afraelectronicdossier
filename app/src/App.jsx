import axios from 'axios';
import Authentication from './pages/Authentication';
import { useAuthState } from './services/auth/AuthenticationSystem';
import Router from './services/routing/Router';
import { useEffect } from 'react';

function App() {
	const { isAuthenticated } = useAuthState();

	useEffect(() => {
		// for local server
		// axios.defaults.baseURL = window.location.href.replace('3000', '4000');

		// for local binary app
		axios.defaults.baseURL =
			document.querySelector('#afra_app')?.getAttribute('data-server') ||
			'';
	}, []);

	return isAuthenticated ? <Router /> : <Authentication />;
}

export default App;
