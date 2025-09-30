import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, FileText, BarChart3, Users, ArrowRight, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { Language, Issue } from '../types';

interface HomeProps {
  language: Language;
  issues: Issue[];
}

const Home: React.FC<HomeProps> = ({ language, issues }) => {
  const t = useTranslation(language);

  // Calculate statistics
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(issue => issue.status === 'resolved').length;
  const pendingIssues = issues.filter(issue => issue.status !== 'resolved').length;
  const highPriorityIssues = issues.filter(issue => issue.priority === 'high').length;

  const stats = [
    {
      icon: FileText,
      label: 'Total Issues',
      value: totalIssues,
      color: 'text-blue-600'
    },
    {
      icon: CheckCircle,
      label: 'Resolved',
      value: resolvedIssues,
      color: 'text-green-600'
    },
    {
      icon: Clock,
      label: 'Pending',
      value: pendingIssues,
      color: 'text-yellow-600'
    },
    {
      icon: AlertTriangle,
      label: 'High Priority',
      value: highPriorityIssues,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('civic_catalyst')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('tagline')}
            </p>
            <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
              Report civic issues instantly, track their progress, and work together to build better communities. 
              Your voice matters in shaping the future of our cities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/report"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <FileText className="w-5 h-5 mr-2" />
                {t('report_issue')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center px-8 py-4 border border-blue-600 text-lg font-medium rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <MapPin className="w-5 h-5 mr-2" />
                {t('view_map')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Impact</h2>
            <p className="text-lg text-gray-600">Real-time statistics from our civic engagement platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className={`inline-flex p-3 rounded-lg ${stat.color} bg-opacity-10 mb-4`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple steps to make your community better</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Report Issues</h3>
              <p className="text-gray-600">
                Quickly report civic issues with photos, location, and detailed descriptions. 
                Use voice input for accessibility and convenience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Engagement</h3>
              <p className="text-gray-600">
                Upvote important issues, track progress, and engage with your community 
                to prioritize what matters most.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Track Progress</h3>
              <p className="text-gray-600">
                Monitor issue resolution, view municipal response times, and see the 
                positive impact of community involvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Issues Section */}
      {issues.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Recent Issues</h2>
              <Link 
                to="/dashboard" 
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.slice(0, 3).map((issue) => (
                <div key={issue.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {issue.photos.length > 0 && (
                    <img
                      src={issue.photos[0]}
                      alt={issue.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        issue.status === 'assigned' ? 'bg-purple-100 text-purple-800' :
                        issue.status === 'acknowledged' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {issue.status}
                      </span>
                      <span className="text-sm text-gray-500">{issue.category}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{issue.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{issue.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>👍 {issue.upvotes}</span>
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of citizens working together to build better communities. 
            Your report could be the catalyst for positive change.
          </p>
          <Link
            to="/report"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-colors shadow-lg"
          >
            <FileText className="w-5 h-5 mr-2" />
            Report Your First Issue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;