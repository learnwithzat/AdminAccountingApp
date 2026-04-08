/** @format */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';

export default function CompaniesPage() {
	const router = useRouter();

	const [companies, setCompanies] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const [form, setForm] = useState({
		name: '',
		plan: '',
		trialStart: '',
		trialEnd: '',
		balanceDays: 0,
	});

	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('token');

		if (!token) {
			router.push('/login');
			return;
		}

		fetchCompanies();
	}, []);

	const fetchCompanies = async () => {
		try {
			const res = await API.get('/company');
			setCompanies(res.data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setSaving(true);

		try {
			await API.post('/company/register', form);
			setForm({
				name: '',
				plan: '',
				trialStart: '',
				trialEnd: '',
				balanceDays: 0,
			});
			fetchCompanies();
		} catch (err) {
			console.error(err);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className='space-y-6 p-6'>
			<h1 className='text-3xl font-bold'>Companies</h1>

			{/* FORM */}
			<div className='bg-white p-6 rounded-2xl border shadow-sm'>
				<form
					onSubmit={handleSubmit}
					className='grid md:grid-cols-3 gap-4'>
					<input
						type='text'
						placeholder='Company Name'
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						className='border p-2 rounded-lg'
						required
					/>

					<input
						type='text'
						placeholder='Plan'
						value={form.plan}
						onChange={(e) => setForm({ ...form, plan: e.target.value })}
						className='border p-2 rounded-lg'
						required
					/>
					<input
						type='date'
						placeholder='Trial Start'
						value={form.trialStart}
						onChange={(e) => setForm({ ...form, trialStart: e.target.value })}
						className='border p-2 rounded-lg'
					/>

					<input
						type='date'
						placeholder='Trial End'
						value={form.trialEnd}
						onChange={(e) => setForm({ ...form, trialEnd: e.target.value })}
						className='border p-2 rounded-lg'
					/>

					<button
						type='submit'
						className='bg-blue-600 text-white rounded-lg'>
						{saving ? 'Creating...' : 'Create'}
					</button>
				</form>
			</div>

			{/* LIST */}
			<div className='bg-white rounded-2xl border shadow-sm'>
				{loading ?
					<div className='p-6 space-y-2'>
						{[...Array(5)].map((_, i) => (
							<div
								key={i}
								className='h-8 bg-gray-100 animate-pulse rounded'
							/>
						))}
					</div>
				:	<table className='w-full'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='p-4 text-left'>Name</th>
								<th className='p-4 text-left'>Plan</th>
								<th className='p-4 text-left'>Trial Start</th>
								<th className='p-4 text-left'>Trial End</th>
								<th className='p-4 text-left'>Balance Days</th>
							</tr>
						</thead>

						<tbody>
							{companies.map((c, i) => (
								<tr
									key={i}
									className='border-t'>
									<td className='p-4'>{c.name}</td>
									<td className='p-4'>{c.plan}</td>
									<td className='p-4'>{c.trialStart}</td>
									<td className='p-4'>{c.trialEnd}</td>
									<td className='p-4'>{c.balanceDays}</td>
								</tr>
							))}
						</tbody>
					</table>
				}
			</div>
		</div>
	);
}
