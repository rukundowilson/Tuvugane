"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';

interface AdminLoginResponse {
  super_admin_id?: number;
  admin_id?: number;
  name: string;
  email: string;
  phone?: string;
  token: string;
  agency_id?: number;
  agency_name?: string;
  role?: string;
}

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loginType, setLoginType] = useState<'super-admin' | 'agency-admin'>('agency-admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let adminData: AdminLoginResponse;
      
      // Log credentials being sent (for debugging only, remove in production)
      console.log('Login attempt:', { 
        type: loginType, 
        email: formData.email,
        passwordLength: formData.password.length 
      });
      
      // Determine which endpoint to call based on login type
      if (loginType === 'super-admin') {
        adminData = await apiService.post<AdminLoginResponse>('/super-admin/login', {
          email: formData.email,
          password: formData.password
        });
        
        // Store admin data and token in localStorage
        localStorage.setItem('adminData', JSON.stringify(adminData));
        localStorage.setItem('adminToken', adminData.token);
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('isAgencyAdminLoggedIn', 'false');
        localStorage.setItem('adminType', 'super-admin');
        
        // Redirect to super admin dashboard
        router.push('/admin/dashboard');
      } else {
        // Agency admin login
        adminData = await apiService.post<AdminLoginResponse>('/admins/login', {
          email: formData.email,
          password: formData.password
        });
        
        // Store admin data and token in localStorage
        localStorage.setItem('adminData', JSON.stringify(adminData));
        localStorage.setItem('agencyAdminToken', adminData.token);
        localStorage.setItem('isAgencyAdminLoggedIn', 'true');
        localStorage.setItem('isAdminLoggedIn', 'false');
        localStorage.setItem('adminType', 'agency-admin');
        localStorage.setItem('agencyId', adminData.agency_id?.toString() || '');
        localStorage.setItem('agencyName', adminData.agency_name || '');
        
        // Redirect to agency admin dashboard
        router.push('/admin/agency/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 py-4">
          <h2 className="text-center text-2xl font-bold text-white">
            {loginType === 'super-admin' ? 'Super Admin Portal' : 'Agency Admin Portal'}
          </h2>
        </div>
        
        <div className="p-8 space-y-6">
          {/* Login type selector */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginType('agency-admin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                loginType === 'agency-admin'
                  ? 'bg-white text-indigo-700 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Agency Admin
            </button>
            
            <button
              type="button"
              onClick={() => setLoginType('super-admin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                loginType === 'super-admin'
                  ? 'bg-white text-indigo-700 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Super Admin
            </button>
          </div>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded-lg block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Link href="/admin/forgot-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded-lg block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Sign in as {loginType === 'super-admin' ? 'Super Admin' : 'Agency Admin'}
                  </span>
                )}
              </button>
            </div>
          </form>
          
          {loginType === 'super-admin' ? (
            <div className="text-center mt-4">
              <Link href="/admin/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                Register as Super Admin
              </Link>
            </div>
          ) : (
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">
                Need help? Contact your system administrator
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;