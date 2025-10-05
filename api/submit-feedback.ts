import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rating, comments } = req.body;

    // Validate required fields
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating' });
    }

    // Send email notification
    const emailData = await resend.emails.send({
      from: 'CORCON 2025 <noreply@yourdomain.com>',
      to: 'customercare.apppg@asianpaintsppg.com',
      subject: 'New Feedback Received - CORCON 2025',
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>Rating:</strong> ${'⭐'.repeat(rating)} (${rating}/5)</p>
        ${comments ? `<p><strong>Comments:</strong></p><p>${comments}</p>` : '<p><em>No comments provided</em></p>'}
        <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      emailId: emailData.data?.id
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({
      error: 'Failed to submit feedback',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
