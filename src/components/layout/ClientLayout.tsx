/** @format */

'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
	Menu,
	X,
	LayoutDashboard,
	Building2,
	LogOut,
	ChevronRight,
} from 'lucide-react';

export default function ClientLayout({ children }: { children: ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [profileOpen, setProfileOpen] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			router.replace('/login');
		} else {
			setLoading(false);
		}
	}, []);

	const logout = () => {
		localStorage.removeItem('token');
		router.replace('/login');
	};

	const navItems = [
		{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
		{ name: 'Companies', href: '/companies', icon: Building2 },
	];

	if (loading) {
		return (
			<div className='h-screen flex items-center justify-center bg-[#0f0f0f]'>
				<div className='flex items-center gap-3'>
					<div className='w-2 h-2 rounded-full bg-white/30 animate-pulse' />
					<div className='w-2 h-2 rounded-full bg-white/30 animate-pulse [animation-delay:150ms]' />
					<div className='w-2 h-2 rounded-full bg-white/30 animate-pulse [animation-delay:300ms]' />
				</div>
			</div>
		);
	}

	const SidebarContent = () => (
		<>
			{/* Brand */}
			<div className='px-6 pt-8 pb-6 border-b border-white/[0.06]'>
				<div className='flex items-center gap-2.5'>
					<div className='w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center'>
						<div className='w-3.5 h-3.5 rounded-sm bg-white/80' />
					</div>
					<span
						className='text-white font-semibold tracking-tight'
						style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px' }}>
						Zatgo
					</span>
				</div>
			</div>

			{/* Nav */}
			<nav className='flex-1 px-3 py-4 space-y-0.5'>
				<p
					className='px-3 mb-2 text-[10px] uppercase tracking-widest text-white/25'
					style={{ fontFamily: "'DM Sans', sans-serif" }}>
					Menu
				</p>
				{navItems.map((item) => {
					const Icon = item.icon;
					const active = pathname === item.href;

					return (
						<Link
							key={item.href}
							href={item.href}
							className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
								active ?
									'bg-white/10 text-white'
								:	'text-white/40 hover:bg-white/[0.05] hover:text-white/70'
							}`}
							style={{ fontFamily: "'DM Sans', sans-serif" }}>
							<Icon
								size={16}
								className={
									active ? 'opacity-90' : 'opacity-50 group-hover:opacity-70'
								}
							/>
							{item.name}
							{active && (
								<ChevronRight
									size={12}
									className='ml-auto opacity-30'
								/>
							)}
						</Link>
					);
				})}
			</nav>

			{/* User */}
			<div className='px-3 pb-6 border-t border-white/[0.06] pt-4'>
				<button
					onClick={logout}
					className='w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/35 hover:bg-white/[0.05] hover:text-white/60 transition-all duration-150'
					style={{ fontFamily: "'DM Sans', sans-serif" }}>
					<LogOut
						size={15}
						className='opacity-60'
					/>
					Sign out
				</button>
			</div>
		</>
	);

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
			`}</style>

			<div className='flex h-screen bg-[#f5f4f0]'>
				{/* Mobile overlay */}
				{sidebarOpen && (
					<div className='fixed inset-0 z-50 flex lg:hidden'>
						<div
							className='absolute inset-0 bg-black/60 backdrop-blur-sm'
							onClick={() => setSidebarOpen(false)}
						/>
						<aside className='relative w-64 bg-[#111110] flex flex-col z-50 shadow-2xl'>
							<button
								onClick={() => setSidebarOpen(false)}
								className='absolute top-4 right-4 text-white/40 hover:text-white/70 transition-colors'>
								<X size={18} />
							</button>
							<SidebarContent />
						</aside>
					</div>
				)}

				{/* Desktop sidebar */}
				<aside className='hidden lg:flex w-60 bg-[#111110] flex-col flex-shrink-0'>
					<SidebarContent />
				</aside>

				{/* Main */}
				<div className='flex-1 flex flex-col overflow-hidden'>
					{/* Topbar */}
					<header className='h-14 bg-[#f5f4f0] border-b border-black/[0.06] flex items-center justify-between px-6'>
						<button
							onClick={() => setSidebarOpen(true)}
							className='lg:hidden text-black/40 hover:text-black/70 transition-colors'>
							<Menu size={20} />
						</button>

						<div className='flex-1' />

						{/* Profile */}
						<div className='relative'>
							<button
								onClick={() => setProfileOpen(!profileOpen)}
								className='w-8 h-8 rounded-full bg-[#111110] flex items-center justify-center hover:opacity-80 transition-opacity'>
								<span
									className='text-white text-xs font-medium'
									style={{ fontFamily: "'DM Sans', sans-serif" }}>
									A
								</span>
							</button>

							{profileOpen && (
								<>
									<div
										className='fixed inset-0 z-10'
										onClick={() => setProfileOpen(false)}
									/>
									<div className='absolute right-0 mt-2 z-20 bg-white rounded-xl border border-black/[0.08] shadow-lg shadow-black/[0.08] overflow-hidden min-w-[140px]'>
										<button
											onClick={logout}
											className='w-full flex items-center gap-2.5 px-4 py-3 text-sm text-black/60 hover:bg-black/[0.04] hover:text-black transition-colors'
											style={{ fontFamily: "'DM Sans', sans-serif" }}>
											<LogOut
												size={14}
												className='opacity-60'
											/>
											Sign out
										</button>
									</div>
								</>
							)}
						</div>
					</header>

					<main
						className='flex-1 overflow-y-auto p-6 lg:p-8'
						style={{ fontFamily: "'DM Sans', sans-serif" }}>
						{children}
					</main>
				</div>
			</div>
		</>
	);
}
