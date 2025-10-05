import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { products } from '../data/products'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'
import { ArrowLeft, Download } from 'lucide-react'
import VisitorForm from '../components/VisitorForm'

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const [showVisitorForm, setShowVisitorForm] = useState(false)

  const product = products.find(p => p.id === Number(productId))

  useEffect(() => {
    if (!product) {
      navigate('/404', { replace: true })
    }
  }, [product, navigate])

  if (!product) {
    return null
  }

  const Icon = product.icon

  const handleDownload = () => {
    const content = `${product.name}\n\n${product.features.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nAsian Paints PPG Private Limited\nPlot No. 5, Gaiwadi Industrial Estate, S V Road, Goregaon (West), Mumbai 400 062\nTel: +91 (22) 6218 2700\nEmail: customercare.apppg@asianpaintsppg.com\nWebsite: www.asianpaintsppg.com`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${product.name.replace(/\s+/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Helmet>
        <title>{product.name} - CORCON 2025 | Asian Paints PPG</title>
        <meta name="description" content={product.features.slice(0, 3).join('. ')} />
        <meta property="og:title" content={`${product.name} - CORCON 2025`} />
        <meta property="og:description" content={product.features[0]} />
        <link rel="canonical" content={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="mb-8 gap-2"
              aria-label="Go back to home page"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Button>

            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Product Image */}
              <div className="relative h-96 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  loading="eager"
                />
                <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-primary rounded-xl shadow-lg flex items-center justify-center">
                  <Icon className="w-10 h-10 text-white" aria-hidden="true" />
                </div>
              </div>

              {/* Product Content */}
              <div className="p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">{product.name}</h1>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features & Benefits</h2>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-primary text-xl font-bold mt-1 flex-shrink-0" aria-hidden="true">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="gap-2"
                    aria-label={`Download ${product.name} information`}
                  >
                    <Download className="w-4 h-4" />
                    Download Info
                  </Button>
                  <Button
                    onClick={() => setShowVisitorForm(true)}
                    className="bg-gradient-to-r from-secondary-600 to-secondary-500 text-white hover:opacity-90 transition-opacity"
                  >
                    Request a Quote
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </main>

        <Footer />

        <VisitorForm
          open={showVisitorForm}
          onClose={() => setShowVisitorForm(false)}
          context="quote"
        />
      </div>
    </>
  )
}

export default ProductDetailPage
