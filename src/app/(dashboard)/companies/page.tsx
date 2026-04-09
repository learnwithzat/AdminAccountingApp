/** @format */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function CompaniesPage() {
	const router = useRouter();

	const [companies, setCompanies] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState<any | null>(null);
	const [saving, setSaving] = useState(false);
	const [search, setSearch] = useState('');
	const [filterPlan, setFilterPlan] = useState('all');

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

	const getRemainingDays = (endDate: string) => {
		if (!endDate) return 0;
		const diff =
			(new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
		return Math.ceil(diff);
	};

	const getStatus = (company: any) => {
		const days = getRemainingDays(company.trialEnd);
		if (company.plan === 'free') return 'free';
		if (days <= 0) return 'expired';
		if (days <= 3) return 'expiring';
		return 'active';
	};

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

	const filtered = companies.filter((c) => {
		const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
		const matchPlan = filterPlan === 'all' || c.plan === filterPlan;
		return matchSearch && matchPlan;
	});

	const planBadge = (plan: string) => {
		switch (plan.toLowerCase()) {
			case 'free':
				return 'bg-black/[0.06] text-black/40';
			case 'basic':
				return 'bg-blue-50 text-blue-600';
			case 'premium':
				return 'bg-purple-50 text-purple-600';
			default:
				return 'bg-black/[0.06] text-black/40';
		}
	};

	const statusConfig: Record<string, { label: string; class: string }> = {
		active: { label: 'Active', class: 'bg-green-50 text-green-600' },
		expired: { label: 'Expired', class: 'bg-red-50 text-red-600' },
		expiring: { label: 'Expiring', class: 'bg-amber-50 text-amber-600' },
		free: { label: 'Free', class: 'bg-black/[0.06] text-black/40' },
	};

	return (
		<>
			<div
				className='space-y-6'
				style={{ fontFamily: "'DM Sans', sans-serif" }}>
				{/* Header */}
				<div className='flex items-start justify-between'>
					<div>
						<h1 className='text-2xl font-semibold text-[#111110] tracking-tight'>
							Companies
						</h1>
						<p className='text-sm text-black/40 mt-1'>
							{loading ? '—' : `${companies.length} total`} · Manage plans &
							subscriptions
						</p>
					</div>
				</div>

				{/* Filters */}
				<div className='flex flex-col sm:flex-row gap-3'>
					<div className='relative flex-1'>
						<Search
							size={15}
							className='absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30'
						/>
						<input
							type='text'
							placeholder='Search companies...'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className='w-full bg-white border border-black/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#111110] placeholder:text-black/25 outline-none focus:border-black/20 focus:ring-2 focus:ring-black/[0.04] transition-all'
						/>
					</div>
					<div className='flex items-center gap-2'>
						<SlidersHorizontal
							size={14}
							className='text-black/30'
						/>
						<select
							value={filterPlan}
							onChange={(e) => setFilterPlan(e.target.value)}
							className='bg-white border border-black/[0.08] rounded-xl px-3 py-2.5 text-sm text-[#111110] outline-none focus:border-black/20 transition-all cursor-pointer'>
							<option value='all'>All plans</option>
							<option value='free'>Free</option>
							<option value='basic'>Basic</option>
							<option value='premium'>Premium</option>
						</select>
					</div>
				</div>

				{/* Table */}
				<div className='bg-white rounded-2xl border border-black/[0.06] overflow-hidden'>
					{loading ?
						<div className='p-6 space-y-3'>
							{[...Array(5)].map((_, i) => (
								<div
									key={i}
									className='h-12 bg-black/[0.03] rounded-xl animate-pulse'
								/>
							))}
						</div>
					: filtered.length === 0 ?
						<div className='py-20 text-center'>
							<p className='text-sm text-black/30'>
								{search || filterPlan !== 'all' ?
									'No companies match your filters'
								:	'No companies found'}
							</p>
						</div>
					:	<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead>
									<tr className='border-b border-black/[0.05]'>
										{[
											'Company',
											'Plan',
											'Expiry Date',
											'Days Left',
											'Status',
											'',
										].map((h, i) => (
											<th
												key={i}
												className='px-6 py-3.5 text-left text-[10px] uppercase tracking-widest text-black/30 font-medium'>
												{h}
											</th>
										))}
									</tr>
								</thead>

								<tbody className='divide-y divide-black/[0.04]'>
									{filtered.map((c) => {
										const days = getRemainingDays(c.trialEnd);
										const status = getStatus(c);
										const initials = c.name
											.split(' ')
											.map((w: string) => w[0])
											.join('')
											.slice(0, 2)
											.toUpperCase();

										return (
											<tr
												key={c._id}
												className={`hover:bg-black/[0.015] transition-colors ${
													status === 'expiring' ? 'bg-amber-50/40' : ''
												}`}>
												<td className='px-6 py-4'>
													<div className='flex items-center gap-3'>
														<div className='w-7 h-7 rounded-full bg-[#111110] flex items-center justify-center flex-shrink-0'>
															<span className='text-white text-[10px] font-semibold'>
																{initials}
															</span>
														</div>
														<span className='text-sm font-medium text-[#111110]'>
															{c.name}
														</span>
													</div>
												</td>

												<td className='px-6 py-4'>
													<span
														className={`text-xs font-medium px-2.5 py-1 rounded-full ${planBadge(c.plan)}`}>
														{c.plan.charAt(0).toUpperCase() + c.plan.slice(1)}
													</span>
												</td>

												<td className='px-6 py-4 text-sm text-black/40'>
													{c.trialEnd ?
														new Date(c.trialEnd).toLocaleDateString('en-US', {
															month: 'short',
															day: 'numeric',
															year: 'numeric',
														})
													:	'—'}
												</td>

												<td className='px-6 py-4'>
													<span
														className={`text-sm font-medium tabular-nums ${
															days <= 0 ? 'text-red-500'
															: days <= 3 ? 'text-amber-500'
															: 'text-[#111110]'
														}`}>
														{days <= 0 ? '0' : days}d
													</span>
												</td>

												<td className='px-6 py-4'>
													<span
														className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig[status].class}`}>
														{statusConfig[status].label}
													</span>
												</td>

												<td className='px-6 py-4 text-right'>
													<button
														onClick={() => setEditing({ ...c })}
														className='text-xs font-medium text-[#111110] hover:opacity-60 transition-opacity'>
														Manage →
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					}
				</div>
			</div>

			{/* Edit Modal */}
			{editing && (
				<div
					className='fixed inset-0 z-50 flex items-center justify-center p-4'
					style={{ fontFamily: "'DM Sans', sans-serif" }}>
					{/* Backdrop */}
					<div
						className='absolute inset-0 bg-black/40 backdrop-blur-sm'
						onClick={() => setEditing(null)}
					/>

					{/* Panel */}
					<div className='relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-black/20 z-10'>
						<div className='flex items-start justify-between mb-6'>
							<div>
								<h2 className='text-base font-semibold text-[#111110]'>
									Manage Company
								</h2>
								<p className='text-sm text-black/40 mt-0.5'>{editing.name}</p>
							</div>
							<button
								onClick={() => setEditing(null)}
								className='text-black/30 hover:text-black/60 transition-colors mt-0.5'>
								<X size={18} />
							</button>
						</div>

						<div className='space-y-4'>
							{/* Plan */}
							<div className='space-y-1.5'>
								<label className='text-[10px] uppercase tracking-widest font-medium text-black/35'>
									Plan
								</label>
								<select
									value={editing.plan}
									onChange={(e) =>
										setEditing({ ...editing, plan: e.target.value })
									}
									className='w-full bg-[#f5f4f0] border border-transparent rounded-xl px-4 py-3 text-sm text-[#111110] outline-none focus:border-black/15 focus:bg-white transition-all'>
									<option value='free'>Free</option>
									<option value='basic'>Basic</option>
									<option value='premium'>Premium</option>
								</select>
							</div>

							{/* Expiry */}
							<div className='space-y-1.5'>
								<label className='text-[10px] uppercase tracking-widest font-medium text-black/35'>
									Expiry Date
								</label>
								<input
									type='date'
									value={editing.trialEnd?.slice(0, 10) || ''}
									onChange={(e) => {
										const newDate = e.target.value;
										setEditing({
											...editing,
											trialEnd: newDate,
											balanceDays: getRemainingDays(newDate),
										});
									}}
									className='w-full bg-[#f5f4f0] border border-transparent rounded-xl px-4 py-3 text-sm text-[#111110] outline-none focus:border-black/15 focus:bg-white transition-all'
								/>
							</div>

							{/* Preview */}
							{editing.trialEnd && (
								<div className='bg-[#f5f4f0] rounded-xl px-4 py-3 flex items-center justify-between'>
									<span className='text-xs text-black/40'>Days remaining</span>
									<span
										className={`text-sm font-semibold tabular-nums ${
											getRemainingDays(editing.trialEnd) <= 0 ? 'text-red-500'
											: getRemainingDays(editing.trialEnd) <= 3 ?
												'text-amber-500'
											:	'text-green-600'
										}`}>
										{Math.max(0, getRemainingDays(editing.trialEnd))}d
									</span>
								</div>
							)}
						</div>

						<div className='flex gap-2 mt-6'>
							<button
								onClick={() => setEditing(null)}
								className='flex-1 px-4 py-2.5 border border-black/[0.08] rounded-xl text-sm text-black/50 hover:bg-black/[0.03] transition-all'>
								Cancel
							</button>
							<button
								onClick={handleUpdate}
								disabled={saving}
								className='flex-1 px-4 py-2.5 bg-[#111110] text-white rounded-xl text-sm font-medium hover:bg-black/80 disabled:opacity-50 transition-all active:scale-[0.99]'>
								{saving ? 'Saving...' : 'Save changes'}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
