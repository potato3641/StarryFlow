import React, { useState } from 'react';
import './NavDial.css';
import { activateFabShadowStyle, deactivateFabShadowStyle } from '../style'; // icon style
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material'; // component
import { Save, Share } from '@mui/icons-material'; // icon

const NavDial = () => {

  // REDUX
  // REACT
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: <Save />, name: 'Save', onclick: null },
    { icon: <Share />, name: 'Share', onClick: null },
  ];

  return (
    <div>
      <SpeedDial
        ariaLabel='SpeedDial for drawing map'
        open={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={(e) => e.stopPropagation()}
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
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default NavDial;