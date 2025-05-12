# Cybersecurity Portfolio

A modern, secure portfolio website showcasing cybersecurity skills and projects.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
   \`\`\`bash
   git clone https://github.com/yourusername/cybersecurity-portfolio.git
   cd cybersecurity-portfolio
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables
   \`\`\`bash
   cp .env.local.example .env.local
   # Edit .env.local with your values
   \`\`\`

4. Run the development server
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`
# Email Service
EMAIL_PASSWORD=your_email_password
RESEND_API_KEY=your_resend_api_key

# Security
CSRF_SECRET=your_csrf_secret
JWT_SECRET=your_jwt_secret

# Database
DATABASE_URL=your_database_url
\`\`\`

## Project Structure

\`\`\`
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── (admin)/          # Admin pages
│   ├── blog/             # Blog pages
│   ├── projects/         # Project pages
│   └── security/         # Security demo pages
├── components/           # React components
│   ├── admin/            # Admin components
│   ├── analytics/        # Analytics components
│   ├── security/         # Security demo components
│   └── ui/               # UI components
├── lib/                  # Utility functions
│   ├── analytics/        # Analytics utilities
│   └── security/         # Security utilities
├── public/               # Static files
└── scripts/              # Utility scripts
\`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`


