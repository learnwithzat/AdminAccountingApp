/** @format */

import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
	title: 'Zatgo',
	description: 'SaaS Admin',
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<link
					rel='preconnect'
					href='https://fonts.googleapis.com'
				/>
				<link
					rel='preconnect'
					href='https://fonts.gstatic.com'
					crossOrigin='anonymous'
				/>
				<link
					href='https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&family=DM+Mono:wght@400;500&display=swap'
					rel='stylesheet'
				/>
			</head>
			<body className='bg-[#f5f4f0]'>{children}</body>
		</html>
	);
}
