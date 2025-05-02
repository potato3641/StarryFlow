import React from 'react';
import {
  ReactFlowProvider,
} from '@xyflow/react';
import './MapPage.css';
import '@xyflow/react/dist/style.css';
import FlowCanvas from '../features/FlowCanvas'

const MapPage = () => {

  return (
    <div>
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </div>
  )
}

export default MapPage;