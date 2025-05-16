import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import {
  ReactFlowProvider,
} from '@xyflow/react';
import './MapPage.css';
import '@xyflow/react/dist/style.css';
import FlowCanvas from '../features/FlowCanvas'
import StarryParticles from '../features/StarryParticles'
import GuideOveray from '../features/GuideOveray'

const MapPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  // eslint-disable-next-line
  const [openGuide, setOpenGuide] = useState(false); // default false

  const handleOpenGuide = () => {
    setOpenGuide(true);
  }

  const handleCloseGuide = () => {
    setOpenGuide(false);
  }

  if (!roomId) {
    navigate('/map/local', { replace: true });
  }

  return (
    <div>
      <ReactFlowProvider>
        <FlowCanvas roomId={roomId} openGuide={handleOpenGuide} />
      </ReactFlowProvider>
      <StarryParticles />
      {openGuide && <GuideOveray roomId={roomId} closeGuide={handleCloseGuide} />}
    </div>
  )
}

export default MapPage;