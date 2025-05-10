import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import {
  ReactFlowProvider,
} from '@xyflow/react';
import './MapPage.css';
import '@xyflow/react/dist/style.css';
import FlowCanvas from '../features/FlowCanvas'
import StarryParticles from '../features/StarryParticles'

const MapPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  if (!roomId) {
    navigate('/map/local', { replace: true });
  }

  return (
    <div>
      <ReactFlowProvider>
        <FlowCanvas roomId={roomId} />
      </ReactFlowProvider>
      <StarryParticles />
    </div>
  )
}

export default MapPage;