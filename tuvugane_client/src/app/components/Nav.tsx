"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default function Nav() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [showAdminLinks, setShowAdminLinks] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
    
    if (loginStatus) {
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error('Failed to parse user data', err);
      }
    }
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleAdminLinks = () => {
    setShowAdminLinks(!showAdminLinks);
  };

  return (
    <nav className="bg-white py-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              <span className="text-xl font-bold text-gray-800">Tuvugane</span>
            </div>
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-600 hover:text-primary-600 transition">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition">How It Works</a>
          <Link href="/track-complaint" className="text-gray-600 hover:text-primary-600 transition">Track Complaint</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link href="/citizen/dashboard" className="hidden md:block text-gray-600 hover:text-primary-600 transition">
                Dashboard
              </Link>
              <div className="hidden md:block text-sm text-gray-700">
                {user?.name && <span>Hi, {user.name.split(' ')[0]}</span>}
              </div>
              <LogoutButton className="hidden md:block text-gray-600 hover:text-primary-600 transition" />
              <Link href="/citizen/dashboard/new-complaint" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition">
                Submit Complaint
              </Link>
            </>
          ) : (
            <>
              <div className="hidden md:block relative">
                <button 
                  onClick={toggleAdminLinks} 
                  className="text-gray-600 hover:text-primary-600 transition flex items-center"
                >
                  Admin
                  <svg xmlns="http://www.w3.org/2000/svg" className={`ml-1 h-4 w-4 transform transition-transform ${showAdminLinks ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showAdminLinks && (
                  <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 right-0">
                    <Link href="/admin/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                      Staff login portal
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/login" className="hidden md:block text-gray-600 hover:text-primary-600 transition">
                Citizen-login-portal
              </Link>
              <Link href="/register" className="hidden md:block text-gray-600 hover:text-primary-600 transition">
                Register
              </Link>
              <Link href="/submit-anonymous" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition">
                Submit Anonymously
              </Link>
            </>
          )}
          <button className="md:hidden" onClick={toggleMobileMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden px-4 py-3 bg-gray-50 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <a href="#features" className="block py-2 text-gray-600 hover:text-primary-600">Features</a>
        <a href="#how-it-works" className="block py-2 text-gray-600 hover:text-primary-600">How It Works</a>
        <Link href="/track-complaint" className="block py-2 text-gray-600 hover:text-primary-600">Track Complaint</Link>
        
        {isLoggedIn ? (
          <>
            <Link href="/citizen/dashboard" className="block py-2 text-gray-600 hover:text-primary-600">Dashboard</Link>
            <Link href="/citizen/dashboard/new-complaint" className="block py-2 text-gray-600 hover:text-primary-600">Submit Complaint</Link>
            <LogoutButton className="block py-2 text-gray-600 hover:text-primary-600 w-full text-left" />
          </>
        ) : (
          <>
            <div className="py-2">
              <div className="font-medium text-gray-800 mb-1">Admin Access</div>
              <Link href="/admin/login" className="block py-1 pl-3 text-gray-600 hover:text-primary-600">
                staff Login portal
              </Link>
            </div>
            <Link href="/login" className="block py-2 text-gray-600 hover:text-primary-600">Citizen-login-portal</Link>
            <Link href="/register" className="block py-2 text-gray-600 hover:text-primary-600">Register</Link>
            <Link href="/submit-anonymous" className="block py-2 text-gray-600 hover:text-primary-600">Submit Anonymously</Link>
          </>
        )}
      </div>
    </nav>
  );
}