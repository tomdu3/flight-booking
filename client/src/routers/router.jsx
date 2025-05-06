import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx'; // Import ProfilePage
import ProtectedRoute from './ProtectedRoute.jsx'; // Import ProtectedRoute

// Import other pages as needed
// import FlightSearchPage from '../pages/FlightSearchPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      // Example of other routes:
      // {
      //   path: '/flights',
      //   element: <FlightSearchPage />,
      // },
    ],
  },
]);

export default router;