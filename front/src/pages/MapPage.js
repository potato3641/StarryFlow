import React, { useRef } from 'react';
import {
  ReactFlowProvider,
} from '@xyflow/react';
import './MapPage.css';
import '@xyflow/react/dist/style.css';
import NavDial from '../components/NavDial'
import FlowCanvas from '../components/FlowCanvas'

const MapPage = () => {
  const flowRef = useRef();

  const handleAdjustLayout = () => {
    if (flowRef.current) {
      flowRef.current();
    }
  };

  return (
    <div>
      <ReactFlowProvider>
        <FlowCanvas setAdjustLayoutRef={flowRef} />
      </ReactFlowProvider>
      <NavDial sortLayout={handleAdjustLayout} />
    </div>
  )
}

export default MapPage;