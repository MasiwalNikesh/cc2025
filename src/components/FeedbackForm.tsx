import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Star, CheckCircle2 } from 'lucide-react'
import { saveFeedbackSubmission } from '../lib/db'

interface FeedbackFormProps {
  open: boolean
  onClose: () => void
}

const FeedbackForm = ({ open, onClose }: FeedbackFormProps) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comments, setComments] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Save to IndexedDB
    const result = await saveFeedbackSubmission({
      rating,
      comments: comments || undefined
    })

    if (result.success) {
      console.log('Feedback submission saved successfully with ID:', result.id)
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setRating(0)
        setComments('')
        onClose()
      }, 2000)
    } else {
      console.error('Failed to save feedback submission:', result.error)
      alert('Failed to save your feedback. Please try again.')
    }
  }

  const handleClose = () => {
    setRating(0)
    setComments('')
    setSubmitted(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-2xl font-bold">Share Your Feedback</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-12 px-4">
            <CheckCircle2 className="text-green-600 mx-auto mb-6 w-16 h-16" />
            <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
            <p className="text-gray-600">
              Your feedback has been submitted successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-4 pb-4 space-y-6">
            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-4">Rate Your Experience</Label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-0 border-0 bg-transparent cursor-pointer transition-transform duration-200 hover:scale-110"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`w-10 h-10 ${star <= (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill={star <= (hoveredRating || rating) ? '#fbbf24' : 'none'}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-gray-600 mt-3">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="comments" className="block text-sm font-semibold text-gray-700 mb-1">Comments (Optional)</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share your thoughts with us..."
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:border-primary transition-colors min-h-[100px] resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={rating === 0}
              className="w-full bg-gradient-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-4 py-6 text-base font-semibold rounded-lg"
            >
              Submit Feedback
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackForm
