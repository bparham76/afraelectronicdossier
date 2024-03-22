import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const DataTable = ({ header = null, data = [], height = null, onRowClick }) => {
	if (!header) return;

	return (
		<Box sx={{ height: height ? height : '70vh', width: '100%' }}>
			<DataGrid
				onRowClick={e =>
					typeof onRowClick === 'function' && onRowClick(e)
				}
				columns={header}
				rows={data}
				localeText={{
					noRowsLabel: 'داده ای برای نمایش وجود ندارد.',
					columnHeaderSortIconLabel: 'مرتب سازی',
				}}
				hideFooter
				disableColumnMenu
			/>
		</Box>
	);
};

export default DataTable;
