import { z } from 'zod'

// Visitor Form Schema
export const visitorFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name must be at least 2 characters').max(200, 'Company name is too long'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(20, 'Phone number is too long').regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  designation: z.string().max(100, 'Designation is too long').optional().or(z.literal('')),
  context: z.enum(['consultation', 'quote']),
})

export type VisitorFormData = z.infer<typeof visitorFormSchema>

// Feedback Form Schema
export const feedbackFormSchema = z.object({
  rating: z.number().int().min(1, 'Please select a rating').max(5, 'Rating must be between 1 and 5'),
  comments: z.string().max(1000, 'Comments are too long (max 1000 characters)').optional().or(z.literal('')),
})

export type FeedbackFormData = z.infer<typeof feedbackFormSchema>
