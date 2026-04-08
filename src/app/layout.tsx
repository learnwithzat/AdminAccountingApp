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
			<body className='bg-gray-500'>{children}</body>
		</html>
	);
}
