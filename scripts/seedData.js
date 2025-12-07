/**
 * CodeQ Seed Data Script
 * 
 * This script creates realistic seed data for the CodeQ platform.
 * Run this after clearing your database.
 * 
 * Usage: node scripts/seedData.js
 */

const mongoose = require('mongoose');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote');

require('dotenv').config();

// Seed Data
const usersData = [
  {
    username: 'admin',
    email: 'admin@codeq.dev',
    password: 'admin123',
    role: 'admin',
    bio: 'Platform administrator and full-stack developer with 10+ years of experience.',
    title: 'Senior Full-Stack Developer',
    location: 'San Francisco, CA'
  },
  {
    username: 'sarah_dev',
    email: 'sarah@codeq.dev',
    password: 'expert123',
    role: 'expert',
    bio: 'React and Next.js expert. Love helping developers build amazing web applications.',
    title: 'Frontend Architect',
    location: 'New York, NY'
  },
  {
    username: 'alex_coder',
    email: 'alex@codeq.dev',
    password: 'expert123',
    role: 'expert',
    bio: 'Backend specialist focusing on Node.js, Express, and MongoDB. Always happy to help!',
    title: 'Backend Engineer',
    location: 'Austin, TX'
  },
  {
    username: 'john_doe',
    email: 'john@codeq.dev',
    password: 'student123',
    role: 'user',
    bio: 'Learning web development. Excited to be part of this community!',
    title: 'Junior Developer',
    location: 'Chicago, IL'
  },
  {
    username: 'emma_dev',
    email: 'emma@codeq.dev',
    password: 'student123',
    role: 'user',
    bio: 'Frontend developer passionate about React and modern JavaScript.',
    title: 'Frontend Developer',
    location: 'Seattle, WA'
  },
  {
    username: 'mike_codes',
    email: 'mike@codeq.dev',
    password: 'student123',
    role: 'user',
    bio: 'Full-stack developer learning the ropes. Ask me anything about my journey!',
    title: 'Software Developer',
    location: 'Boston, MA'
  },
  {
    username: 'lisa_tech',
    email: 'lisa@codeq.dev',
    password: 'student123',
    role: 'user',
    bio: 'UI/UX designer turned developer. Love creating beautiful and functional interfaces.',
    title: 'UI Developer',
    location: 'Portland, OR'
  },
  {
    username: 'david_web',
    email: 'david@codeq.dev',
    password: 'student123',
    role: 'user',
    bio: 'Backend developer specializing in REST APIs and database design.',
    title: 'Backend Developer',
    location: 'Denver, CO'
  },
  {
    username: 'sophia_code',
    email: 'sophia@codeq.dev',
    password: 'student123',
    role: 'user',
    bio: 'JavaScript enthusiast. Always exploring new frameworks and libraries.',
    title: 'JavaScript Developer',
    location: 'Miami, FL'
  },
  {
    username: 'ryan_dev',
    email: 'ryan@codeq.dev',
    password: 'student123',
    role: 'user',
    bio: 'Mobile and web developer. Love solving complex problems with elegant solutions.',
    title: 'Full-Stack Developer',
    location: 'Los Angeles, CA'
  }
];

