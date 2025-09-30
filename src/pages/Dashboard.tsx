import React, { useState } from 'react';
import { Search, CheckCircle, Clock, AlertTriangle, BarChart3 } from 'lucide-react';
import IssueCard from '../components/IssueCard';
import { Issue, Language } from '../types';
import { useTranslation } from '../utils/translations';
import { categories } from '../data/mockData';

interface DashboardProps {
  issues: Issue[];
  language: Language;
  currentUser: any;
  onUpvote: (issueId: string) => void;
  onStatusChange: (issueId: string, status: Issue['status']) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  issues, 
  language, 
  currentUser, 
  onUpvote, 
  onStatusChange 
}) => {
  const t = useTranslation(language);
  const [activeTab, setActiveTab] = useState<'all' | 'my-issues' | 'municipal'>('all');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: '',
    search: ''
  });

  // Filter issues based on current tab and filters
  const getFilteredIssues = () => {
    let filteredIssues = issues;

    // Tab-based filtering
    if (activeTab === 'my-issues') {
      filteredIssues = issues.filter(issue => issue.reporterId === currentUser?.id);
    } else if (activeTab === 'municipal') {
      // Show all issues for municipal staff/admin
      filteredIssues = issues;
    }

    // Apply additional filters
    return filteredIssues.filter(issue => {
      if (filters.category && issue.category !== filters.category) return false;
      if (filters.status && issue.status !== filters.status) return false;
      if (filters.priority && issue.priority !== filters.priority) return false;
      if (filters.search && !issue.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !issue.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  };

  const filteredIssues = getFilteredIssues();

  // Calculate statistics
  const stats = [
    {
      icon: BarChart3,
      label: 'Total Issues',
      value: filteredIssues.length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: CheckCircle,
      label: 'Resolved',
      value: filteredIssues.filter(issue => issue.status === 'resolved').length,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Clock,
      label: 'In Progress',
      value: filteredIssues.filter(issue => issue.status === 'assigned').length,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: AlertTriangle,
      label: 'High Priority',
      value: filteredIssues.filter(issue => issue.priority === 'high').length,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'acknowledged', label: 'Acknowledged' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'resolved', label: 'Resolved' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const tabs = [
    { id: 'all', label: 'All Issues', show: true },
    { id: 'my-issues', label: 'My Issues', show: currentUser?.role === 'citizen' },
    { id: 'municipal', label: 'Municipal View', show: currentUser?.role !== 'citizen' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('dashboard')}</h1>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.filter(tab => tab.show).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Issues</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search issues..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setFilters({ category: '', status: '', priority: '', search: '' })}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Issues Grid */}
        {filteredIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onUpvote={onUpvote}
                currentUser={currentUser}
                showActions={currentUser?.role !== 'citizen'}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Issues Found</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'my-issues' 
                  ? "You haven't reported any issues yet. Start by reporting your first issue!"
                  : "No issues match your current filters. Try adjusting your search criteria."
                }
              </p>
              {activeTab === 'my-issues' && (
                <button
                  onClick={() => window.location.href = '/report'}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Report Issue
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;