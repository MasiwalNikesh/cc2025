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
    const { name, email, company, phone, designation, context } = req.body;

    // Validate required fields
    if (!name || !email || !company || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email notification
    const emailData = await resend.emails.send({
      from: 'CORCON 2025 <noreply@yourdomain.com>',
      to: 'customercare.apppg@asianpaintsppg.com',
      subject: `New ${context === 'quote' ? 'Quote' : 'Consultation'} Request - CORCON 2025`,
      html: `
        <h2>New ${context === 'quote' ? 'Quote' : 'Consultation'} Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${designation ? `<p><strong>Designation:</strong> ${designation}</p>` : ''}
        <p><strong>Request Type:</strong> ${context}</p>
        <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      emailId: emailData.data?.id
    });
  } catch (error) {
    console.error('Error submitting visitor form:', error);
    return res.status(500).json({
      error: 'Failed to submit form',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
