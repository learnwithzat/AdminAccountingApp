/** @format */

'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/api';

export default function CompaniesPage() {
	const [companies, setCompanies] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const [form, setForm] = useState({
		name: '',
		email: '',
	});

	const [saving, setSaving] = useState(false);

	// Fetch
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

	useEffect(() => {
		fetchCompanies();
	}, []);

	// Create
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setSaving(true);

		try {
			await API.post('/company/register', form);
			setForm({ name: '', email: '' });
			fetchCompanies();
		} catch (err) {
			console.error(err);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Companies</h1>
			</div>

			{/* Form */}
			<div className='bg-white p-6 rounded-2xl border shadow-sm'>
				<h2 className='font-semibold mb-4'>Add Company</h2>

				<form
					onSubmit={handleSubmit}
					className='grid md:grid-cols-3 gap-4 items-end'>
					<input
						type='text'
						placeholder='Company Name'
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						className='border rounded-lg p-2'
						required
					/>

					<input
						type='email'
						placeholder='Email'
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						className='border rounded-lg p-2'
						required
					/>

					<button
						type='submit'
						disabled={saving}
						className='bg-blue-600 text-white rounded-lg px-4 py-2'>
						{saving ? 'Creating...' : 'Create'}
					</button>
				</form>
			</div>

			{/* List */}
			<div className='bg-white rounded-2xl border shadow-sm'>
				<div className='p-6 border-b'>
					<h2 className='font-semibold'>Company List</h2>
				</div>

				{loading ?
					<div className='p-6 space-y-3'>
						{[...Array(5)].map((_, i) => (
							<div
								key={i}
								className='h-10 bg-gray-100 animate-pulse rounded'
							/>
						))}
					</div>
				: companies.length === 0 ?
					<div className='p-10 text-center text-gray-500'>
						No companies found
					</div>
				:	<table className='w-full text-sm'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='p-4 text-left'>Name</th>
								<th className='p-4 text-left'>Email</th>
							</tr>
						</thead>

						<tbody>
							{companies.map((c, i) => (
								<tr
									key={i}
									className='border-t hover:bg-gray-50'>
									<td className='p-4 font-medium'>{c.name}</td>
									<td className='p-4 text-gray-600'>{c.email}</td>
								</tr>
							))}
						</tbody>
					</table>
				}
			</div>
		</div>
	);
}
