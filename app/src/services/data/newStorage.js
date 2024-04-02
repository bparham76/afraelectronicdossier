export function newStorageReducer(state, action) {
	switch (action.type) {
		case 'B2':
			if (/^[\d]{0,5}$/.test(action.payload))
				return { ...state, B2: parseInt(action.payload) };
		case 'Metadon':
			if (/^[\d]{0,5}$/.test(action.payload))
				return { ...state, Metadon: parseInt(action.payload) };
		case 'Opium':
			if (/^[\d]{0,5}$/.test(action.payload))
				return { ...state, Opium: parseInt(action.payload) };
		case 'year':
			return { ...state, year: parseInt(action.payload) };
		case 'month':
			return { ...state, month: parseInt(action.payload) };
		case 'day':
			return { ...state, day: parseInt(action.payload) };
		default:
			throw new Error('new storage reducer error, invalid action type.');
	}
}

export const newStorageData = {
	B2: 0,
	Opium: 0,
	Metadon: 0,
	year: 0,
	month: 0,
	day: 0,
};
