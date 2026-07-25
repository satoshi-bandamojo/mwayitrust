import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.tsx'
import AdminLayout from './layouts/AdminLayout.tsx'
import ProtectedRoute from './components/shared/ProtectedRoute.tsx'

const Home = lazy(() => import('./pages/Home.tsx'))
const About = lazy(() => import('./pages/About.tsx'))
const Programs = lazy(() => import('./pages/Programs.tsx'))
const ProgramDetails = lazy(() => import('./pages/ProgramDetails.tsx'))
const Stories = lazy(() => import('./pages/Stories.tsx'))
const StoryDetails = lazy(() => import('./pages/StoryDetails.tsx'))
const Events = lazy(() => import('./pages/Events.tsx'))
const Gallery = lazy(() => import('./pages/Gallery.tsx'))
const Donate = lazy(() => import('./pages/Donate.tsx'))
const Contact = lazy(() => import('./pages/Contact.tsx'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.tsx'))

const Login = lazy(() => import('./pages/admin/Login.tsx'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard.tsx'))
const ManageStories = lazy(() => import('./pages/admin/ManageStories.tsx'))
const ManageEvents = lazy(() => import('./pages/admin/ManageEvents.tsx'))
const ManageGallery = lazy(() => import('./pages/admin/ManageGallery.tsx'))
const ManageDonations = lazy(() => import('./pages/admin/ManageDonations.tsx'))
const ManageSubscribers = lazy(() => import('./pages/admin/ManageSubscribers.tsx'))
const ManageContacts = lazy(() => import('./pages/admin/ManageContactMessages.tsx'))

export const routes = [
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/programs', element: <Programs /> },
      { path: '/programs/:slug', element: <ProgramDetails /> },
      { path: '/stories', element: <Stories /> },
      { path: '/stories/:id', element: <StoryDetails /> },
      { path: '/events', element: <Events /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/donate', element: <Donate /> },
      { path: '/contact', element: <Contact /> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
    ],
  },
  {
    path: '/admin/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'stories', element: <ManageStories /> },
          { path: 'events', element: <ManageEvents /> },
          { path: 'gallery', element: <ManageGallery /> },
          { path: 'donations', element: <ManageDonations /> },
          { path: 'subscribers', element: <ManageSubscribers /> },
          { path: 'contacts', element: <ManageContacts /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to='/' replace /> },
]