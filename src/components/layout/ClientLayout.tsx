/** @format */

'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, LayoutDashboard, Building2, X } from 'lucide-react';

export default function ClientLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const navItems = [
		{ name: 'Dashboard', href: '/', icon: LayoutDashboard },
		{ name: 'Companies', href: '/companies', icon: Building2 },
	];

	return (
		<div className='flex h-screen overflow-hidden bg-gray-50 text-gray-900'>
			{/* MOBILE SIDEBAR */}
			{sidebarOpen && (
				<div className='fixed inset-0 z-50 flex'>
					<div
						className='fixed inset-0 bg-black/40'
						onClick={() => setSidebarOpen(false)}
					/>

					<aside className='relative w-64 bg-white h-full shadow-lg p-4 z-50'>
						<div className='flex items-center justify-between mb-6'>
							<h1 className='font-bold text-lg'>Zatgo</h1>
							<X onClick={() => setSidebarOpen(false)} />
						</div>

						<nav className='space-y-2'>
							{navItems.map((item) => {
								const Icon = item.icon;
								const active = pathname === item.href;

								return (
									<Link
										key={item.href}
										href={item.href}
										onClick={() => setSidebarOpen(false)}
										className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
											active ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
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
				<div className='h-16 flex items-center px-6 border-b font-bold'>
					Zatgo
				</div>

				<nav className='flex-1 p-4 space-y-2 text-sm'>
					{navItems.map((item) => {
						const Icon = item.icon;
						const active = pathname === item.href;

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
									active ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
								}`}>
								<Icon size={18} />
								{item.name}
							</Link>
						);
					})}
				</nav>

				<div className='p-4 border-t text-xs text-gray-500'>
					© {new Date().getFullYear()} Zatgo
				</div>
			</aside>

			{/* MAIN */}
			<div className='flex-1 flex flex-col'>
				{/* Topbar */}
				<header className='h-16 bg-white border-b flex items-center justify-between px-4 md:px-6'>
					<div className='flex items-center gap-3'>
						<button
							className='md:hidden'
							onClick={() => setSidebarOpen(true)}>
							<Menu size={22} />
						</button>

						<h1 className='text-sm text-gray-600'>Admin Dashboard</h1>
					</div>

					<div className='w-8 h-8 rounded-full bg-gray-200' />
				</header>

				{/* CONTENT */}
				<main className='flex-1 overflow-y-auto p-6'>{children}</main>
			</div>
		</div>
	);
}
