"use client";
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Nav(){
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
    return(
        <nav className="bg-white py-4 shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              <span className="text-xl font-bold text-gray-800">Tuvugane</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition">How It Works</a>
              <a href="#user-benefits" className="text-gray-600 hover:text-primary-600 transition">User Benefits</a>
              <a href="#faq" className="text-gray-600 hover:text-primary-600 transition">FAQ</a>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="hidden md:block text-gray-600 hover:text-primary-600 transition">Login</a>
              <a href="#" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition">Submit Complaint</a>
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
            <a href="#user-benefits" className="block py-2 text-gray-600 hover:text-primary-600">User Benefits</a>
            <a href="#faq" className="block py-2 text-gray-600 hover:text-primary-600">FAQ</a>
            <a href="#" className="block py-2 text-gray-600 hover:text-primary-600">Login</a>
          </div>
        </nav>
    )
}