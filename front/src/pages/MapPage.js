import './MapPage.css';
import { activateFabShadowStyle, deactivateFabShadowStyle } from '../style';
import React from 'react';
import DragDiv from '../components/DragDiv'
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import { FileCopy, Save, Share } from '@mui/icons-material';

const actions = [
  { icon: <FileCopy />, name: 'Copy' },
  { icon: <Save />, name: 'Save' },
  { icon: <Share />, name: 'Share' },
];

const MapPage = () => {
  return (
    <div>
      <DragDiv data="data" />
      <SpeedDial
        ariaLabel='SpeedDial for drawing map'
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          '& .MuiSpeedDial-fab': {
            color: 'black',
            ...deactivateFabShadowStyle,
          },
          '& .MuiSpeedDial-fab:hover': {
            ...activateFabShadowStyle,
          }
        }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            sx={{
              ...deactivateFabShadowStyle,
              '&:hover': {
                ...activateFabShadowStyle,
              }
            }}
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default MapPage;