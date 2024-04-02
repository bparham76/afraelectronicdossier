export function searchDateReducer(state, action) {
	switch (action.type) {
		case 'isRange':
			return { ...state, isRange: Boolean(action.payload) };
		case 'day':
			return { ...state, day: parseInt(action.payload) };
		case 'month':
			return { ...state, month: parseInt(action.payload) };
		case 'year':
			return { ...state, year: parseInt(action.payload) };
		case 'toDay':
			return { ...state, toDay: parseInt(action.payload) };
		case 'toMonth':
			return { ...state, toMonth: parseInt(action.payload) };
		case 'toYear':
			return { ...state, toYear: parseInt(action.payload) };
		case 'clear':
			return searchDateData;
		default:
			throw new Error('searchDate reducer: invalid action type');
	}
}

export const searchDateData = {
	isRange: false,
	day: 0,
	month: 0,
	year: 0,
	toDay: 0,
	toMonth: 0,
	toYear: 0,
};
