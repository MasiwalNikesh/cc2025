import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Button } from '../components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>Page Not Found - CORCON 2025</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-2xl">
            <div className="mb-8">
              <h1 className="text-9xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                404
              </h1>
              <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
                Page Not Found
              </h2>
              <p className="text-gray-600 text-lg">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="gap-2"
                aria-label="Go back to previous page"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="bg-gradient-primary text-white gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

export default NotFoundPage
