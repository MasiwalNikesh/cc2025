import Dexie, { type Table } from 'dexie'

// Database interfaces
export interface VisitorSubmission {
  id?: number
  name: string
  email: string
  company: string
  phone: string
  designation?: string
  context: 'consultation' | 'quote'
  created_at: string
}

export interface FeedbackSubmission {
  id?: number
  rating: number
  comments?: string
  created_at: string
}

// Database class
class CorconDatabase extends Dexie {
  visitor_submissions!: Table<VisitorSubmission, number>
  feedback_submissions!: Table<FeedbackSubmission, number>

  constructor() {
    super('CorconDB')

    this.version(1).stores({
      visitor_submissions: '++id, name, email, company, context, created_at',
      feedback_submissions: '++id, rating, created_at'
    })
  }
}

// Create database instance
export const db = new CorconDatabase()

// Helper functions for visitor submissions
export async function saveVisitorSubmission(data: Omit<VisitorSubmission, 'id' | 'created_at'>) {
  try {
    const id = await db.visitor_submissions.add({
      ...data,
      created_at: new Date().toISOString()
    })
    return { success: true, id }
  } catch (error) {
    console.error('Failed to save visitor submission:', error)
    return { success: false, error }
  }
}

export async function getAllVisitorSubmissions() {
  try {
    const submissions = await db.visitor_submissions
      .orderBy('created_at')
      .reverse()
      .toArray()
    return submissions
  } catch (error) {
    console.error('Failed to fetch visitor submissions:', error)
    return []
  }
}

export async function deleteVisitorSubmission(id: number) {
  try {
    await db.visitor_submissions.delete(id)
    return { success: true }
  } catch (error) {
    console.error('Failed to delete visitor submission:', error)
    return { success: false, error }
  }
}

export async function clearAllVisitorSubmissions() {
  try {
    await db.visitor_submissions.clear()
    return { success: true }
  } catch (error) {
    console.error('Failed to clear visitor submissions:', error)
    return { success: false, error }
  }
}

// Helper functions for feedback submissions
export async function saveFeedbackSubmission(data: Omit<FeedbackSubmission, 'id' | 'created_at'>) {
  try {
    const id = await db.feedback_submissions.add({
      ...data,
      created_at: new Date().toISOString()
    })
    return { success: true, id }
  } catch (error) {
    console.error('Failed to save feedback submission:', error)
    return { success: false, error }
  }
}

export async function getAllFeedbackSubmissions() {
  try {
    const submissions = await db.feedback_submissions
      .orderBy('created_at')
      .reverse()
      .toArray()
    return submissions
  } catch (error) {
    console.error('Failed to fetch feedback submissions:', error)
    return []
  }
}

export async function deleteFeedbackSubmission(id: number) {
  try {
    await db.feedback_submissions.delete(id)
    return { success: true }
  } catch (error) {
    console.error('Failed to delete feedback submission:', error)
    return { success: false, error }
  }
}

export async function clearAllFeedbackSubmissions() {
  try {
    await db.feedback_submissions.clear()
    return { success: true }
  } catch (error) {
    console.error('Failed to clear feedback submissions:', error)
    return { success: false, error }
  }
}

// Export data to CSV
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    alert('No data to export')
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
        // Escape commas and quotes in values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
