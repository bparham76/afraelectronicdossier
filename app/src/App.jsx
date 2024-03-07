import axios from 'axios';
import TextField from '@mui/material/TextField';
import Authentication from './pages/Authentication';
import { useAuthState } from './services/auth/AuthenticationSystem';

function App() {
	const isAuthenticated = useAuthState();

	axios.defaults.baseURL =
		document.querySelector('#afra_app')?.getAttribute('data-server') || '';

	return isAuthenticated ? <h1>App Router</h1> : <Authentication />;
}

export default App;
