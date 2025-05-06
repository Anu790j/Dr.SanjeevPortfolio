'use client';
   
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminThemeToggle from '@/components/admin/AdminThemeToggle';
import { useTheme } from '@/context/ThemeContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-bg-dark to-circuit-dark' : 'bg-gradient-to-br from-circuit-light to-bg-light'} p-4`}>
      <div className={`w-full max-w-md p-8 space-y-6 ${isDark ? 'bg-bg-dark border-circuit-copper text-text-light' : 'bg-white border-circuit-silver text-text-primary'} rounded-xl shadow-xl border`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-osc-blue' : 'text-text-primary'}`}>Admin Login</h2>
          <AdminThemeToggle />
        </div>
        <p className={`text-sm ${isDark ? 'text-text-muted' : 'text-text-secondary'}`}>
          Enter your credentials to access the admin panel
        </p>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className={`p-3 border rounded-md ${isDark ? 'bg-red-800 bg-opacity-10 border-red-600 text-red-400' : 'bg-red-50 border-red-200 text-red-600'} text-sm`}>
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className={`block text-sm font-medium ${isDark ? 'text-text-light' : 'text-text-primary'} mb-1`}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${isDark ? 'bg-bg-darker border-gray-700 text-text-light placeholder-gray-500' : 'bg-white border-gray-300 text-text-primary placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-osc-blue focus:border-osc-blue transition-colors`}
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${isDark ? 'text-text-light' : 'text-text-primary'} mb-1`}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${isDark ? 'bg-bg-darker border-gray-700 text-text-light placeholder-gray-500' : 'bg-white border-gray-300 text-text-primary placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-osc-blue focus:border-osc-blue transition-colors`}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md ${isDark ? 'text-white' : 'text-text-primary'} bg-comp-gold hover:bg-comp-gold hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-comp-gold transition-colors shadow-md font-bold`}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}