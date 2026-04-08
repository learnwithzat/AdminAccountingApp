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
	User,
} from 'lucide-react';

export default function ClientLayout({ children }: { children: ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [profileOpen, setProfileOpen] = useState(false);

	// 🔐 Auth Guard
	useEffect(() => {
		const token = localStorage.getItem('token');

		if (!token) {
			router.replace('/login');
		} else {
			setLoading(false);
		}
	}, []);

	// 🚪 Logout
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
			<div className='h-screen flex items-center justify-center'>
				<div className='h-10 w-32 bg-gray-200 animate-pulse rounded' />
			</div>
		);
	}

	return (
		<div className='flex h-screen bg-gray-50'>
			{/* MOBILE */}
			{sidebarOpen && (
				<div className='fixed inset-0 z-50 flex'>
					<div
						className='absolute inset-0 bg-black/40'
						onClick={() => setSidebarOpen(false)}
					/>
					<aside className='relative w-64 bg-white p-4 z-50'>
						<X onClick={() => setSidebarOpen(false)} />
						<nav className='mt-4 space-y-2'>
							{navItems.map((item) => {
								const Icon = item.icon;
								const active = pathname === item.href;

								return (
									<Link
										key={item.href}
										href={item.href}
										className={`flex gap-2 p-2 rounded ${
											active ? 'bg-blue-600 text-white' : ''
										}`}>
										<Icon size={18} />
										{item.name}
									</Link>
								);
							})}
						</nav>
					</aside>
				</div>
			)}

			{/* DESKTOP SIDEBAR */}
			<aside className='hidden md:flex w-64 bg-white border-r flex-col'>
				<div className='p-4 font-bold'>Zatgo</div>

				<nav className='flex-1 p-4 space-y-2'>
					{navItems.map((item) => {
						const Icon = item.icon;
						const active = pathname === item.href;

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`flex gap-2 p-2 rounded ${
									active ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
								}`}>
								<Icon size={18} />
								{item.name}
							</Link>
						);
					})}
				</nav>
			</aside>

			{/* MAIN */}
			<div className='flex-1 flex flex-col'>
				<header className='h-14 bg-white border-b flex justify-between items-center px-4'>
					<Menu
						className='md:hidden'
						onClick={() => setSidebarOpen(true)}
					/>

					<div className='relative'>
						<button
							onClick={() => setProfileOpen(!profileOpen)}
							className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center'>
							<User size={16} />
						</button>

						{profileOpen && (
							<div className='absolute right-0 mt-2 bg-white border rounded shadow'>
								<button
									onClick={logout}
									className='flex items-center gap-2 px-4 py-2 hover:bg-gray-100'>
									<LogOut size={16} />
									Logout
								</button>
							</div>
						)}
					</div>
				</header>

				<main className='p-6 overflow-y-auto flex-1'>{children}</main>
			</div>
		</div>
	);
}
