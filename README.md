# Expense Tracker Web Application

A modern, feature-rich expense tracking application built with React, TypeScript, and Supabase. Track your income and expenses with beautiful visualizations, smart insights, and intelligent budget management.

## Features

### Core Functionality

#### 1. Dashboard Overview
- **Total Income**: View your cumulative income
- **Total Expense**: Track all your expenses
- **Current Balance**: Real-time balance calculation
- Beautiful animated cards with gradient designs

#### 2. Transaction Management
- **Add/Edit Transactions**: Complete form with:
  - Title and amount
  - Type (Income/Expense)
  - Category selection
  - Date picker
  - Optional notes
  - Emotion tracking (Happy/Neutral/Regret)
- **Transaction History**:
  - Clean, organized list view
  - Search functionality
  - Filter by type (Income/Expense/All)
  - Filter by category
  - Sort by date or amount
  - Edit and delete options

#### 3. Analytics & Visualizations
- **Pie Chart**: Category-wise expense distribution
- **Bar Chart**: Monthly income vs expense trends (last 6 months)
- **Line Chart**: Income and expense trend analysis
- Interactive tooltips with detailed information

#### 4. Budget Tracker
- Set monthly spending limits
- Real-time progress tracking with visual indicators:
  - 🟢 Green: Under 80% (Safe zone)
  - 🟡 Yellow: 80-100% (Approaching limit)
  - 🔴 Red: Over 100% (Budget exceeded)
- Budget usage percentage display
- Remaining budget calculation
- Smart alerts and recommendations

#### 5. Smart Insights
- **Spending Trend Analysis**: Compare current month vs previous month
- **Category Alerts**: Identify categories consuming large portions of budget
- **Regretful Spending**: Track and analyze purchases tagged with regret
- **Spending Forecast**: Predict monthly spending based on current patterns
- **Motivational Quotes**: Daily financial wisdom and encouragement

#### 6. Emotion-Based Tracking
- Tag transactions with emotions:
  - 😄 Happy
  - 😐 Neutral
  - 😔 Regret
- Analyze emotional spending patterns
- Get insights on regretful purchases

### Design & UX

#### 7. Dark/Light Mode
- Toggle between light and dark themes
- Preference saved per user
- All components fully styled for both modes
- Smooth transitions

#### 8. Authentication
- Secure email/password authentication via Supabase
- User registration and login
- Protected routes and data
- Profile management

#### 9. Responsive Design
- Fully responsive across all devices:
  - Mobile (320px+)
  - Tablet (768px+)
  - Desktop (1024px+)
- Optimized layouts for each screen size

#### 10. Smooth Animations
- Framer Motion powered animations
- Smooth page transitions
- Interactive hover effects
- Loading states

### Data & Security

#### 11. Persistent Storage
- Supabase database for reliable data storage
- Row Level Security (RLS) for data protection
- Automatic data backup
- Fast query performance with indexes

#### 12. User Privacy
- Each user can only access their own data
- Secure authentication flow
- Protected API endpoints
- No data sharing between users

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite

## Getting Started

1. The application is already configured with Supabase
2. Sign up to create a new account
3. Start adding transactions to track your finances
4. Set a monthly budget to monitor spending
5. Explore analytics to understand your financial patterns

## Smart Features Explained

### Spending Insights
The app analyzes your spending patterns and provides:
- Percentage changes in spending vs previous month
- Top spending categories with alerts
- Regretful spending analysis
- Projected monthly spending based on current trends

### Budget Intelligence
- Automatic progress calculation
- Color-coded status indicators
- Personalized recommendations
- Overspending alerts

### Emotion Tracking
Track how you feel about purchases to:
- Identify impulse buying patterns
- Calculate regretful spending percentage
- Make better financial decisions
- Build healthier spending habits

## Database Schema

### Tables
- **profiles**: User profile information
- **transactions**: All income and expense records
- **budgets**: Monthly budget limits
- **user_preferences**: Theme and currency settings

All tables have Row Level Security enabled for data protection.

## Future Enhancements

Potential features for future versions:
- Export transactions to CSV
- Recurring transactions
- Multiple currency support
- Category customization
- Spending goals and challenges
- Social sharing of achievements
- Bill reminders
- Receipt uploads
- Multi-user household budgets

---

Built with ❤️ using React, TypeScript, and Supabase
