import React from 'react';
import './NavDial.css';
import { activateFabShadowStyle, deactivateFabShadowStyle } from '../style'; // icon style
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material'; // component
import { Sort, Save, Share } from '@mui/icons-material'; // icon

const actions = [
  { icon: <Save />, name: 'Save' },
  { icon: <Sort />, name: 'Sort' },
  { icon: <Share />, name: 'Share' },
];

const NavDial = () => {
  return (
    <div>
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

export default NavDial;