const questionsData = [
  {
    title: 'How do I handle state management in Next.js 14 with the App Router?',
    body: `I'm migrating my Next.js application from Pages Router to App Router and I'm confused about state management. 

In the Pages Router, I used Context API and sometimes Redux. But with the App Router, I'm seeing recommendations for Server Components and Client Components.

**What I've tried:**
- Using Context API in a Client Component
- Trying to use useState in Server Components (doesn't work)

**My question:**
What's the best practice for managing global state in Next.js 14 App Router? Should I stick with Context API, use Zustand, or something else?

Here's a simple example of what I'm trying to do:

\`\`\`javascript
// I want to share user authentication state across multiple pages
// Currently using Context but wondering if there's a better way
\`\`\``,
    tags: ['nextjs', 'react', 'state-management', 'app-router'],
    askerUsername: 'john_doe',
    votes: 12,
    views: 145
  },
  {
    title: 'Why is my useEffect running twice in React 18 Strict Mode?',
    body: `I noticed that my useEffect hook is running twice in development mode. I know this is related to Strict Mode, but I'm not sure if this will happen in production.

**My code:**
\`\`\`javascript
useEffect(() => {
  console.log('Effect running');
  fetchData();
}, []);
\`\`\`

**What I'm seeing:**
- In development: Effect runs twice
- I'm worried about duplicate API calls

**Questions:**
1. Will this happen in production?
2. How should I handle cleanup to prevent duplicate requests?
3. Is there a way to disable this behavior if needed?

Thanks for any help!`,
    tags: ['react', 'javascript', 'useeffect', 'strict-mode'],
    askerUsername: 'emma_dev',
    votes: 8,
    views: 98
  },
  {
    title: 'Best way to handle authentication in a Next.js API route?',
    body: `I'm building a Next.js application with API routes and I need to implement JWT authentication.

**Current setup:**
- Next.js 14 App Router
- MongoDB for user storage
- JWT tokens for authentication

**What I need:**
- Secure API routes that require authentication
- Token refresh mechanism
- Proper error handling

**My current implementation:**
\`\`\`javascript
export async function GET(request) {
  const token = request.headers.get('authorization');
  // How do I properly verify and handle this?
}
\`\`\`

Can someone share a complete example of how to handle authentication in Next.js API routes?`,
    tags: ['nextjs', 'authentication', 'jwt', 'api-routes', 'security'],
    askerUsername: 'mike_codes',
    votes: 15,
    views: 203
  },
  {
    title: 'How to optimize images in Next.js Image component?',
    body: `I'm using the Next.js Image component but my images are still loading slowly. 

**What I've tried:**
- Using the \`next/image\` component
- Setting width and height
- Using priority for above-the-fold images

**My code:**
\`\`\`jsx
<Image
  src="/my-image.jpg"
  width={800}
  height={600}
  alt="Description"
/>
\`\`\`

**Questions:**
1. Should I use external image optimization services?
2. What's the best format (WebP, AVIF)?
3. How do I handle responsive images?

Any tips for better performance?`,
    tags: ['nextjs', 'performance', 'images', 'optimization'],
    askerUsername: 'lisa_tech',
    votes: 6,
    views: 87
  },
  {
    title: 'TypeScript: How to properly type a function that returns different types?',
    body: `I'm working with TypeScript and I have a function that can return different types based on the input.

**Example:**
\`\`\`typescript
function processData(input: string | number) {
  if (typeof input === 'string') {
    return input.toUpperCase();
  } else {
    return input * 2;
  }
}
\`\`\`

**Problem:**
TypeScript is inferring the return type as \`string | number\`, but I want more specific types.

**What I want:**
- If input is string, return string
- If input is number, return number

How do I properly type this with TypeScript generics or function overloads?`,
    tags: ['typescript', 'types', 'generics', 'function-overloads'],
    askerUsername: 'david_web',
    votes: 10,
    views: 124
  },
  {
    title: 'MongoDB: How to efficiently query nested documents?',
    body: `I'm working with MongoDB and I have documents with nested structures. I need to query and update nested fields efficiently.

**My document structure:**
\`\`\`javascript
{
  _id: ObjectId("..."),
  user: {
    profile: {
      name: "John",
      email: "john@example.com",
      settings: {
        notifications: true
      }
    }
  }
}
\`\`\`

**Questions:**
1. How do I query nested fields efficiently?
2. Should I use dot notation or $elemMatch?
3. How do I update nested fields?
4. Should I restructure my schema?

Any best practices for working with nested documents?`,
    tags: ['mongodb', 'database', 'query', 'nested-documents'],
    askerUsername: 'sophia_code',
    votes: 9,
    views: 112
  },
  {
    title: 'React: How to prevent unnecessary re-renders with useMemo and useCallback?',
    body: `My React component is re-rendering too often and I think it's affecting performance.

**Current code:**
\`\`\`javascript
function MyComponent({ data, onUpdate }) {
  const processedData = data.map(item => item.value * 2);
  
  const handleClick = () => {
    onUpdate();
  };
  
  return (
    <div>
      {processedData.map(item => <Child key={item.id} data={item} />)}
      <button onClick={handleClick}>Update</button>
    </div>
  );
}
\`\`\`

**Problem:**
- Component re-renders on every parent update
- Child components re-render unnecessarily
- \`processedData\` is recalculated every render

**What I've tried:**
- Using useMemo for processedData
- Using useCallback for handleClick
- But I'm not sure if I'm doing it correctly

Can someone show me the proper way to optimize this?`,
    tags: ['react', 'performance', 'usememo', 'usecallback', 'optimization'],
    askerUsername: 'ryan_dev',
    votes: 11,
    views: 156
  },
  {
    title: 'Next.js: How to implement infinite scroll with Server Actions?',
    body: `I want to implement infinite scroll in my Next.js 14 app using Server Actions.

**Requirements:**
- Load more data as user scrolls
- Use Server Actions (not API routes)
- Maintain scroll position
- Handle loading states

**What I've tried:**
- Using Intersection Observer
- Fetching with Server Actions
- But having issues with state management

**My current approach:**
\`\`\`javascript
'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
// But I want to use Server Actions instead
\`\`\`

Can someone provide a complete example of infinite scroll with Server Actions?`,
    tags: ['nextjs', 'server-actions', 'infinite-scroll', 'pagination'],
    askerUsername: 'john_doe',
    votes: 7,
    views: 91
  },
  {
    title: 'CSS: How to create a responsive grid layout with CSS Grid?',
    body: `I'm trying to create a responsive grid layout that adapts to different screen sizes.

**Requirements:**
- 3 columns on desktop
- 2 columns on tablet
- 1 column on mobile
- Equal height items
- Gap between items

**What I've tried:**
\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
\`\`\`

**Problems:**
- Not responsive
- Items don't have equal heights
- Gap doesn't look right on mobile

Can someone show me a complete responsive grid solution?`,
    tags: ['css', 'grid', 'responsive', 'layout'],
    askerUsername: 'emma_dev',
    votes: 5,
    views: 67
  },
  {
    title: 'Node.js: How to handle file uploads with Multer and Express?',
    body: `I need to implement file upload functionality in my Express.js application.

**Requirements:**
- Accept images (jpg, png, webp)
- Limit file size (max 5MB)
- Store files in a specific directory
- Return file URL after upload
- Handle errors properly

**Current setup:**
\`\`\`javascript
const express = require('express');
const multer = require('multer');
const app = express();
\`\`\`

**What I need:**
- Complete Multer configuration
- Error handling
- File validation
- Best practices

Can someone share a working example?`,
    tags: ['nodejs', 'express', 'multer', 'file-upload', 'backend'],
    askerUsername: 'mike_codes',
    votes: 13,
    views: 178
  },
  {
    title: 'React: How to implement a custom hook for API calls?',
    body: `I want to create a reusable custom hook for making API calls with loading, error, and data states.

**Requirements:**
- Handle loading state
- Handle error state
- Handle success state
- Support for different HTTP methods
- Automatic refetching option

**What I've tried:**
\`\`\`javascript
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // But I want it to be more flexible
}
\`\`\`

Can someone show me a complete, production-ready custom hook for API calls?`,
    tags: ['react', 'custom-hooks', 'api', 'fetch', 'hooks'],
    askerUsername: 'lisa_tech',
    votes: 9,
    views: 134
  },
  {
    title: 'TypeScript: How to create a type-safe API client?',
    body: `I'm building a TypeScript application and I want to create a type-safe API client.

**Requirements:**
- Type-safe request/response
- Support for different endpoints
- Error handling
- Request/response interceptors

**What I've tried:**
\`\`\`typescript
interface ApiResponse<T> {
  data: T;
  status: number;
}

async function apiCall<T>(url: string): Promise<ApiResponse<T>> {
  // Implementation
}
\`\`\`

**Questions:**
1. How do I make it fully type-safe?
2. How to handle different HTTP methods?
3. Best practices for error types?

Any examples of a production-ready type-safe API client?`,
    tags: ['typescript', 'api', 'type-safety', 'http-client'],
    askerUsername: 'david_web',
    votes: 8,
    views: 102
  },
  {
    title: 'Next.js: How to implement dark mode with Tailwind CSS?',
    body: `I want to add dark mode support to my Next.js application using Tailwind CSS.

**Requirements:**
- Toggle between light and dark mode
- Persist user preference
- Smooth transitions
- Support for system preference

**What I've tried:**
- Using Tailwind's dark mode classes
- localStorage for persistence
- But having issues with hydration

**My setup:**
\`\`\`javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}
\`\`\`

Can someone provide a complete dark mode implementation?`,
    tags: ['nextjs', 'tailwindcss', 'dark-mode', 'ui'],
    askerUsername: 'sophia_code',
    votes: 14,
    views: 189
  },
  {
    title: 'MongoDB: How to implement pagination efficiently?',
    body: `I need to implement pagination for a large collection in MongoDB.

**Requirements:**
- Efficient queries
- Support for page-based and cursor-based pagination
- Handle large datasets
- Return total count

**What I've tried:**
\`\`\`javascript
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

const data = await Model.find().skip(skip).limit(limit);
\`\`\`

**Questions:**
1. Is skip/limit efficient for large collections?
2. Should I use cursor-based pagination instead?
3. How to get total count efficiently?
4. Best practices for performance?

Any recommendations?`,
    tags: ['mongodb', 'pagination', 'database', 'performance'],
    askerUsername: 'ryan_dev',
    votes: 12,
    views: 167
  },
  {
    title: 'React: How to handle form validation with React Hook Form?',
    body: `I'm using React Hook Form for form management and I need to implement comprehensive validation.

**Requirements:**
- Email validation
- Password strength validation
- Custom validation rules
- Display error messages
- Handle async validation

**What I've tried:**
\`\`\`javascript
const { register, handleSubmit, formState: { errors } } = useForm();

<input {...register('email', { required: true })} />
\`\`\`

**Questions:**
1. How to add custom validation rules?
2. How to validate password strength?
3. How to handle async validation (e.g., check if email exists)?
4. Best practices for error messages?

Can someone share a complete example?`,
    tags: ['react', 'react-hook-form', 'validation', 'forms'],
    askerUsername: 'john_doe',
    votes: 10,
    views: 142
  }
];

