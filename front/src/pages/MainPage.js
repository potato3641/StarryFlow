import './MainPage.css';
import React from 'react';
import MapPage from './MapPage'
import StarryParticles from '../features/StarryParticles'

function MainPage() {

  return (
    <div>
      <MapPage />
      <StarryParticles />
    </div>
  );
}

export default MainPage;