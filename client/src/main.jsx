import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routers/router';
import { AuthProvider } from './context/AuthProvider.jsx'; // Import AuthProvider


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* Wrap RouterProvider with AuthProvider */}
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
