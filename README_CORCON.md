# CORCON 2025 - Asian Paints PPG Exhibition Landing Page

A modern, professional landing page for the Asian Paints PPG Corcon 2025 exhibition showcasing industrial coating solutions.

## Features

✅ **Responsive Design** - Works on mobile, tablet, and desktop
✅ **Product Showcase** - 6 industrial coating products with detailed information
✅ **Interactive Modals** - Product details, visitor forms, and feedback forms
✅ **File Download** - Download product information as text files
✅ **Form Validation** - Visitor information and feedback forms with validation
✅ **Modern UI** - Built with React, TypeScript, Tailwind CSS, and shadcn/ui components
✅ **Smooth Animations** - Hover effects and transitions throughout

## Product Categories

1. **Corrosion Under Insulation (CUI) Coating** - High-temperature corrosion protection
2. **METACARE** - Advanced protective coating system
3. **PPG PITT-CHAR NX** - Intumescent fire protection coating
4. **Sustainable Finish Solutions** - Eco-friendly coating solutions
5. **Tank Linings** - Specialized coatings for storage tanks
6. **Protective Coatings Solution** - Comprehensive industrial coatings

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── Header.tsx      # Header with branding
│   ├── Hero.tsx        # Hero section
│   ├── ProductGrid.tsx # Product cards grid
│   ├── ProductDetailModal.tsx  # Product details modal
│   ├── VisitorForm.tsx         # Visitor information form
│   ├── FeedbackForm.tsx        # Feedback form with star rating
│   ├── CTASection.tsx          # Call-to-action section
│   └── Footer.tsx              # Footer with contact info
├── data/
│   └── products.ts     # Product data with features
├── lib/
│   └── utils.ts        # Utility functions
├── App.tsx             # Main app component
└── index.css           # Global styles with Tailwind

```

## Features in Detail

### Product Cards
- Gradient headers with icons
- Preview of 3 key features
- "View Details" button
- Hover effects with shadow and transform

### Product Detail Modal
- Full product information
- All features listed
- Download product info as text file
- Request quote button

### Visitor Information Form
- Required fields: Name, Email, Company, Phone
- Optional: Designation
- Form validation
- Success message
- Used for both consultations and quote requests

### Feedback Form
- Interactive 1-5 star rating
- Optional comments
- Success message
- Data logged to console

### Download Functionality
- Downloads product information as .txt file
- Includes product name, all features, and company info
- Automatic file naming based on product

## Data Logging

All form submissions and interactions are logged to the browser console:
- Visitor form submissions (with context: consultation or quote)
- Feedback submissions (rating and comments)
- Timestamp included with all logs

## Customization

### Update Product Data
Edit `src/data/products.ts` to modify product information and features.

### Styling
- Tailwind classes for quick styling changes
- Gradient colors can be adjusted in component files
- Theme can be customized in `tailwind.config.js`

### Company Information
Update footer contact details in `src/components/Footer.tsx`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contact

**Asian Paints PPG Private Limited**
- Address: Plot No. 5, Gaiwadi Industrial Estate, S V Road, Goregaon (West), Mumbai 400 062
- Tel: +91 (22) 6218 2700
- Email: customercare.apppg@asianpaintsppg.com
- Website: www.asianpaintsppg.com
- CIN: U24110MH2011PTC220557

---

*50:50 Joint Venture - Asian Paints Limited × PPG Industries, USA*
