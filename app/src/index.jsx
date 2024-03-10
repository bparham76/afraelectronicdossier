import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import RTL from './components/RTL';
import Theme from './components/Theme';
import AuthenticationSystem from './services/auth/AuthenticationSystem';

const root = ReactDOM.createRoot(document.getElementById('afra_app'));
root.render(
	<React.StrictMode>
		<AuthenticationSystem>
			<RTL>
				<Theme>
					<App />
				</Theme>
			</RTL>
		</AuthenticationSystem>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
