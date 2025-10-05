import { useState } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'
import VisitorForm from '../components/VisitorForm'
import FeedbackForm from '../components/FeedbackForm'
import { Helmet } from 'react-helmet-async'

const HomePage = () => {
  const [showVisitorForm, setShowVisitorForm] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [visitorFormContext, setVisitorFormContext] = useState<'consultation' | 'quote'>('consultation')

  const handleRequestConsultation = () => {
    setVisitorFormContext('consultation')
    setShowVisitorForm(true)
  }

  return (
    <>
      <Helmet>
        <title>CORCON 2025 - Asian Paints PPG | Industrial Coating Solutions</title>
        <meta name="description" content="Explore Asian Paints PPG's comprehensive range of industrial coating solutions at CORCON 2025. Featuring protective coatings, fire protection, sustainable finishes, and more." />
        <meta name="keywords" content="industrial coatings, protective coatings, fire protection, Asian Paints PPG, CORCON 2025, CUI coating, tank linings" />

        {/* OpenGraph tags */}
        <meta property="og:title" content="CORCON 2025 - Asian Paints PPG Exhibition" />
        <meta property="og:description" content="Discover innovative industrial coating solutions at CORCON 2025. Asian Paints PPG presents cutting-edge protective coatings and fire protection systems." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="CORCON 2025" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CORCON 2025 - Asian Paints PPG" />
        <meta name="twitter:description" content="Explore industrial coating solutions at CORCON 2025" />

        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-gray-50" lang="en">
        <Header />
        <main id="main-content">
          <Hero />
          <ProductGrid />
          <CTASection
            onRequestConsultation={handleRequestConsultation}
            onShareFeedback={() => setShowFeedbackForm(true)}
          />
        </main>
        <Footer />

        <VisitorForm
          open={showVisitorForm}
          onClose={() => setShowVisitorForm(false)}
          context={visitorFormContext}
        />

        <FeedbackForm
          open={showFeedbackForm}
          onClose={() => setShowFeedbackForm(false)}
        />
      </div>
    </>
  )
}

export default HomePage