const answersData = [
  {
    questionIndex: 0, // Next.js state management
    body: `Great question! For Next.js 14 App Router, here are the best practices:

**1. Context API (for Client Components)**
If you need client-side state, Context API still works great:

\`\`\`javascript
'use client';
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
\`\`\`

**2. Zustand (Recommended for complex state)**
Zustand is lightweight and works perfectly with Server Components:

\`\`\`javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
\`\`\`

**3. Server State (for data fetching)**
Use Server Components and Server Actions for server-side state. This is the Next.js way!

**My recommendation:** Use Zustand for global client state, and Server Components for data fetching. This gives you the best of both worlds!`,
    answererUsername: 'sarah_dev',
    votes: 8,
    isAccepted: true
  },
  {
    questionIndex: 0,
    body: `I'd also recommend checking out Jotai or Recoil if you need atomic state management. But for most use cases, Zustand is the sweet spot - it's simple, performant, and works great with Next.js 14.`,
    answererUsername: 'alex_coder',
    votes: 5
  },
  {
    questionIndex: 1, // useEffect running twice
    body: `This is expected behavior in React 18 Strict Mode! Here's what you need to know:

**1. Development vs Production:**
- Development: Runs twice (to help detect side effects)
- Production: Runs once (Strict Mode is disabled)

**2. Proper Cleanup:**
Always use cleanup functions to prevent issues:

\`\`\`javascript
useEffect(() => {
  let cancelled = false;
  
  async function fetchData() {
    const data = await api.getData();
    if (!cancelled) {
      setData(data);
    }
  }
  
  fetchData();
  
  return () => {
    cancelled = true;
  };
}, []);
\`\`\`

**3. Disabling Strict Mode (Not Recommended):**
You can remove the StrictMode component from your app, but it's better to write code that works with it. This helps catch bugs early!

The double execution is intentional and helps ensure your effects are properly cleaned up.`,
    answererUsername: 'sarah_dev',
    votes: 12,
    isAccepted: true
  },
  {
    questionIndex: 2, // Authentication in API routes
    body: `Here's a complete example of JWT authentication in Next.js API routes:

\`\`\`javascript
// middleware.js or utils/auth.js
import jwt from 'jsonwebtoken';

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// app/api/protected/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
  
  // Token is valid, proceed with request
  return NextResponse.json({ data: 'Protected data' });
}
\`\`\`

**For token refresh**, create a separate endpoint that validates the refresh token and issues a new access token.`,
    answererUsername: 'alex_coder',
    votes: 15,
    isAccepted: true
  },
  {
    questionIndex: 3, // Image optimization
    body: `Here are the best practices for optimizing images in Next.js:

**1. Use Next.js Image Component (You're already doing this!)**
The Image component automatically optimizes images, but here are additional tips:

\`\`\`jsx
<Image
  src="/my-image.jpg"
  width={800}
  height={600}
  alt="Description"
  priority // For above-the-fold images
  placeholder="blur" // For better UX
  quality={85} // Adjust quality (default is 75)
/>
\`\`\`

**2. Image Formats:**
- Use WebP or AVIF when possible
- Next.js automatically serves the best format based on browser support

**3. External Images:**
If using external images, configure them in \`next.config.js\`:

\`\`\`javascript
module.exports = {
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
\`\`\`

**4. Responsive Images:**
Use the \`sizes\` prop for responsive images:

\`\`\`jsx
<Image
  src="/hero.jpg"
  width={1920}
  height={1080}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
\`\`\`

This should significantly improve your image loading performance!`,
    answererUsername: 'sarah_dev',
    votes: 9,
    isAccepted: true
  },
  {
    questionIndex: 4, // TypeScript function overloads
    body: `You can use function overloads in TypeScript to achieve this:

\`\`\`typescript
// Function overloads
function processData(input: string): string;
function processData(input: number): number;
function processData(input: string | number): string | number {
  if (typeof input === 'string') {
    return input.toUpperCase();
  } else {
    return input * 2;
  }
}

// Usage
const strResult = processData('hello'); // Type: string
const numResult = processData(5); // Type: number
\`\`\`

**Alternative: Using Generics with Type Guards**

\`\`\`typescript
function processData<T extends string | number>(
  input: T
): T extends string ? string : number {
  if (typeof input === 'string') {
    return input.toUpperCase() as any;
  } else {
    return (input * 2) as any;
  }
}
\`\`\`

Function overloads are cleaner and more readable for this use case!`,
    answererUsername: 'alex_coder',
    votes: 7,
    isAccepted: true
  },
  {
    questionIndex: 5, // MongoDB nested documents
    body: `Here's how to efficiently work with nested documents in MongoDB:

**1. Querying Nested Fields:**
Use dot notation:

\`\`\`javascript
// Find documents where nested field matches
db.collection.find({ 'user.profile.name': 'John' });

// Using Mongoose
Model.find({ 'user.profile.name': 'John' });
\`\`\`

**2. Updating Nested Fields:**
Use dot notation with $set:

\`\`\`javascript
Model.updateOne(
  { _id: userId },
  { $set: { 'user.profile.settings.notifications': false } }
);
\`\`\`

**3. Schema Design Consideration:**
If you're frequently querying nested fields, consider:
- Flattening the structure
- Using separate collections with references
- Creating indexes on frequently queried nested fields

**4. Indexing:**
\`\`\`javascript
Model.createIndex({ 'user.profile.email': 1 });
\`\`\`

For deeply nested structures, consider if a flatter schema would be more efficient!`,
    answererUsername: 'alex_coder',
    votes: 8,
    isAccepted: true
  },
  {
    questionIndex: 6, // React optimization
    body: `Here's how to properly optimize your component:

\`\`\`javascript
import { useMemo, useCallback, memo } from 'react';

function MyComponent({ data, onUpdate }) {
  // Memoize expensive computation
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      value: item.value * 2
    }));
  }, [data]); // Only recompute when data changes
  
  // Memoize callback
  const handleClick = useCallback(() => {
    onUpdate();
  }, [onUpdate]);
  
  return (
    <div>
      {processedData.map(item => (
        <Child key={item.id} data={item} />
      ))}
      <button onClick={handleClick}>Update</button>
    </div>
  );
}

// Memoize child component to prevent unnecessary re-renders
const Child = memo(({ data }) => {
  return <div>{data.value}</div>;
});
\`\`\`

**Key Points:**
- \`useMemo\` for expensive computations
- \`useCallback\` for function references
- \`React.memo\` for component memoization
- Only use these when you've identified a performance issue!`,
    answererUsername: 'sarah_dev',
    votes: 10,
    isAccepted: true
  },
  {
    questionIndex: 7, // Infinite scroll
    body: `Here's a complete example of infinite scroll with Server Actions:

\`\`\`javascript
// app/actions/posts.js
'use server';

export async function getPosts(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const posts = await Post.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  
  return { posts, hasMore: posts.length === limit };
}

// app/components/PostList.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { getPosts } from '@/app/actions/posts';

export function PostList() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const { posts: newPosts, hasMore: more } = await getPosts(page);
    setPosts(prev => [...prev, ...newPosts]);
    setHasMore(more);
    setPage(prev => prev + 1);
    setLoading(false);
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadPosts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
      {loading && <div>Loading...</div>}
      <div ref={observerRef} />
    </div>
  );
}
\`\`\`

This provides a smooth infinite scroll experience!`,
    answererUsername: 'sarah_dev',
    votes: 6,
    isAccepted: true
  },
  {
    questionIndex: 8, // CSS Grid
    body: `Here's a complete responsive grid solution:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  align-items: stretch; /* Equal height items */
}

/* Or with explicit breakpoints */
.grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: 1 column */
  gap: 20px;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 columns */
  }
}

/* Ensure items have equal height */
.grid-item {
  display: flex;
  flex-direction: column;
}
\`\`\`

**Using CSS Grid with auto-fit:**
\`repeat(auto-fit, minmax(300px, 1fr))\` automatically adjusts columns based on available space. This is often the cleanest solution!`,
    answererUsername: 'sarah_dev',
    votes: 7,
    isAccepted: true
  },
  {
    questionIndex: 9, // File upload with Multer
    body: `Here's a complete Multer setup for file uploads:

\`\`\`javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const fileUrl = \`/uploads/\${req.file.filename}\`;
  res.json({ url: fileUrl, filename: req.file.filename });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  res.status(500).json({ error: error.message });
});
\`\`\`

This handles validation, size limits, and error cases!`,
    answererUsername: 'alex_coder',
    votes: 11,
    isAccepted: true
  },
  {
    questionIndex: 10, // Custom API hook
    body: `Here's a production-ready custom hook for API calls:

\`\`\`javascript
import { useState, useEffect, useCallback } from 'react';

function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: options.headers || { 'Content-Type': 'application/json' },
        body: options.body ? JSON.stringify(options.body) : undefined,
        ...options
      });

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchData();
    }
  }, [fetchData, options.autoFetch]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Usage
function MyComponent() {
  const { data, loading, error, refetch } = useApi('/api/users');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render data */}</div>;
}
\`\`\`

This hook is flexible and handles all common use cases!`,
    answererUsername: 'sarah_dev',
    votes: 8,
    isAccepted: true
  },
  {
    questionIndex: 11, // Type-safe API client
    body: `Here's a type-safe API client implementation:

\`\`\`typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiConfig {
  baseURL: string;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.headers = config.headers || {};
  }

  async request<T>(
    method: HttpMethod,
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    const url = \`\${this.baseURL}\${endpoint}\`;
    
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
      },
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Request failed');
    }

    return {
      data: responseData,
      status: response.status,
    };
  }

  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint);
  }

  post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data);
  }

  put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data);
  }

  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint);
  }
}

// Usage
const api = new ApiClient({ baseURL: 'https://api.example.com' });

interface User {
  id: string;
  name: string;
}

const { data } = await api.get<User[]>('/users');
// data is fully typed as User[]
\`\`\`

This provides complete type safety!`,
    answererUsername: 'alex_coder',
    votes: 9,
    isAccepted: true
  },
  {
    questionIndex: 12, // Dark mode
    body: `Here's a complete dark mode implementation:

\`\`\`javascript
// hooks/useTheme.js
'use client';
import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return { theme, toggleTheme, mounted };
}

// components/ThemeProvider.jsx
'use client';
import { useTheme } from '@/hooks/useTheme';

export function ThemeProvider({ children }) {
  const { mounted } = useTheme();
  
  if (!mounted) {
    return <>{children}</>;
  }
  
  return <>{children}</>;
}

// Usage in component
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
\`\`\`

This handles hydration issues and persists user preference!`,
    answererUsername: 'sarah_dev',
    votes: 13,
    isAccepted: true
  },
  {
    questionIndex: 13, // MongoDB pagination
    body: `Here are the best practices for MongoDB pagination:

**1. Skip/Limit (Simple but can be slow for large collections)**
\`\`\`javascript
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

const data = await Model.find()
  .skip(skip)
  .limit(limit)
  .sort({ createdAt: -1 });

const total = await Model.countDocuments();
\`\`\`

**2. Cursor-Based Pagination (Recommended for large datasets)**
\`\`\`javascript
const limit = 10;
const cursor = req.query.cursor; // Last document _id from previous page

const query = cursor ? { _id: { $lt: cursor } } : {};
const data = await Model.find(query)
  .sort({ _id: -1 })
  .limit(limit + 1); // Fetch one extra to check if there's more

const hasMore = data.length > limit;
const results = hasMore ? data.slice(0, -1) : data;
const nextCursor = hasMore ? results[results.length - 1]._id : null;

return { results, nextCursor, hasMore };
\`\`\`

**3. Indexing:**
Always create indexes on fields used for sorting:
\`\`\`javascript
Model.createIndex({ createdAt: -1 });
\`\`\`

Cursor-based pagination is more efficient for large collections!`,
    answererUsername: 'alex_coder',
    votes: 11,
    isAccepted: true
  },
  {
    questionIndex: 14, // React Hook Form validation
    body: `Here's a complete example with React Hook Form validation:

\`\`\`javascript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema
const schema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm password')
});

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  // Async validation
  const validateEmail = async (email) => {
    const exists = await checkEmailExists(email);
    if (exists) {
      return 'Email already exists';
    }
    return true;
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', {
          validate: validateEmail
        })}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        type="password"
        {...register('password')}
        placeholder="Password"
      />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
\`\`\`

This provides comprehensive validation with great UX!`,
    answererUsername: 'sarah_dev',
    votes: 9,
    isAccepted: true
  }
];

