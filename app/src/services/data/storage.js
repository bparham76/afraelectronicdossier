export function storageReducer(state, action) {
	switch (action.type) {
		case 'B2':
			return { ...state, B2: action.payload };
		case 'Opium':
			return { ...state, Opium: action.payload };
		case 'Metadon':
			return { ...state, Metadon: action.payload };
		case 'init':
			const B2 = action.payload?.find(p => p.drug == 'b2')?.cap;
			const Metadon = action.payload?.find(p => p.drug == 'metadon')?.cap;
			const Opium = action.payload?.find(p => p.drug == 'opium')?.cap;
			return { B2: B2, Opium: Opium, Metadon: Metadon };
		case 'full':
			return action.payload;
		default:
			throw Error('Storage reducer: Invalid data entry.');
	}
}

export const storageData = {
	B2: 0,
	Opium: 0,
	Metadon: 0,
};
