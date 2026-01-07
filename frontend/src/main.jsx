import { StrictMode } from 'react'; // Wraps the app to highlight potential problems in the application
import { createRoot } from 'react-dom/client'; // Method to create the root of the React application
import { BrowserRouter } from 'react-router-dom'; // Router for handling navigation in the app
import { ClerkProvider } from '@clerk/clerk-react'; // Provider for Clerk authentication
import { Analytics } from '@vercel/analytics/react'; // Vercel analytics integration
import { ThemeProvider } from 'next-themes';

import App from './App.jsx'; // Main application component
import './index.css'; // Global CSS styles
import { AppProvider } from './context/appContext.jsx'; // Context provider for global app state

// Get the Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if the key is missing and throw an error if so
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

// Render the application into the root element in the HTML
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Enable client-side routing */}
    <BrowserRouter>
      {/* Provide Clerk authentication context */}
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* Provide global app context */}
          <AppProvider>
            <App />
          </AppProvider>
        </ThemeProvider>
        {/* Enable analytics */}
        <Analytics />
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);