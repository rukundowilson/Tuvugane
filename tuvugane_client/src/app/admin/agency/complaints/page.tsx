"use client";
import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface Complaint {
  ticket_id: number;
  subject: string;
  description: string;
  status: string;
  created_at: string;
  user_name?: string;
  is_anonymous: boolean;
  location?: string;
  category_name?: string;
}

const AgencyComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        // Get admin data from localStorage
        const storedAdminData = localStorage.getItem('agencyAdminData');
        if (storedAdminData) {
          const parsedData = JSON.parse(storedAdminData);
          
          // Get token
          const token = parsedData.token || localStorage.getItem('agencyAdminToken');
          if (!token) throw new Error('Authentication token not found');
          
          // Fetch complaints for this agency
          const agencyId = parsedData.agency_id;
          if (!agencyId) throw new Error('Agency ID not found');
          
          const complaintsData = await apiService.get<Complaint[]>(`/tickets/agency/${agencyId}`, token);
          
          if (Array.isArray(complaintsData)) {
            setComplaints(complaintsData);
          }
        }
      } catch (err: any) {
        console.error('Error fetching complaints:', err);
        setError(err.message || 'Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(null);
    
    try {
      const token = localStorage.getItem('agencyAdminToken');
      if (!token) throw new Error('Authentication token not found');
      
      // Update ticket status
      await apiService.put(`/tickets/${ticketId}/status`, { status: newStatus }, token);
      
      // Update local state
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => 
          complaint.ticket_id === ticketId 
            ? { ...complaint, status: newStatus } 
            : complaint
        )
      );
      
      setUpdateSuccess(`Status updated to ${newStatus} successfully`);
      
      // Close modal after success
      setTimeout(() => {
        setSelectedComplaint(null);
        setUpdateStatus('');
        setUpdateSuccess(null);
      }, 2000);
    } catch (err: any) {
      console.error('Error updating status:', err);
      setUpdateError(err.message || 'Failed to update status');
    } finally {
      setUpdateLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (statusFilter === 'all') return true;
    return complaint.status === statusFilter;
  });

  const openComplaintDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setUpdateStatus(complaint.status);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen -mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints Management</h1>
          <p className="text-gray-600 mt-1">
            Review and manage citizen complaints assigned to your agency
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <label htmlFor="status" className="sr-only">Filter by status</label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <tr key={complaint.ticket_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{complaint.ticket_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.location || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.category_name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                          complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => openComplaintDetails(complaint)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No complaints found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              onClick={() => setSelectedComplaint(null)}
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div 
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Complaint Details
                    </h3>
                    <div className="mt-4">
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 font-semibold">Subject:</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedComplaint.subject}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 font-semibold">Description:</p>
                        <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{selectedComplaint.description}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 font-semibold">Location:</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedComplaint.location || 'N/A'}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 font-semibold">Submitted By:</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedComplaint.is_anonymous ? 'Anonymous' : selectedComplaint.user_name || 'Citizen'}
                        </p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 font-semibold">Date Submitted:</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedComplaint.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 font-semibold">Current Status:</p>
                        <p className="mt-1 text-sm">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${selectedComplaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              selectedComplaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                              selectedComplaint.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {selectedComplaint.status}
                          </span>
                        </p>
                      </div>
                      
                      {/* Status Update */}
                      <div className="mb-4">
                        <label htmlFor="updateStatus" className="block text-sm font-medium text-gray-700">
                          Update Status:
                        </label>
                        <select
                          id="updateStatus"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                          value={updateStatus}
                          onChange={(e) => setUpdateStatus(e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                      
                      {updateError && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-red-700">{updateError}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {updateSuccess && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-green-700">{updateSuccess}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleStatusChange(selectedComplaint.ticket_id, updateStatus)}
                  disabled={updateLoading || selectedComplaint.status === updateStatus}
                >
                  {updateLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : 'Update Status'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedComplaint(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyComplaintsPage; 