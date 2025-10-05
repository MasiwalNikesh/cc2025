const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white" role="status" aria-live="polite" aria-label="Loading">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
