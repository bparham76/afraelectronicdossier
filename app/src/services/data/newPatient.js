export function patientReducer(state, action) {
	switch (action.type) {
		case 'firstName':
			return { ...state, firstName: action.payload };
		case 'lastName':
			return { ...state, lastName: action.payload };
		case 'nationalID':
			if (/^[0-9]{0,10}$/.test(action.payload))
				return { ...state, nationalID: action.payload };
			else return state;
		case 'bd':
			return { ...state, bd: action.payload };
		case 'bm':
			return { ...state, bm: action.payload };
		case 'by':
			return { ...state, by: action.payload };
		case 'phone':
			if (/^[0-9]{0,11}$/.test(action.payload))
				return { ...state, phone: action.payload };
			else return state;
		case 'landLine':
			if (/^[0-9]{0,11}$/.test(action.payload))
				return { ...state, landLine: action.payload };
			else return state;
		case 'address':
			return { ...state, address: action.payload };
		case 'gender':
			return { ...state, gender: action.payload };
		case 'init':
			return {
				id: action.payload.id,
				nationalID: action.payload.nationalID,
				firstName: action.payload.firstName,
				lastName: action.payload.lastName,
				gender: action.payload.gender,
				bd: action.payload.birthDate.split('/')[2] + '',
				bm: action.payload.birthDate.split('/')[1] + '',
				by: action.payload.birthDate.split('/')[0] + '',
				phone: action.payload.phone,
				landLine: action.payload.landLine,
				address: action.payload.address,
			};
		case 'full':
			return action.payload;
		default:
			throw Error('User reducer: Invalid data entry.');
	}
}

export const patientData = {
	nationalID: '',
	firstName: '',
	lastName: '',
	gender: 'none',
	bd: '0',
	bm: '0',
	by: '0',
	phone: '',
	landLine: '',
	address: '',
};
