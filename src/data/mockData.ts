import { Issue, Department, User } from '../types';

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues near the market area',
    category: 'Road Maintenance',
    location: {
      lat: 23.0225,
      lng: 72.5714,
      address: 'Main Street, Ahmedabad, Gujarat'
    },
    photos: ['https://images.pexels.com/photos/1125766/pexels-photo-1125766.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'],
    status: 'assigned',
    priority: 'high',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    upvotes: 15,
    isAnonymous: false,
    reporterId: 'user1',
    assignedDepartment: 'roads',
    assignedStaff: 'Rajesh Kumar',
    publicComments: [
      {
        id: 'c1',
        text: 'This has been assigned to our road maintenance team. Expected resolution in 3-5 days.',
        author: 'Municipal Office',
        createdAt: new Date('2024-01-16'),
        isOfficial: true
      }
    ]
  },
  {
    id: '2',
    title: 'Streetlight Not Working',
    description: 'Street light has been non-functional for over a week, creating safety concerns',
    category: 'Street Lighting',
    location: {
      lat: 23.0395,
      lng: 72.5666,
      address: 'Park Avenue, Ahmedabad, Gujarat'
    },
    photos: ['https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'],
    status: 'resolved',
    priority: 'medium',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    upvotes: 8,
    isAnonymous: false,
    reporterId: 'user2',
    assignedDepartment: 'electricity',
    assignedStaff: 'Priya Patel',
    publicComments: [
      {
        id: 'c2',
        text: 'Issue has been resolved. New LED streetlight installed.',
        author: 'Priya Patel',
        createdAt: new Date('2024-01-18'),
        isOfficial: true
      }
    ]
  },
  {
    id: '3',
    title: 'Garbage Collection Missed',
    description: 'Garbage has not been collected for 3 days in our locality',
    category: 'Waste Management',
    location: {
      lat: 23.0545,
      lng: 72.5425,
      address: 'Satellite Road, Ahmedabad, Gujarat'
    },
    photos: ['https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'],
    status: 'acknowledged',
    priority: 'high',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    upvotes: 23,
    isAnonymous: true,
    assignedDepartment: 'sanitation',
    publicComments: []
  }
];

export const mockDepartments: Department[] = [
  {
    id: 'roads',
    name: 'Road Maintenance',
    categories: ['Road Maintenance', 'Traffic Signals', 'Signage'],
    avgResponseTime: 4.2,
    totalIssues: 145,
    resolvedIssues: 128
  },
  {
    id: 'electricity',
    name: 'Electrical Department',
    categories: ['Street Lighting', 'Power Lines', 'Electrical Safety'],
    avgResponseTime: 2.8,
    totalIssues: 89,
    resolvedIssues: 84
  },
  {
    id: 'sanitation',
    name: 'Sanitation Department',
    categories: ['Waste Management', 'Drainage', 'Public Toilets'],
    avgResponseTime: 3.1,
    totalIssues: 234,
    resolvedIssues: 201
  },
  {
    id: 'water',
    name: 'Water Department',
    categories: ['Water Leaks', 'Water Supply', 'Sewerage'],
    avgResponseTime: 5.5,
    totalIssues: 67,
    resolvedIssues: 45
  }
];

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Amit Sharma',
    email: 'amit@example.com',
    role: 'citizen'
  },
  {
    id: 'user2',
    name: 'Priya Patel',
    email: 'priya@municipal.gov',
    role: 'staff',
    department: 'electricity'
  },
  {
    id: 'admin1',
    name: 'Raj Kumar',
    email: 'raj@municipal.gov',
    role: 'admin'
  }
];

export const categories = [
  'Road Maintenance',
  'Street Lighting',
  'Waste Management',
  'Water Leaks',
  'Drainage',
  'Traffic Signals',
  'Public Toilets',
  'Parks & Recreation',
  'Building Violations',
  'Noise Complaints'
];