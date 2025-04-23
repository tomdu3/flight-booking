import { Outlet } from 'react-router-dom';
import './App.css'

function App() {


  return (
    <>
      <h1 className="text-3xl font-bold underline underline-offset-4 text-red-500">Flight Booking</h1>
      <Outlet />
    </>
  )
}

export default App;
