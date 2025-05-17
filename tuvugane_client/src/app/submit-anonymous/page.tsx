"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';

interface Agency {
  agency_id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
}

interface Category {
  category_id: number;
  name: string;
}

const SubmitAnonymous: React.FC = () => {
  const router = useRouter();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingAgencies, setLoadingAgencies] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    location: '',
    agency_id: '',
    attachments: null as File[] | null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [complaintId, setComplaintId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setLoadingAgencies(true);
        const data = await apiService.get<Agency[]>('/agencies');
        setAgencies(data);
      } catch (err: any) {
        console.error('Failed to load agencies:', err);
        setError('Failed to load agencies. Please try again later.');
      } finally {
        setLoadingAgencies(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await apiService.get<{ success: boolean; data: Category[] }>('/categories');
        setCategories(response.data);
      } catch (err: any) {
        console.error('Failed to load categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchAgencies();
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setFormData({
        ...formData,
        attachments: filesArray
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Map the form fields to match the backend expectations
      formDataToSend.append('subject', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('agency_id', formData.agency_id);
      
      if (formData.attachments) {
        formData.attachments.forEach(file => {
          formDataToSend.append('attachments', file);
        });
      }
      
      // Add anonymous flag
      formDataToSend.append('is_anonymous', 'true');
      
      const response = await fetch('/api/tickets', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit complaint');
      }

      const data = await response.json();
      setComplaintId(data.ticket.ticket_id);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success && complaintId) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Complaint Submitted Successfully!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your complaint ID is: <span className="font-bold">{complaintId}</span>
            </p>
            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> Please save this ID to track your complaint status. Since you submitted anonymously, this is the only way to check your complaint's progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <Link href="/track-complaint" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Track Your Complaint
            </Link>
            <Link href="/" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Return to Home
            </Link>
          </div>
          
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Want to receive updates about your complaint?
            </p>
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Submit Anonymous Complaint
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You are submitting anonymously.{' '}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Create an account
            </Link> to receive updates.
          </p>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                When submitting anonymously, you won't receive updates about your complaint. You'll need to check the public tracking page using your complaint ID.
              </p>
            </div>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Brief title of your complaint"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category_id"
                name="category_id"
                required
                value={formData.category_id}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="agency_id" className="block text-sm font-medium text-gray-700 mb-1">
                Government Agency <span className="text-red-500">*</span>
              </label>
              <select
                id="agency_id"
                name="agency_id"
                required
                value={formData.agency_id}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                disabled={loadingAgencies}
              >
                <option value="">Select an agency</option>
                {agencies.map((agency) => (
                  <option key={agency.agency_id} value={agency.agency_id}>
                    {agency.name}
                  </option>
                ))}
              </select>
              {loadingAgencies && (
                <p className="mt-1 text-sm text-gray-500">Loading agencies...</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Where is this issue located?"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                required
                value={formData.description}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Provide detailed information about the issue"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-1">
                Attachments (optional)
              </label>
              <input
                id="attachments"
                name="attachments"
                type="file"
                multiple
                onChange={handleFileChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                You can upload photos or documents related to your complaint (max 5MB each)
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
              disabled={loading || loadingAgencies || loadingCategories}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
          
          <div className="text-center">
            <Link href="/" className="font-medium text-primary-600 hover:text-primary-500">
              Cancel and return to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitAnonymous; 