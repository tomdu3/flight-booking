import React from 'react';
import {Navbar} from '../components/Navbar';
import desktopBackground from '../assets/img/bg-beach.webp';
import mobileBackground from '../assets/img/bg-beach-mobile.webp';
import { FlightSearch } from '../components/FlightSearch';

export const Home = () => {
  return (
    <>
      <div className="background-container h-screen w-screen" aria-label='page container and background'>
        <Navbar />
        <FlightSearch />
      </div>

    </>
  )
}