import React from 'react';
import {Navbar} from '../components/Navbar';
import desktopBackground from '../assets/img/bg-beach.webp';
import mobileBackground from '../assets/img/bg-beach-mobile.webp';

export const Home = () => {
  return (
    <>
      <div className="background-container h-screen w-screen">
        <Navbar />
      </div>
    </>
  )
}