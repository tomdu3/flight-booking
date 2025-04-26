import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      <div className="background-container" aria-hidden="true"></div>
      <div className="min-h-screen">
        <Outlet />
      </div>
    </>
  );
}

export default App;