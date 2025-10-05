import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Resend } from 'resend';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
// Submit Feedback
app.post('/api/submit-feedback', async (req, res) => {
  try {
    const { rating, comments } = req.body;

    // Validate required fields
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating' });
    }

    // Send email notification
    const emailData = await resend.emails.send({
      from: 'CORCON 2025 <noreply@webappindia.in>',
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
});

// Submit Visitor
app.post('/api/submit-visitor', async (req, res) => {
  try {
    const { name, email, company, phone, designation, context } = req.body;

    // Validate required fields
    if (!name || !email || !company || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email notification
    const emailData = await resend.emails.send({
      from: 'CORCON 2025 <noreply@webappindia.in>',
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
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// The "catchall" handler: for any request that doesn't match API routes,
// send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
