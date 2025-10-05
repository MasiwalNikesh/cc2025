import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from './ui/button'
import { RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-5xl text-white">⚠️</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                We apologize for the inconvenience. An unexpected error occurred.
              </p>
              {this.state.error && (
                <details className="mt-6 text-left bg-gray-100 rounded-lg p-4">
                  <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                    Error Details
                  </summary>
                  <pre className="text-sm text-gray-600 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="gap-2"
                aria-label="Try again"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              <Button
                onClick={this.handleGoHome}
                className="bg-gradient-primary text-white gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Homepage
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
