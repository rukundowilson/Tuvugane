"use client"
import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { usePathname } from 'next/navigation';

interface Category {
  category_id: number;
  name: string;
  mapping_id?: number;
}

interface AgencyAdmin {
  admin_id: number;
  name: string;
  agency_id: number;
  agency_name?: string;
}

const AgencyCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mappedCategories, setMappedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminData, setAdminData] = useState<AgencyAdmin | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isMappingCategory, setIsMappingCategory] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [agencyId, setAgencyId] = useState<number | null>(null);
  const [manualAgencyId, setManualAgencyId] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        console.log('Attempting to determine agency ID...');
        
        // Try to get agency ID from URL path (i.e., /admin/agency/:agencyId/...)
        const urlAgencyIdMatch = pathname?.match(/\/admin\/agency\/(\d+)/);
        if (urlAgencyIdMatch && urlAgencyIdMatch[1]) {
          const urlAgencyId = parseInt(urlAgencyIdMatch[1], 10);
          if (!isNaN(urlAgencyId)) {
            console.log('Found agency ID from URL path:', urlAgencyId);
            setAgencyId(urlAgencyId);
            return urlAgencyId;
          }
        }
        
        // Get token from any possible localStorage key
        const token = localStorage.getItem('adminToken') || 
                      localStorage.getItem('agencyAdminToken') || 
                      localStorage.getItem('agencyToken') ||
                      localStorage.getItem('userToken');
                      
        if (!token) {
          console.log('No authentication token found');
          throw new Error('Authentication token not found');
        }
        
        console.log('Found authentication token');
        
        // Check all possible localStorage keys for admin data
        const storageKeys = [
          'agencyAdminData',
          'adminData',
          'userData',
          'agencyData'
        ];
        
        for (const key of storageKeys) {
          const storedData = localStorage.getItem(key);
          if (storedData) {
            try {
              console.log(`Checking ${key} for agency ID...`);
              const data = JSON.parse(storedData);
              
              // Look for agency_id in various possible property names
              const possibleAgencyId = data.agency_id || data.agencyId || 
                                       (data.agency && data.agency.id) || 
                                       (data.agency && data.agency.agency_id);
                                       
              if (possibleAgencyId && typeof possibleAgencyId === 'number') {
                console.log(`Found agency ID (${possibleAgencyId}) in ${key}`);
                setAdminData(data);
                setAgencyId(possibleAgencyId);
                return possibleAgencyId;
              }
            } catch (err) {
              console.error(`Failed to parse ${key}:`, err);
            }
          }
        }
        
        // Try API calls to find the agency ID
        console.log('Trying API calls to find agency ID...');
        
        // Try agency admin profile endpoint
        try {
          const profileData = await apiService.get<AgencyAdmin>('/admins/profile', token);
          if (profileData && profileData.agency_id) {
            console.log('Found agency ID from admin profile:', profileData.agency_id);
            setAgencyId(profileData.agency_id);
            setAdminData(profileData);
            return profileData.agency_id;
          }
        } catch (profileErr) {
          console.error('Error fetching admin profile:', profileErr);
        }
        
        // Show manual input as last resort
        console.log('Could not determine agency ID automatically');
        setShowManualInput(true);
        throw new Error('Could not determine agency ID automatically. Please enter it manually.');
      } catch (err: any) {
        console.error('Error determining agency ID:', err);
        setError(err.message || 'Failed to load admin data');
        setShowManualInput(true);
        return null;
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedAgencyId = await fetchAdminData();
        
        if (!fetchedAgencyId && !showManualInput) {
          throw new Error('Failed to determine agency ID');
        }
        
        // If we need manual input, stop here and wait for user input
        if (showManualInput && !fetchedAgencyId) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('adminToken') || 
                      localStorage.getItem('agencyAdminToken') || 
                      localStorage.getItem('agencyToken') || 
                      localStorage.getItem('userToken');
                      
        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Fetch all categories
        const allCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>('/categories', token);
        
        // Fetch categories mapped to this agency
        const mappedCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>(`/categories/agency/${fetchedAgencyId}`, token);
        
        // Get all categories
        const allCategories = allCategoriesResponse.data || [];
        
        // Get mapped categories
        const agencyCategories = mappedCategoriesResponse.data || [];
        
        // Set state
        setCategories(allCategories);
        setMappedCategories(agencyCategories);
      } catch (err: any) {
        setError(err.message || 'Failed to load categories');
        console.error('Error loading categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathname]);
  
  const handleManualAgencyIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualAgencyId.trim()) {
      setError('Agency ID is required');
      return;
    }
    
    const parsedId = parseInt(manualAgencyId, 10);
    if (isNaN(parsedId)) {
      setError('Please enter a valid number for Agency ID');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Set the agency ID and continue with data fetching
      setAgencyId(parsedId);
      
      const token = localStorage.getItem('adminToken') || 
                   localStorage.getItem('agencyAdminToken') || 
                   localStorage.getItem('agencyToken') || 
                   localStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Fetch all categories
      const allCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>('/categories', token);
      
      // Fetch categories mapped to this agency
      const mappedCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>(`/categories/agency/${parsedId}`, token);
      
      // Get all categories
      const allCategories = allCategoriesResponse.data || [];
      
      // Get mapped categories
      const agencyCategories = mappedCategoriesResponse.data || [];
      
      // Set state
      setCategories(allCategories);
      setMappedCategories(agencyCategories);
      
      // Hide the manual input form
      setShowManualInput(false);
      
      // Save the agency ID to localStorage for future use
      try {
        localStorage.setItem('lastUsedAgencyId', parsedId.toString());
      } catch (e) {
        console.error('Failed to save agency ID to localStorage:', e);
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to load categories with provided Agency ID');
      console.error('Error with manual agency ID:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMapCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId || !agencyId) return;

    try {
      setIsMappingCategory(true);
      setError('');
      
      const token = localStorage.getItem('adminToken') || 
                   localStorage.getItem('agencyAdminToken') || 
                   localStorage.getItem('agencyToken') || 
                   localStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Map the category to the agency
      await apiService.post('/categories/map', {
        category_id: parseInt(selectedCategoryId),
        agency_id: agencyId
      }, token);

      // Refresh the mapped categories
      const mappedCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>(`/categories/agency/${agencyId}`, token);
      setMappedCategories(mappedCategoriesResponse.data || []);
      
      // Reset selection
      setSelectedCategoryId('');
    } catch (err: any) {
      setError(err.message || 'Failed to map category to agency');
      console.error('Error mapping category:', err);
    } finally {
      setIsMappingCategory(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !agencyId) return;

    try {
      setIsCreatingCategory(true);
      setError('');
      
      const token = localStorage.getItem('adminToken') || 
                   localStorage.getItem('agencyAdminToken') || 
                   localStorage.getItem('agencyToken') || 
                   localStorage.getItem('userToken');
                   
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // First create the category
      const response = await apiService.post<{ success: boolean; data: Category }>('/categories', {
        name: newCategoryName.trim()
      }, token);

      if (response && response.data && response.data.category_id) {
        // Then map it to the agency
        await apiService.post('/categories/map', {
          category_id: response.data.category_id,
          agency_id: agencyId
        }, token);

        // Refresh categories
        const allCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>('/categories', token);
        setCategories(allCategoriesResponse.data || []);

        // Refresh mapped categories
        const mappedCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>(`/categories/agency/${agencyId}`, token);
        setMappedCategories(mappedCategoriesResponse.data || []);
      }
      
      // Reset form
      setNewCategoryName('');
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
      console.error('Error creating category:', err);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleUnmapCategory = async (mappingId: number) => {
    if (!window.confirm('Are you sure you want to remove this category from your agency?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken') || 
                   localStorage.getItem('agencyAdminToken') || 
                   localStorage.getItem('agencyToken') || 
                   localStorage.getItem('userToken');
                   
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Delete the mapping
      await apiService.delete(`/categories/map/${mappingId}`, token);

      // Refresh the mapped categories
      if (agencyId) {
        const mappedCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>(`/categories/agency/${agencyId}`, token);
        setMappedCategories(mappedCategoriesResponse.data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove category mapping');
      console.error('Error removing category mapping:', err);
    }
  };

  // Filter out categories that are already mapped
  const unmappedCategories = categories.filter(
    cat => !mappedCategories.some(mapCat => mapCat.category_id === cat.category_id)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (showManualInput && !agencyId) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Agency ID Required</h1>
          
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
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
          
          <div className="bg-white shadow-sm rounded-lg p-6">
            <p className="text-gray-600 mb-4">
              We couldn't automatically determine your Agency ID. Please enter it manually to continue.
            </p>
            <form onSubmit={handleManualAgencyIdSubmit}>
              <div className="mb-4">
                <label htmlFor="agencyId" className="block text-sm font-medium text-gray-700 mb-1">
                  Agency ID
                </label>
                <input
                  type="number"
                  id="agencyId"
                  value={manualAgencyId}
                  onChange={(e) => setManualAgencyId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Enter your Agency ID"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Continue
              </button>
            </form>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              If you don't know your Agency ID, please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Manage Categories</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
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
      
      {agencyId && (
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">Managing categories for Agency ID: {agencyId}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Category</h2>
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              name="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Enter category name"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isCreatingCategory || !newCategoryName.trim()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isCreatingCategory ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
      
      {unmappedCategories.length > 0 && (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add Existing Category to Your Agency</h2>
          <form onSubmit={handleMapCategory} className="space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Select Category
              </label>
              <select
                id="category"
                name="category"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                required
              >
                <option value="">-- Select a category --</option>
                {unmappedCategories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                type="submit"
                disabled={isMappingCategory || !selectedCategoryId}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isMappingCategory ? 'Adding...' : 'Add Category to Agency'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Agency Categories
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Categories that your agency is responsible for handling
          </p>
        </div>
        {mappedCategories.length === 0 ? (
          <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
            No categories have been assigned to your agency yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {mappedCategories.map((category) => (
              <li key={category.category_id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                  <button
                    onClick={() => category.mapping_id && handleUnmapCategory(category.mapping_id)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AgencyCategories; 