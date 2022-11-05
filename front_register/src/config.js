let config;
if (import.meta.env.MODE === 'production') {
	config = { BACKEND: '' };
} else {
	config = { BACKEND: 'http://localhost:5500' };
}

export default config;
