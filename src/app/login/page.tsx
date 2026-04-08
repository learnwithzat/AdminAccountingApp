/** @format */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';

export default function LoginPage() {
	const router = useRouter();

	const [form, setForm] = useState({
		username: '',
		password: '',
	});

	const [loading, setLoading] = useState(false);

	const handleLogin = async (e: any) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await API.post('/auth/login', form);

			localStorage.setItem('token', res.data.access_token);

			router.push('/dashboard');
		} catch (err) {
			console.error(err);
			alert('Invalid credentials');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50'>
			<div className='bg-white p-8 rounded-2xl shadow-md w-full max-w-md'>
				<h1 className='text-2xl font-bold mb-6 text-center'>Login</h1>

				<form
					onSubmit={handleLogin}
					className='space-y-4'>
					<input
						type='text'
						placeholder='Username'
						value={form.username}
						onChange={(e) => setForm({ ...form, username: e.target.value })}
						className='w-full border p-2 rounded-lg'
						required
					/>

					<input
						type='password'
						placeholder='Password'
						value={form.password}
						onChange={(e) => setForm({ ...form, password: e.target.value })}
						className='w-full border p-2 rounded-lg'
						required
					/>

					<button
						type='submit'
						disabled={loading}
						className='w-full bg-blue-600 text-white py-2 rounded-lg'>
						{loading ? 'Signing in...' : 'Login'}
					</button>
				</form>
			</div>
		</div>
	);
}
