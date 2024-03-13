import axios from 'axios';
import Authentication from './pages/Authentication';
import { useAuthState } from './services/auth/AuthenticationSystem';
import Router from './services/routing/Router';

function App() {
	const { isAuthenticated } = useAuthState();

	axios.defaults.baseURL =
		document.querySelector('#afra_app')?.getAttribute('data-server') || '';

	return isAuthenticated ? <Router /> : <Authentication />;
}

export default App;
