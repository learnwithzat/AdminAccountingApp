/** @format */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';

export default function LoginPage() {
	const router = useRouter();

	const [form, setForm] = useState({ username: '', password: '' });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleLogin = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const res = await API.post('/auth/login', form);
			localStorage.setItem('token', res.data.access_token);
			router.push('/dashboard');
		} catch (err) {
			setError('Invalid username or password');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400&display=swap');
			`}</style>

			<div
				className='min-h-screen flex'
				style={{ fontFamily: "'DM Sans', sans-serif" }}>
				{/* Left panel — dark brand */}
				<div className='hidden lg:flex w-2/5 bg-[#111110] flex-col justify-between p-12'>
					<div className='flex items-center gap-2.5'>
						<div className='w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center'>
							<div className='w-3.5 h-3.5 rounded-sm bg-white/80' />
						</div>
						<span className='text-white font-semibold tracking-tight text-[15px]'>
							Zatgo
						</span>
					</div>

					<div>
						<p className='text-white/20 text-xs uppercase tracking-[0.2em] mb-4'>
							Admin Console
						</p>
						<h2 className='text-white/80 text-3xl font-light leading-snug'>
							Manage your
							<br />
							<span className='text-white font-medium'>companies & plans</span>
							<br />
							in one place.
						</h2>
					</div>

					<p className='text-white/15 text-xs'>
						© {new Date().getFullYear()} Zatgo. All rights reserved.
					</p>
				</div>

				{/* Right panel — login form */}
				<div className='flex-1 bg-[#f5f4f0] flex items-center justify-center px-8'>
					<div className='w-full max-w-sm'>
						{/* Mobile brand */}
						<div className='lg:hidden flex items-center gap-2.5 mb-10'>
							<div className='w-7 h-7 rounded-lg bg-[#111110] flex items-center justify-center'>
								<div className='w-3.5 h-3.5 rounded-sm bg-white/80' />
							</div>
							<span className='text-[#111110] font-semibold tracking-tight text-[15px]'>
								Zatgo
							</span>
						</div>

						<div className='mb-8'>
							<h1 className='text-2xl font-semibold text-[#111110] tracking-tight'>
								Welcome back
							</h1>
							<p className='text-sm text-black/40 mt-1'>
								Sign in to your admin account
							</p>
						</div>

						<form
							onSubmit={handleLogin}
							className='space-y-4'>
							{/* Error */}
							{error && (
								<div className='bg-red-50 border border-red-100 rounded-xl px-4 py-3'>
									<p className='text-sm text-red-600'>{error}</p>
								</div>
							)}

							{/* Username */}
							<div className='space-y-1.5'>
								<label className='text-xs font-medium text-black/50 uppercase tracking-wider'>
									Username
								</label>
								<input
									type='text'
									value={form.username}
									onChange={(e) =>
										setForm({ ...form, username: e.target.value })
									}
									placeholder='Enter your username'
									required
									className='w-full bg-white border border-black/[0.08] rounded-xl px-4 py-3 text-sm text-[#111110] placeholder:text-black/25 outline-none focus:border-black/20 focus:ring-2 focus:ring-black/5 transition-all'
								/>
							</div>

							{/* Password */}
							<div className='space-y-1.5'>
								<label className='text-xs font-medium text-black/50 uppercase tracking-wider'>
									Password
								</label>
								<input
									type='password'
									value={form.password}
									onChange={(e) =>
										setForm({ ...form, password: e.target.value })
									}
									placeholder='••••••••'
									required
									className='w-full bg-white border border-black/[0.08] rounded-xl px-4 py-3 text-sm text-[#111110] placeholder:text-black/25 outline-none focus:border-black/20 focus:ring-2 focus:ring-black/5 transition-all'
								/>
							</div>

							{/* Submit */}
							<button
								type='submit'
								disabled={loading}
								className='w-full bg-[#111110] text-white py-3 rounded-xl text-sm font-medium mt-2 hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99]'>
								{loading ?
									<span className='flex items-center justify-center gap-2'>
										<svg
											className='animate-spin w-4 h-4 opacity-70'
											viewBox='0 0 24 24'
											fill='none'>
											<circle
												className='opacity-25'
												cx='12'
												cy='12'
												r='10'
												stroke='currentColor'
												strokeWidth='4'
											/>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
											/>
										</svg>
										Signing in...
									</span>
								:	'Sign in'}
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
