"use client"
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Nav from './components/Nav';
import Footer from './components/Footer';

const Tuvugane: React.FC = () => {
  

  return (
    <>
      <Head>
        <title>Tuvugane - Citizen Complaints and Engagement System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="antialiased text-gray-700 font-['Inter']">
        {/* Navigation */}
        <Nav/>

        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-[url('/tuvugane-rw.png')] bg-cover bg-center">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  Your Voice Matters in Building Better Communities
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Submit complaints, track progress, and see real change happen in your community through"" transparent citizen engagement platform.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link href="/register" className="bg-primary-600 text-white px-8 py-3 rounded-md hover:bg-primary-700 text-center font-medium transition">
                      Register Account
                    </Link>
                    <Link href="/submit-anonymous" className="bg-white text-primary-600 border border-primary-600 px-8 py-3 rounded-md hover:bg-primary-50 text-center font-medium transition">
                      Submit Anonymously
                    </Link>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 md:pl-10">
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Features</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Government of Rwanda platform designed to streamline the process of submitting complaints, tracking progress, and ensuring accountability.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
                <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Submission</h3>
                <p className="text-gray-600">
                  Simple and intuitive interface to submit complaints or feedback about public services with just a few clicks.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
                <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Categorization</h3>
                <p className="text-gray-600">
                  Automatic categorization and routing to the appropriate government agencies to ensure efficient handling.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
                <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
                <p className="text-gray-600">
                  Monitor the status of your complaint in real-time with updates at every stage of the process.
                </p>
              </div>
              
              {/* Feature 4 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
                <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
                <p className="text-gray-600">
                  Engage in direct communication with government officials responsible for resolving your issue.
                </p>
              </div>
              
              {/* Feature 5 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
                <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Transparent Process</h3>
                <p className="text-gray-600">
                  Clear visibility into the complaint handling process and expected timelines for resolution.
                </p>
              </div>
              
              {/* Feature 6 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
                <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Analytical Insights</h3>
                <p className="text-gray-600">
                  Access to dashboards showing patterns and trends in citizen complaints to drive policy improvements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                 streamlined process makes it easy to submit and track your complaints from start to finish.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Submit Your Complaint</h3>
                <p className="text-gray-600">
                  Fill out"" simple form with details about your issue. Add photos or supporting documents if needed.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Automatic Routing</h3>
                <p className="text-gray-600">
                 "" system automatically categorizes and routes your complaint to the appropriate government agency.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Track & Communicate</h3>
                <p className="text-gray-600">
                  Track progress in real-time, receive updates, and communicate directly with officials working on your issue.
                </p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/submit-anonymous" className="bg-primary-600 text-white px-8 py-3 rounded-md hover:bg-primary-700 inline-block font-medium transition mr-4">
                Submit Anonymously
              </Link>
              <Link 
                href="/admin/login"
                className="bg-gray-700 text-white border border-gray-700 px-8 py-3 rounded-md hover:bg-gray-800 inline-block font-medium transition"
              >
                Super Admin Portal
              </Link>
            </div>
          </div>
        </section>

        {/* User Benefits Section (Replacing Testimonials) */}
        <section id="user-benefits" className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Tuvugane Exist</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Learn how Tuvugane empowers citizens and improves government efficiency
              </p>
            </div>
            
            <div className="bg-primary-50 rounded-xl p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6 text-primary-700">For Citizens</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex">
                  <div className="mr-4 text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Voice Your Concerns</h4>
                    <p className="text-gray-600">Easily report issues in your community through a user-friendly platform</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Stay Informed</h4>
                    <p className="text-gray-600">Receive automatic updates as your complaint progresses through the system</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Build Better Communities</h4>
                    <p className="text-gray-600">Contribute to improving public services and infrastructure in your area</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Transparent Communication</h4>
                    <p className="text-gray-600">Direct communication with the officials responsible for addressing your concerns</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-secondary-700">For Government Officials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex">
                  <div className="mr-4 text-secondary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Streamlined Workflow</h4>
                    <p className="text-gray-600">Receive properly categorized and routed complaints to improve efficiency</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 text-secondary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Data-Driven Insights</h4>
                    <p className="text-gray-600">Access analytics and trends to make informed policy and resource decisions</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 text-secondary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Improved Accountability</h4>
                    <p className="text-gray-600">Enhanced tracking and reporting systems to ensure issues are addressed</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 text-secondary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Public Trust</h4>
                    <p className="text-gray-600">Build stronger relationships with citizens through transparent communication</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of citizens already using Tuvugane to communicate with government agencies to create better communities together.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/register" className="bg-primary-600 text-white px-8 py-3 rounded-md hover:bg-primary-700 inline-block font-medium transition">
                  Create Account
                </Link>
                <Link href="/login" className="bg-white text-primary-600 border border-primary-600 px-8 py-3 rounded-md hover:bg-primary-50 inline-block font-medium transition">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer/>
                  </div>
                </>
              );
          };
          
          export default Tuvugane;