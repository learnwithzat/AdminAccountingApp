/** @format */

'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/api';

export default function DashboardPage() {
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await API.get('/company');
				setCount(res.data.length);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
				<p className='text-sm text-gray-500'>Overview of your system</p>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				<div className='bg-white p-6 rounded-2xl border shadow-sm'>
					<h2 className='text-sm text-gray-500 mb-2'>Total Companies</h2>

					{loading ?
						<div className='h-8 w-20 bg-gray-100 animate-pulse rounded' />
					:	<p className='text-3xl font-bold'>{count}</p>}
				</div>

				<div className='bg-white p-6 rounded-2xl border opacity-50'>
					<h2 className='text-sm text-gray-500 mb-2'>Users</h2>
					<p className='text-3xl font-bold'>—</p>
				</div>

				<div className='bg-white p-6 rounded-2xl border opacity-50'>
					<h2 className='text-sm text-gray-500 mb-2'>Revenue</h2>
					<p className='text-3xl font-bold'>—</p>
				</div>
			</div>

			{/* Activity */}
			<div className='bg-white p-6 rounded-2xl border shadow-sm'>
				<h2 className='font-semibold mb-4'>Recent Activity</h2>

				{loading ?
					<div className='space-y-3'>
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className='h-10 bg-gray-100 animate-pulse rounded'
							/>
						))}
					</div>
				:	<p className='text-gray-500 text-sm'>No activity yet</p>}
			</div>
		</div>
	);
}