// Main seed function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Question.deleteMany({});
    await Answer.deleteMany({});
    await Comment.deleteMany({});
    await Vote.deleteMany({});
    console.log('✅ Database cleared');

    // Create users
    console.log('👥 Creating users...');
    const users = [];
    for (const userData of usersData) {
      // Let the userSchema pre-save hook handle password hashing
      const user = await User.create({
        username: userData.username,
        email: userData.email,
        password: userData.password, // Plain password - will be hashed by pre-save hook
        role: userData.role,
        bio: userData.bio,
        title: userData.title,
        location: userData.location
      });
      users.push(user);
      console.log(`  ✅ Created user: ${userData.username}`);
    }

    // Create a map of usernames to user objects
    const userMap = {};
    users.forEach(user => {
      userMap[user.username] = user;
    });

    // Create questions
    console.log('❓ Creating questions...');
    const questions = [];
    for (const qData of questionsData) {
      const asker = userMap[qData.askerUsername];
      if (!asker) {
        console.error(`  ❌ User not found: ${qData.askerUsername}`);
        continue;
      }

      const question = new Question({
        title: qData.title,
        body: qData.body,
        asker: asker._id,
        tags: qData.tags,
        votes: qData.votes || 0,
        views: qData.views || 0,
        answerCount: 0,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
        updatedAt: new Date()
      });
      await question.save();
      questions.push(question);
      console.log(`  ✅ Created question: ${qData.title.substring(0, 50)}...`);
    }

    // Create answers
    console.log('💬 Creating answers...');
    for (const aData of answersData) {
      const question = questions[aData.questionIndex];
      if (!question) {
        console.error(`  ❌ Question not found at index: ${aData.questionIndex}`);
        continue;
      }

      const answerer = userMap[aData.answererUsername];
      if (!answerer) {
        console.error(`  ❌ User not found: ${aData.answererUsername}`);
        continue;
      }

      const answer = new Answer({
        questionId: question._id,
        answerer: answerer._id,
        body: aData.body,
        votes: aData.votes || 0,
        isAccepted: aData.isAccepted || false,
        createdAt: new Date(question.createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Within 7 days of question
        updatedAt: new Date()
      });
      await answer.save();

      // Update question answer count
      question.answerCount = (question.answerCount || 0) + 1;
      if (aData.isAccepted) {
        question.acceptedAnswer = answer._id;
      }
      await question.save();

      console.log(`  ✅ Created answer for: ${question.title.substring(0, 40)}...`);
    }

    // Create some comments
    console.log('💭 Creating comments...');
    const commentData = [
      { questionIndex: 0, body: 'Great question! I had the same issue.', authorUsername: 'emma_dev' },
      { questionIndex: 0, body: 'Thanks for asking this, very helpful!', authorUsername: 'mike_codes' },
      { questionIndex: 1, body: 'This helped me understand Strict Mode better.', authorUsername: 'john_doe' },
      { questionIndex: 2, body: 'Excellent explanation!', authorUsername: 'lisa_tech' },
      { questionIndex: 3, body: 'I also struggled with this, thanks!', authorUsername: 'david_web' },
    ];

    for (const cData of commentData) {
      const question = questions[cData.questionIndex];
      if (!question) continue;

      const author = userMap[cData.authorUsername];
      if (!author) continue;

      const comment = new Comment({
        body: cData.body,
        author: author._id,
        targetType: 'question',
        targetId: question._id,
        createdAt: new Date(question.createdAt.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000)
      });
      await comment.save();
    }

    console.log('✅ Created comments');

    // Create some votes
    console.log('👍 Creating votes...');
    // Add some upvotes to questions
    for (let i = 0; i < Math.min(questions.length, 5); i++) {
      const question = questions[i];
      const voter = users[Math.floor(Math.random() * users.length)];
      
      // Simulate some votes
      for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
        const randomVoter = users[Math.floor(Math.random() * users.length)];
        if (randomVoter._id.toString() !== question.asker.toString()) {
          const vote = new Vote({
            user: randomVoter._id,
            targetType: 'question',
            targetId: question._id,
            value: 1,
            createdAt: new Date()
          });
          await vote.save();
        }
      }
    }

    console.log('✅ Created votes');

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Users: ${users.length}`);
    console.log(`  - Questions: ${questions.length}`);
    console.log(`  - Answers: ${answersData.length}`);
    console.log(`  - Comments: ${commentData.length}`);
    console.log('\n🔑 Login Credentials:');
    console.log('  Admin: admin@codeq.dev / admin123');
    console.log('  Expert: sarah@codeq.dev / expert123');
    console.log('  Student: john@codeq.dev / student123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();

