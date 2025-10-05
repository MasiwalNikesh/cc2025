import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('../pages/HomePage'))
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'))
const AdminPage = lazy(() => import('../pages/AdminPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: '/product/:productId',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ProductDetailPage />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AdminPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
