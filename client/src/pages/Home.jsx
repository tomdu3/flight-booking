import React from 'react';
import { Navbar } from '../components/Navbar';
import { FlightSearch } from '../components/FlightSearch';
import { FlightOffers } from '../components/FlightOffers';
import { TopDestinations } from '../components/TopDestinations';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <FlightSearch />
        <FlightOffers />
        <TopDestinations />
        <Contact />
      </main>
      <Footer />
    </>
  );
};