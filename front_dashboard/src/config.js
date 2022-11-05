let config;
if (import.meta.env.MODE === 'production') {
	config = { BACKEND: '', X: '' };
} else {
	config = { BACKEND: 'http://localhost:5500', X: '' };
}

export default config;
