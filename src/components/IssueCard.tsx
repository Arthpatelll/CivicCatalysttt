import React from 'react';
import { MapPin, Calendar, ArrowUp, MessageCircle, User, Building } from 'lucide-react';
import { Issue } from '../types';
import { format } from 'date-fns';

interface IssueCardProps {
  issue: Issue;
  onUpvote?: (issueId: string) => void;
  canUpvote?: boolean;
  showActions?: boolean;
  onStatusChange?: (issueId: string, status: Issue['status']) => void;
  currentUser?: any;
}

const IssueCard: React.FC<IssueCardProps> = ({ 
  issue, 
  onUpvote, 
  canUpvote = true, 
  showActions = false,
  onStatusChange,
  currentUser
}) => {
  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'acknowledged':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      {/* Issue Photos */}
      {issue.photos.length > 0 && (
        <div className="aspect-video rounded-t-lg overflow-hidden">
          <img
            src={issue.photos[0]}
            alt={issue.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Header with Status and Priority */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
            {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(issue.priority)}`}>
            {issue.priority.toUpperCase()}
          </span>
        </div>

        {/* Title and Description */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{issue.title}</h3>
        <p className="text-gray-700 mb-4 line-clamp-2">{issue.description}</p>

        {/* Category */}
        <div className="flex items-center mb-3">
          <Building className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">{issue.category}</span>
        </div>

        {/* Location */}
        <div className="flex items-center mb-3">
          <MapPin className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 truncate">{issue.location.address}</span>
        </div>

        {/* Date */}
        <div className="flex items-center mb-4">
          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">
            {format(new Date(issue.createdAt), 'MMM d, yyyy')}
          </span>
        </div>

        {/* Assignment Info */}
        {issue.assignedDepartment && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-1">
              <User className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Assigned to:</span>
            </div>
            <p className="text-sm text-blue-700">{issue.assignedDepartment}</p>
            {issue.assignedStaff && (
              <p className="text-xs text-blue-600 mt-1">Staff: {issue.assignedStaff}</p>
            )}
          </div>
        )}

        {/* Comments Preview */}
        {issue.publicComments.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <MessageCircle className="w-4 h-4 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-800">Latest Update:</span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {issue.publicComments[issue.publicComments.length - 1].text}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              - {issue.publicComments[issue.publicComments.length - 1].author}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Upvote Button */}
            {canUpvote && onUpvote && (
              <button
                onClick={() => onUpvote(issue.id)}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-blue-100 transition-colors"
              >
                <ArrowUp className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{issue.upvotes}</span>
              </button>
            )}

            {/* Anonymous indicator */}
            {issue.isAnonymous && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Anonymous
              </span>
            )}
          </div>

          {/* Status Change Actions for Staff/Admin */}
          {showActions && currentUser?.role !== 'citizen' && onStatusChange && (
            <div className="flex space-x-2">
              {issue.status === 'submitted' && (
                <button
                  onClick={() => onStatusChange(issue.id, 'acknowledged')}
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                >
                  Acknowledge
                </button>
              )}
              {issue.status === 'acknowledged' && (
                <button
                  onClick={() => onStatusChange(issue.id, 'assigned')}
                  className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 transition-colors"
                >
                  Assign
                </button>
              )}
              {issue.status === 'assigned' && (
                <button
                  onClick={() => onStatusChange(issue.id, 'resolved')}
                  className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                >
                  Resolve
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueCard;