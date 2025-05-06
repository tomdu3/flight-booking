import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="background-container" aria-hidden="true"></div>
      <div className="min-h-screen">
        <Outlet />
      </div>
    </>
  );
}

export default App;