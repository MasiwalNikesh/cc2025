import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import {
  getAllVisitorSubmissions,
  getAllFeedbackSubmissions,
  deleteVisitorSubmission,
  deleteFeedbackSubmission,
  clearAllVisitorSubmissions,
  clearAllFeedbackSubmissions,
  exportToCSV,
  type VisitorSubmission,
  type FeedbackSubmission
} from '../lib/db'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import {
  Download,
  Trash2,
  LogOut,
  Users,
  MessageSquare,
  Eye,
  EyeOff,
  Search
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const ADMIN_PASSWORD_HASH = 'admin123' // In production, use proper hashing

const AdminPage = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<'visitors' | 'feedback'>('visitors')

  const [visitorSubmissions, setVisitorSubmissions] = useState<VisitorSubmission[]>([])
  const [feedbackSubmissions, setFeedbackSubmissions] = useState<FeedbackSubmission[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      loadData()
    }
  }, [])

  const loadData = async () => {
    setLoading(true)
    const visitors = await getAllVisitorSubmissions()
    const feedback = await getAllFeedbackSubmissions()
    setVisitorSubmissions(visitors)
    setFeedbackSubmissions(feedback)
    setLoading(false)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD_HASH) {
      localStorage.setItem('admin_auth', 'true')
      setIsAuthenticated(true)
      loadData()
    } else {
      alert('Incorrect password')
      setPassword('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    setIsAuthenticated(false)
    navigate('/')
  }

  const handleDeleteVisitor = async (id: number) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      await deleteVisitorSubmission(id)
      loadData()
    }
  }

  const handleDeleteFeedback = async (id: number) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      await deleteFeedbackSubmission(id)
      loadData()
    }
  }

  const handleClearAllVisitors = async () => {
    if (confirm('Are you sure you want to delete ALL visitor submissions? This cannot be undone!')) {
      await clearAllVisitorSubmissions()
      loadData()
    }
  }

  const handleClearAllFeedback = async () => {
    if (confirm('Are you sure you want to delete ALL feedback submissions? This cannot be undone!')) {
      await clearAllFeedbackSubmissions()
      loadData()
    }
  }

  const handleExportVisitors = () => {
    exportToCSV(visitorSubmissions, `visitor-submissions-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const handleExportFeedback = () => {
    exportToCSV(feedbackSubmissions, `feedback-submissions-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const filteredVisitors = visitorSubmissions.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Admin Login - CORCON 2025</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-primary-700 to-primary-600 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Admin Access</h1>
            <p className="text-center text-gray-600 mb-8">Enter password to continue</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pr-12"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button type="submit" className="w-full bg-gradient-primary text-white">
                Login
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Back to Home
              </Button>
            </form>

            <p className="mt-6 text-xs text-gray-500 text-center">
              Default password: admin123
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel - CORCON 2025</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('visitors')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'visitors'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Visitor Submissions ({visitorSubmissions.length})
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'feedback'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="w-5 h-5 inline mr-2" />
                Feedback ({feedbackSubmissions.length})
              </button>
            </div>

            {/* Visitor Submissions */}
            {activeTab === 'visitors' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by name, email, or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleExportVisitors} className="gap-2 bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4" />
                      Export CSV
                    </Button>
                    <Button
                      onClick={handleClearAllVisitors}
                      variant="outline"
                      className="gap-2 text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <p className="text-center py-8 text-gray-500">Loading...</p>
                ) : filteredVisitors.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No submissions yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Company</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Context</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVisitors.map((visitor) => (
                          <tr key={visitor.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">{visitor.name}</td>
                            <td className="py-3 px-4">{visitor.email}</td>
                            <td className="py-3 px-4">{visitor.company}</td>
                            <td className="py-3 px-4">{visitor.phone}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                visitor.context === 'quote'
                                  ? 'bg-secondary/10 text-secondary-700'
                                  : 'bg-primary/10 text-primary-700'
                              }`}>
                                {visitor.context}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {new Date(visitor.created_at).toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleDeleteVisitor(visitor.id!)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Feedback Submissions */}
            {activeTab === 'feedback' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">All Feedback</h2>
                  <div className="flex gap-2">
                    <Button onClick={handleExportFeedback} className="gap-2 bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4" />
                      Export CSV
                    </Button>
                    <Button
                      onClick={handleClearAllFeedback}
                      variant="outline"
                      className="gap-2 text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <p className="text-center py-8 text-gray-500">Loading...</p>
                ) : feedbackSubmissions.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No feedback yet</p>
                ) : (
                  <div className="space-y-4">
                    {feedbackSubmissions.map((feedback) => (
                      <div key={feedback.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-2xl ${
                                  star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                            <span className="ml-2 text-gray-700 font-semibold">
                              ({feedback.rating}/5)
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteFeedback(feedback.id!)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {feedback.comments && (
                          <p className="text-gray-700 mb-2">{feedback.comments}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          {new Date(feedback.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

export default AdminPage
