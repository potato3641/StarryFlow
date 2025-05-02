import React, { useState } from 'react';
import './NavDial.css';
import { activateFabShadowStyle, deactivateFabShadowStyle } from '../style'; // icon style
import { SpeedDial, SpeedDialAction, Snackbar, Slide, Box } from '@mui/material'; // component
import Tooltip from '@mui/material/Tooltip';
import { Save, Replay, Share, Settings, ZoomInMap, Sort, Add, Verified } from '@mui/icons-material'; // icon
import { keyframes } from '@mui/system';
import { useSelector } from 'react-redux';

const dialIcon = (onAdd, flag) => {
  return (
    <Tooltip title="Setting Complete" placement='left'>
      {flag ? (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
          }}
          onClick={() => { onAdd(); }} // 정상화하는 핸들러 갖고와!
        >
          <Verified />
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
          }}
          onClick={() => { onAdd(); }}
        >
          <Add />
        </Box>
      )}
    </Tooltip>)
}

const sparkle = keyframes`
  0%, 100% { box-shadow: 0 0 0 rgba(255,255,224,0); }
  50% { box-shadow: 0 0 8px rgba(255,255,224,0.8), 0 0 16px rgba(255,255,224,0.4); }
`;

function SlideTransition(props) {
  return <Slide {...props} direction="right" />;
}

const NavDial = ({ onAdd, onSave, onRestore, onFit, onSort, goSet }) => {

  // REDUX
  // REACT
  const setModeFlag = useSelector((state) => state.flow.setModeFlag);
  const [state, setState] = useState({
    open: false,
    Transition: SlideTransition,
    message: '',
  })

  const handleClick = (message = 'Done') => {
    setState({
      ...state,
      open: true,
      message,
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  const actions = [
    { id: '1', icon: <Save />, name: 'Save', onClick: () => { onSave(); handleClick('Saved'); } },
    { id: '2', icon: <Replay />, name: 'Restore', onClick: () => { onRestore(); handleClick('Flow Restored'); } },
    { id: '3', icon: <ZoomInMap />, name: 'FitView', onClick: () => { onFit(); handleClick(); } },
    { id: '4', icon: <Sort />, name: 'Sort', onClick: () => { onSort(); handleClick('Sorted'); } },
    { id: '5', icon: <Settings />, name: 'Settings', onClick: () => { goSet(); handleClick('Settings Canvas Drawing...'); } },
    { id: '6', icon: <Share />, name: 'Share', onClick: () => { handleClick('not working'); } },
  ];

  const setModeActions = ['3', '4'];

  return (
    <div>
      <SpeedDial
        ariaLabel='SpeedDial for drawing map'
        open={true}
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
        icon={dialIcon(onAdd, setModeFlag)}
        openIcon={dialIcon(onAdd, setModeFlag)}
      >
        {(setModeFlag ? actions.filter(action => setModeActions.includes(action.id)) : actions).map((action) => (
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
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        message={state.message}
        key={Date.now()}
        autoHideDuration={800}
        ContentProps={{
          sx: {
            background: "linear-gradient(135deg, #A6FFFA 10%, #81E6D9 50%, #D6BCFA 90%)",
            color: 'black',
            borderRadius: 4,
            boxShadow: "0 0 12px rgba(166, 255, 250, 0.6), 0 0 24px rgba(217, 185, 255, 0.4)",
            backdropFilter: "blur(6px)",
            px: 2, py: 1,
            position: "relative",
            fontSize: '1rem',
            minWidth: '1rem !important',
            fontWeight: 600,
            animation: `${sparkle} 0.8s ease-in-out infinite`,
          },
        }}
      />
    </div>
  );
};

export default NavDial;