# Illustriober Creatives — Website Inquiry Form

A premium, high-craft multi-step client intake form for web design and branding inquiries. Designed to provide a seamless, scholarly experience for potential clients to outline their project goals, features, and budget.

![Screenshot placeholders would go here](/public/favicon.svg)

## ✨ Key Features

- **7-Step Inquiry Wizard**: A structured journey from business info to final project nuances.
- **Custom Design System**: Dark-themed "Scholarly Utility" aesthetic with gold accents and fluid animations.
- **Real-time Analytics Dashboard**: PIN-protected view (`/dashboard`) to track started, submitted, and abandoned briefs.
- **EmailJS Integration**: Direct delivery of formatted inquiries to your inbox.
- **Responsive & Accessible**: Optimized for all devices with premium micro-interactions.

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Form Management**: React Hook Form + Zod
- **Email Delivery**: [EmailJS](https://www.emailjs.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/website-inquiry.git
   cd website-inquiry
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and fill in your keys:
   ```bash
   cp .env.example .env
   ```
   Required keys:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
   - `VITE_DASHBOARD_PIN` (4-6 digits for dashboard access)

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📊 Admin Dashboard

Access the private dashboard at `/dashboard` to view collected briefs and conversion stats. The dashboard is protected by the PIN set in your environment variables.

## 📦 Deployment

This application is set up for one-click deployment on **Vercel**:

- Ensure `vercel.json` is included for SPA routing.
- Set up all `VITE_*` environment variables in the Vercel project settings.

## 📄 License

MIT
