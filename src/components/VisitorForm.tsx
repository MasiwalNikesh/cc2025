import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { CheckCircle2 } from 'lucide-react'
import { saveVisitorSubmission } from '../lib/db'

interface VisitorFormProps {
  open: boolean
  onClose: () => void
  context: 'consultation' | 'quote'
}

interface FormData {
  name: string
  email: string
  company: string
  phone: string
  designation: string
}

const VisitorForm = ({ open, onClose, context }: VisitorFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    designation: ''
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Partial<FormData> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.company.trim()) newErrors.company = 'Company is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Save to IndexedDB
    const result = await saveVisitorSubmission({
      ...formData,
      context
    })

    if (result.success) {
      console.log('Visitor submission saved successfully with ID:', result.id)
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', company: '', phone: '', designation: '' })
        onClose()
      }, 2000)
    } else {
      console.error('Failed to save visitor submission:', result.error)
      alert('Failed to save your submission. Please try again.')
    }
  }

  const handleClose = () => {
    setFormData({ name: '', email: '', company: '', phone: '', designation: '' })
    setErrors({})
    setSubmitted(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-2xl font-bold">
            {context === 'consultation' ? 'Request Consultation' : 'Request Quote'}
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-12 px-4">
            <CheckCircle2 className="text-green-600 mx-auto mb-6 w-16 h-16" />
            <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
            <p className="text-gray-600">
              Your request has been submitted successfully. We'll get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-4 pb-4 space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-lg border-2 px-4 py-3 transition-colors ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'}`}
              />
              {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-lg border-2 px-4 py-3 transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'}`}
              />
              {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
            </div>

            <div>
              <Label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-1">Company *</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`w-full rounded-lg border-2 px-4 py-3 transition-colors ${errors.company ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'}`}
              />
              {errors.company && <div className="text-red-600 text-sm mt-1">{errors.company}</div>}
            </div>

            <div>
              <Label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Phone *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full rounded-lg border-2 px-4 py-3 transition-colors ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'}`}
              />
              {errors.phone && <div className="text-red-600 text-sm mt-1">{errors.phone}</div>}
            </div>

            <div>
              <Label htmlFor="designation" className="block text-sm font-semibold text-gray-700 mb-1">Designation</Label>
              <Input
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:border-primary transition-colors"
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-primary text-white hover:opacity-90 mt-4 py-6 text-base font-semibold rounded-lg">
              Submit
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default VisitorForm
