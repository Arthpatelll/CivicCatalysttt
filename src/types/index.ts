export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  photos: string[];
  status: 'submitted' | 'acknowledged' | 'assigned' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  isAnonymous: boolean;
  reporterId?: string;
  assignedDepartment?: string;
  assignedStaff?: string;
  publicComments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  isOfficial: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'staff' | 'admin';
  department?: string;
}

export interface Department {
  id: string;
  name: string;
  categories: string[];
  avgResponseTime: number;
  totalIssues: number;
  resolvedIssues: number;
}

export type Language = 'en' | 'hi' | 'gu';

export interface Translation {
  [key: string]: {
    en: string;
    hi: string;
    gu: string;
  };
}