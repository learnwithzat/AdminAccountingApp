/** @format */

'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/api';
import {
	Building2,
	TrendingUp,
	AlertTriangle,
	CheckCircle,
} from 'lucide-react';

function SkeletonCard() {
	return (
		<div className='bg-white rounded-2xl p-6 border border-black/[0.06] animate-pulse'>
			<div className='h-4 w-24 bg-black/[0.06] rounded mb-4' />
			<div className='h-8 w-12 bg-black/[0.06] rounded' />
		</div>
	);
}

export default function DashboardPage() {
	const [companies, setCompanies] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		API.get('/company')
			.then((res) => setCompanies(res.data))
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	const getRemainingDays = (endDate: string) => {
		if (!endDate) return 0;
		const diff =
			(new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
		return Math.ceil(diff);
	};

	const total = companies.length;
	const active = companies.filter(
		(c) => c.plan !== 'free' && getRemainingDays(c.trialEnd) > 3,
	).length;
	const expiring = companies.filter((c) => {
		const d = getRemainingDays(c.trialEnd);
		return d > 0 && d <= 3 && c.plan !== 'free';
	}).length;
	const premium = companies.filter((c) => c.plan === 'premium').length;

	const stats = [
		{
			label: 'Total Companies',
			value: total,
			icon: Building2,
			color: 'bg-[#111110]',
			textColor: 'text-white',
			iconColor: 'text-white/60',
		},
		{
			label: 'Active Plans',
			value: active,
			icon: CheckCircle,
			color: 'bg-green-50',
			textColor: 'text-green-900',
			iconColor: 'text-green-400',
		},
		{
			label: 'Expiring Soon',
			value: expiring,
			icon: AlertTriangle,
			color: 'bg-amber-50',
			textColor: 'text-amber-900',
			iconColor: 'text-amber-400',
		},
		{
			label: 'Premium Plans',
			value: premium,
			icon: TrendingUp,
			color: 'bg-purple-50',
			textColor: 'text-purple-900',
			iconColor: 'text-purple-400',
		},
	];

	return (
		<div
			className='space-y-8'
			style={{ fontFamily: "'DM Sans', sans-serif" }}>
			{/* Header */}
			<div>
				<h1 className='text-2xl font-semibold text-[#111110] tracking-tight'>
					Dashboard
				</h1>
				<p className='text-sm text-black/40 mt-1'>
					{new Date().toLocaleDateString('en-US', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}
				</p>
			</div>

			{/* Metric Cards */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
				{loading ?
					<>
						{[...Array(4)].map((_, i) => (
							<SkeletonCard key={i} />
						))}
					</>
				:	<>
						{stats.map((stat) => {
							const Icon = stat.icon;
							return (
								<div
									key={stat.label}
									className={`${stat.color} rounded-2xl p-5 border border-black/[0.04] transition-transform hover:scale-[1.01]`}>
									<div className='flex items-start justify-between mb-3'>
										<p
											className={`text-xs font-medium ${stat.textColor} opacity-60 uppercase tracking-wider`}>
											{stat.label}
										</p>
										<Icon
											size={16}
											className={stat.iconColor}
										/>
									</div>
									<p
										className={`text-3xl font-semibold tracking-tight ${stat.textColor}`}>
										{stat.value}
									</p>
								</div>
							);
						})}
					</>
				}
			</div>

			{/* Recent activity */}
			<div className='bg-white rounded-2xl border border-black/[0.06] overflow-hidden'>
				<div className='px-6 py-4 border-b border-black/[0.05]'>
					<h2 className='text-sm font-semibold text-[#111110]'>
						Recent Companies
					</h2>
				</div>

				{loading ?
					<div className='p-6 space-y-3'>
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className='flex items-center gap-4 animate-pulse'>
								<div className='w-8 h-8 rounded-full bg-black/[0.05]' />
								<div className='flex-1'>
									<div className='h-3.5 w-32 bg-black/[0.05] rounded mb-1.5' />
									<div className='h-3 w-20 bg-black/[0.04] rounded' />
								</div>
								<div className='h-5 w-14 bg-black/[0.04] rounded-full' />
							</div>
						))}
					</div>
				: companies.length === 0 ?
					<div className='py-16 text-center'>
						<Building2
							size={28}
							className='text-black/15 mx-auto mb-3'
						/>
						<p className='text-sm text-black/30'>No companies yet</p>
					</div>
				:	<div className='divide-y divide-black/[0.04]'>
						{companies.slice(0, 6).map((c) => {
							const days = getRemainingDays(c.trialEnd);
							const initials = c.name
								.split(' ')
								.map((w: string) => w[0])
								.join('')
								.slice(0, 2)
								.toUpperCase();

							return (
								<div
									key={c._id}
									className='flex items-center gap-4 px-6 py-4 hover:bg-black/[0.015] transition-colors'>
									<div className='w-8 h-8 rounded-full bg-[#111110] flex items-center justify-center flex-shrink-0'>
										<span className='text-white text-[10px] font-semibold'>
											{initials}
										</span>
									</div>
									<div className='flex-1 min-w-0'>
										<p className='text-sm font-medium text-[#111110] truncate'>
											{c.name}
										</p>
										<p className='text-xs text-black/35 mt-0.5'>
											{days > 0 ? `${days} days remaining` : 'Expired'}
										</p>
									</div>
									<span
										className={`text-xs px-2.5 py-1 rounded-full font-medium ${
											c.plan === 'premium' ? 'bg-purple-100 text-purple-700'
											: c.plan === 'basic' ? 'bg-blue-100 text-blue-700'
											: 'bg-black/[0.06] text-black/40'
										}`}>
										{c.plan.charAt(0).toUpperCase() + c.plan.slice(1)}
									</span>
								</div>
							);
						})}
					</div>
				}
			</div>
		</div>
	);
}
