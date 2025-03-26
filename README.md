# Hackmos Dashboard

A beautiful, fully responsive dashboard for managing user notifications, newsletters, and team settings. Built with Next.js and TailwindCSS.

## Features

- **Overview Dashboard**: Monitor key metrics including total users, notifications sent, newsletter conversion rates, and more
- **User Management**: View and manage user authorizations and permissions
- **Newsletter Stats**: Track engagement metrics like open rates and click-through rates
- **Team Management**: Add and manage team members with role-based permissions
- **Service Management**: Enable/disable services like Email, Push, SMS, and Data Storage
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatically adapts to system preferences

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

### Running the Dashboard

Use the provided start script:

```bash
./start-dashboard.bat
```

Or run manually:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Structure

- `/app` - Next.js application pages
  - `/dashboard` - Main dashboard pages
  - `/dashboard/settings` - Settings page
  - `/dashboard/users` - User management
  - `/dashboard/newsletters` - Newsletter stats and management
- `/components` - Reusable UI components
  - `/app` - Application-specific components
  - `/catalyst` - Core UI component library
- `/contexts` - React context providers
- `/public` - Static assets
- `/util` - Utility functions

## Technologies

- Next.js
- React
- TailwindCSS
- TypeScript

## Troubleshooting

If you encounter a "'next' is not recognized" error, try reinstalling dependencies:

```bash
npm cache clean --force
npm install --legacy-peer-deps
```

## License

MIT
