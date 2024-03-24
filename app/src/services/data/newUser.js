export function userReducer(state, action) {
	switch (action.type) {
		case 'firstname':
			return { ...state, firstName: action.payload };
		case 'lastname':
			return { ...state, lastName: action.payload };
		case 'username':
			return { ...state, username: action.payload };
		case 'password':
			return { ...state, password: action.payload };
		case 'role':
			return { ...state, role: action.payload };
		case 'state':
			return { ...state, state: action.payload };
		default:
			throw Error('User reducer: Invalid data entry.');
	}
}

export const userData = {
	firstName: '',
	lastName: '',
	username: '',
	password: '',
	role: 'none',
	state: 'none',
};
