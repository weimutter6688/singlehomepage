This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Setup

Before running the application, you need to set up the environment variables:

1. Create a `.env` file in the root directory with the following content:
```
ACCESS_TOKEN=your-secret-token-here
```

This token will be used for both page access authentication and API authentication.

### Authentication System

This application uses token-based authentication at two levels:

1. **Page-level Authentication**: Users must enter a valid access token to access any page of the application. This is enforced by middleware that checks for a valid token cookie.

2. **API Authentication**: The same token is used to authenticate API requests for modifying data (adding, updating, deleting links).

**Features:**
- Login page for entering the access token
- Access token verification against the value in `.env`
- Secure cookie storage of the token (httpOnly, secure in production)
- Logout functionality
- Token validation on all pages and protected API routes

### Running the Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Authentication

This application uses a simple token-based authentication system:

- Reading links is publicly accessible (no authentication required)
- Adding, updating, and deleting links requires authentication
- The access token is defined in the `.env` file on the server and `.env.local` for the client
- You can also set the access token manually using the UI at the bottom of the page

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
