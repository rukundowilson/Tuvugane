import React from 'react';
import AdminAuthGuard from '../components/AdminAuthGuard';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="bg-gray-50 min-h-screen">
        {children}
      </div>
    </AdminAuthGuard>
  );
} 