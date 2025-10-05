import type { Product } from '../data/products'
import { Dialog, DialogContent } from './ui/dialog'
import { Button } from './ui/button'
import { Download, MessageSquare } from 'lucide-react'

interface ProductDetailModalProps {
  product: Product | null
  onClose: () => void
  onRequestQuote: () => void
}

const ProductDetailModal = ({ product, onClose, onRequestQuote }: ProductDetailModalProps) => {
  if (!product) return null

  const Icon = product.icon

  const handleDownload = () => {
    const content = `${product.name}\n\n${product.features.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nAsian Paints PPG Private Limited\nwww.asianpaintsppg.com`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${product.name.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        {/* Product Image Header */}
        <div className="relative overflow-hidden rounded-t-lg -m-0 h-[280px] bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 to-black/70" />

          {/* Icon Badge */}
          <div className="absolute top-5 right-5 w-16 h-16 bg-gradient-primary rounded-2xl shadow-2xl flex items-center justify-center">
            <Icon className="w-9 h-9 text-white" aria-hidden="true" />
          </div>

          {/* Product Name Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-6 z-10">
            <h2 className="text-4xl font-bold text-white mb-1" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
              {product.name}
            </h2>
            <p className="text-white/90 text-sm">
              {product.features.length} Key Features & Benefits
            </p>
          </div>
        </div>

        <div className="p-6 pb-8">
          <div className="mb-6 mt-2">
            <h3 className="font-bold text-xl mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Key Features
            </h3>
            <div className="space-y-3">
              {product.features.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl flex items-start gap-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 transition-all duration-300 hover:border-primary hover:translate-x-1 hover:from-white hover:to-gray-50"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-primary text-white text-xs font-bold shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-8 border-t-2 border-gray-200">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center gap-2 py-6 rounded-xl"
            >
              <Download className="w-5 h-5" />
              Download Details
            </Button>
            <Button
              onClick={onRequestQuote}
              className="flex-1 bg-gradient-to-r from-secondary-600 to-secondary-500 text-white hover:opacity-90 flex items-center justify-center gap-2 py-6 rounded-xl"
            >
              <MessageSquare className="w-5 h-5" />
              Request Quote
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductDetailModal
