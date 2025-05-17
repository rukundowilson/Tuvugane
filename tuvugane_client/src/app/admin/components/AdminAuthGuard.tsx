"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    const token = localStorage.getItem('adminToken');
    
    if (!isLoggedIn || !token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default AdminAuthGuard; 