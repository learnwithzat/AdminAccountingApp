/** @format */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';

export default function CompaniesPage() {
	const router = useRouter();

	const [companies, setCompanies] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState<any | null>(null);
	const [saving, setSaving] = useState(false);

	// 🔐 Auth + Fetch
	useEffect(() => {
		const token = localStorage.getItem('token');

		if (!token) {
			router.replace('/login');
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

	// 🗓 Remaining days
	const getRemainingDays = (endDate: string) => {
		if (!endDate) return 0;
		const today = new Date();
		const end = new Date(endDate);
		const diff = (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
		return Math.ceil(diff);
	};

	// ⚡ Status
	const getStatus = (company: any) => {
		const days = getRemainingDays(company.trialEnd);
		if (company.plan === 'free') return 'free';
		if (days <= 0) return 'expired';
		if (days <= 3) return 'expiring';
		return 'active';
	};

	// 🎨 Plan Badge
	const getPlanBadge = (plan: string) => {
		switch (plan.toLowerCase()) {
			case 'free':
				return 'bg-gray-100 text-gray-700';
			case 'basic':
				return 'bg-blue-100 text-blue-700';
			case 'premium':
				return 'bg-purple-100 text-purple-700';
			default:
				return 'bg-gray-100 text-gray-700';
		}
	};

	// ✏️ Update Company
	const handleUpdate = async () => {
		setSaving(true);
		try {
			await API.put(`/company/${editing._id}`, editing);
			setEditing(null);
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
			<div>
				<h1 className='text-3xl font-bold'>Companies</h1>
				<p className='text-sm text-gray-500'>Manage plans and subscriptions</p>
			</div>

			{/* LIST */}
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
						<thead className='bg-gray-50 text-gray-600'>
							<tr>
								<th className='p-4 text-left'>Name</th>
								<th className='p-4 text-left'>Plan</th>
								<th className='p-4 text-left'>Expiry</th>
								<th className='p-4 text-left'>Remaining</th>
								<th className='p-4 text-left'>Status</th>
								<th className='p-4 text-left'>Actions</th>
							</tr>
						</thead>

						<tbody>
							{companies.map((c) => {
								const days = getRemainingDays(c.trialEnd);
								const status = getStatus(c);

								return (
									<tr
										key={c._id}
										className={`border-t hover:bg-gray-50 ${
											status === 'expiring' ? 'bg-yellow-50 animate-pulse' : ''
										}`}>
										<td className='p-4 font-medium'>{c.name}</td>

										<td className='p-4'>
											<span
												className={`px-2 py-1 text-xs rounded-full ${getPlanBadge(
													c.plan,
												)}`}>
												{c.plan.charAt(0).toUpperCase() + c.plan.slice(1)}
											</span>
										</td>

										<td className='p-4 text-gray-500'>{c.trialEnd}</td>

										<td className='p-4'>
											<span
												className={`font-medium ${
													days <= 0 ? 'text-red-600' : 'text-gray-800'
												}`}>
												{days <= 0 ? '0' : days} days
											</span>
										</td>

										<td className='p-4'>
											<span
												className={`px-2 py-1 text-xs rounded-full ${
													status === 'active' ? 'bg-green-100 text-green-700'
													: status === 'expired' ? 'bg-red-100 text-red-700'
													: 'bg-orange-100 text-orange-700'
												}`}>
												{status === 'expiring' ?
													'Expiring Soon'
												:	status.charAt(0).toUpperCase() + status.slice(1)}
											</span>
										</td>

										<td className='p-4'>
											<button
												onClick={() => setEditing({ ...c })}
												className='text-blue-600 hover:underline'>
												Manage
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				}
			</div>

			{/* EDIT MODAL */}
			{editing && (
				<div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
					<div className='bg-white rounded-2xl p-6 w-full max-w-md'>
						<h2 className='text-lg font-semibold mb-4'>Manage Company</h2>

						<div className='space-y-4'>
							{/* Plan */}
							<div>
								<label className='text-sm text-gray-500'>Plan</label>
								<select
									value={editing.plan}
									onChange={(e) =>
										setEditing({ ...editing, plan: e.target.value })
									}
									className='w-full border rounded-lg p-2 mt-1'>
									<option value='free'>Free</option>
									<option value='basic'>Basic</option>
									<option value='premium'>Premium</option>
								</select>
							</div>

							{/* Extend Expiry */}
							<div>
								<label className='text-sm text-gray-500'>Extend Expiry</label>
								<input
									type='date'
									value={editing.trialEnd || ''}
									onChange={(e) => {
										const newDate = e.target.value;
										setEditing({
											...editing,
											trialEnd: newDate,
											balanceDays: getRemainingDays(newDate),
										});
									}}
									className='w-full border rounded-lg p-2 mt-1'
								/>
							</div>
						</div>

						{/* Actions */}
						<div className='flex justify-end gap-2 mt-6'>
							<button
								onClick={() => setEditing(null)}
								className='px-4 py-2 border rounded-lg'>
								Cancel
							</button>

							<button
								onClick={handleUpdate}
								disabled={saving}
								className='px-4 py-2 bg-blue-600 text-white rounded-lg'>
								{saving ? 'Saving...' : 'Save'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
