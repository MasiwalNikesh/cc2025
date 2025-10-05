import { Link } from 'react-router-dom'
import { products } from '../data/products'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const ProductGrid = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Our Product Range
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Explore our comprehensive selection of industrial coating solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => {
            const Icon = product.icon
            return (
              <div
                key={product.id}
                className="animate-fadeInUp"
                style={{
                  animationDelay: `${idx * 0.1}s`,
                  animationFillMode: 'both'
                }}
              >
                <Link to={`/product/${product.id}`} className="block h-full group">
                  <Card className="h-full bg-white border-none rounded-2xl shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-3 hover:scale-[1.02] overflow-hidden cursor-pointer">
                    {/* Product Image */}
                    <div className="relative overflow-hidden h-[200px] bg-gradient-to-br from-gray-100 to-gray-200">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/30" />
                      {/* Icon Badge */}
                      <div className="absolute top-3 right-3 w-12 h-12 bg-gradient-primary rounded-xl shadow-lg flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                      </div>
                    </div>

                    <CardHeader className="p-4 pb-3">
                      <CardTitle className="text-xl font-bold mb-0 text-gray-900">
                        {product.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-4 pt-0">
                      <ul className="list-none mb-4">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start mb-3 text-sm text-gray-700"
                          >
                            <span className="text-primary text-xl font-bold leading-none mr-2 mt-1" aria-hidden="true">
                              ✓
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-500">
                          {product.features.length} features
                        </span>
                        <span className="text-secondary font-semibold flex items-center gap-2 text-sm group-hover:text-secondary-600 transition-colors">
                          Learn More
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm.93 4.97l2.87 2.87H4.5a.75.75 0 0 0 0 1.5h7.3l-2.87 2.87a.75.75 0 1 0 1.06 1.06l4.19-4.19a.75.75 0 0 0 0-1.06l-4.19-4.19a.75.75 0 0 0-1.06 1.06z"/>
                          </svg>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ProductGrid
