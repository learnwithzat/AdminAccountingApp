/** @format */

import './globals.css';
import { ReactNode } from 'react';
import ClientLayout from '@/components/layout/ClientLayout';

export const metadata = {
	title: 'Zatgo Admin',
	description: 'Manage Companies',
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<body>
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
