import './MainPage.css';
import React from 'react';
import MapPage from './MapPage'
import NavDial from '../components/NavDial'
import StarryParticles from '../components/StarryParticles'

function MainPage() {

  return (
    <div>
      <MapPage />
      <StarryParticles />
      <NavDial />
    </div>
  );
}

export default MainPage;