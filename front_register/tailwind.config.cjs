/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			animation: {
				'fade-in': 'fadeIn 1.5s ease-in-out',
			},
			keyframes: () => ({
				fadeIn: {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
			}),
		},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['halloween'],
	},
};
