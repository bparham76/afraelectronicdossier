import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

const catchRtl = createCache({
	key: 'muirtl',
	stylisPlugins: [prefixer, rtlPlugin],
});

const RTL = ({ children }) => {
	return <CacheProvider value={catchRtl}>{children}</CacheProvider>;
};

export default RTL;
