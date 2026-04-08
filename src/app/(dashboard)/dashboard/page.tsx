/** @format */

'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/api';

export default function DashboardPage() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		API.get('/company').then((res) => setCount(res.data.length));
	}, []);

	return (
		<div>
			<h1 className='text-2xl font-bold mb-4'>Dashboard</h1>

			<div className='bg-white p-6 rounded shadow'>
				Total Companies: {count}
			</div>
		</div>
	);
}
