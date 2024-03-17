import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import React from 'react';

const DataTable = ({ header = null, data = [] }) => {
	if (!header) return;

	return (
		<Box sx={{ height: '70vh', width: '100%' }}>
			<DataGrid
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
