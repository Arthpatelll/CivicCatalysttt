import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Header from './components/Header';
import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import IssueMap from './pages/IssueMap';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import { Issue, Language, User } from './types';
import { mockIssues } from './data/mockData';
import { loadFromStorage, saveToStorage, STORAGE_KEYS, getUserUpvotes, setUserUpvotes } from './utils/localStorage';

function App() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize data from localStorage or mock data
  useEffect(() => {
    const storedIssues = loadFromStorage(STORAGE_KEYS.ISSUES, []);
    const storedLanguage = loadFromStorage(STORAGE_KEYS.LANGUAGE, 'en');
    const storedUser = loadFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, { 
      id: 'user1', 
      name: 'John Citizen', 
      email: 'john@example.com', 
      role: 'citizen' as User['role'] 
    });

    if (storedIssues.length === 0) {
      // Initialize with mock data if no stored issues
      const issuesWithDates = mockIssues.map(issue => ({
        ...issue,
        createdAt: new Date(issue.createdAt),
        updatedAt: new Date(issue.updatedAt),
        publicComments: issue.publicComments.map(comment => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }))
      }));
      setIssues(issuesWithDates);
      saveToStorage(STORAGE_KEYS.ISSUES, issuesWithDates);
    } else {
      // Parse dates from stored data
      const issuesWithDates = storedIssues.map((issue: any) => ({
        ...issue,
        createdAt: new Date(issue.createdAt),
        updatedAt: new Date(issue.updatedAt),
        publicComments: issue.publicComments.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }))
      }));
      setIssues(issuesWithDates);
    }

    setLanguage(storedLanguage);
    setCurrentUser(storedUser);
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    saveToStorage(STORAGE_KEYS.LANGUAGE, newLanguage);
  };

  const handleUserChange = (newUser: User | null) => {
    setCurrentUser(newUser);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, newUser);
  };

  const handleSubmitIssue = (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'publicComments'>) => {
    const newIssue: Issue = {
      ...issueData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      upvotes: 0,
      publicComments: []
    };

    const updatedIssues = [newIssue, ...issues];
    setIssues(updatedIssues);
    saveToStorage(STORAGE_KEYS.ISSUES, updatedIssues);
    
    toast.success('Issue reported successfully!');
    
    // Simulate municipal system notification
    setTimeout(() => {
      toast.success('Your issue has been registered with the municipal system.');
    }, 2000);
  };

  const handleUpvote = (issueId: string) => {
    const userUpvotes = getUserUpvotes();
    
    if (userUpvotes.includes(issueId)) {
      toast.error('You have already upvoted this issue.');
      return;
    }

    const updatedIssues = issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, upvotes: issue.upvotes + 1, updatedAt: new Date() }
        : issue
    );
    
    setIssues(updatedIssues);
    saveToStorage(STORAGE_KEYS.ISSUES, updatedIssues);
    
    const newUserUpvotes = [...userUpvotes, issueId];
    setUserUpvotes(newUserUpvotes);
    
    toast.success('Your vote has been counted!');
  };

  const handleStatusChange = (issueId: string, newStatus: Issue['status']) => {
    const updatedIssues = issues.map(issue => {
      if (issue.id === issueId) {
        const updatedIssue = { 
          ...issue, 
          status: newStatus, 
          updatedAt: new Date() 
        };

        // Add system comment for status change
        const statusComment = {
          id: Date.now().toString(),
          text: `Status changed to ${newStatus} by municipal staff.`,
          author: currentUser?.name || 'System',
          createdAt: new Date(),
          isOfficial: true
        };

        updatedIssue.publicComments = [...updatedIssue.publicComments, statusComment];

        return updatedIssue;
      }
      return issue;
    });

    setIssues(updatedIssues);
    saveToStorage(STORAGE_KEYS.ISSUES, updatedIssues);
    
    toast.success(`Issue status updated to ${newStatus}!`);

    // Simulate push notification
    if (newStatus === 'resolved') {
      setTimeout(() => {
        toast.success('🎉 Issue has been resolved! Thank you for your report.');
      }, 1000);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header
          language={language}
          onLanguageChange={handleLanguageChange}
          currentUser={currentUser}
          onUserChange={handleUserChange}
        />
        
        <main>
          <Routes>
            <Route 
              path="/" 
              element={<Home language={language} issues={issues} />} 
            />
            <Route 
              path="/report" 
              element={
                <ReportIssue 
                  language={language} 
                  onSubmit={handleSubmitIssue}
                />
              } 
            />
            <Route 
              path="/map" 
              element={
                <IssueMap 
                  issues={issues}
                  onUpvote={handleUpvote}
                  currentUser={currentUser}
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  issues={issues}
                  language={language}
                  currentUser={currentUser}
                  onUpvote={handleUpvote}
                  onStatusChange={handleStatusChange}
                />
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <Analytics 
                  issues={issues}
                  currentUser={currentUser}
                />
              } 
            />
          </Routes>
        </main>

        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;