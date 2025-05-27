import React, { useState, useEffect } from 'react';
import './NavDial.css';
import {
  activateFabShadowStyle,
  deactivateFabShadowStyle,
  activateFabGlowStyle,
  deactivateFabGlowStyle,
} from '../style'; // icon style
import { SpeedDial, SpeedDialAction, Snackbar, Slide, Box } from '@mui/material'; // component
import Tooltip from '@mui/material/Tooltip';
import { Save, Replay, Share, Settings, ZoomInMap, Sort, Add, Verified, RestoreFromTrash, Home, QuestionMark } from '@mui/icons-material'; // icon
import { keyframes } from '@mui/system';
import { useSelector } from 'react-redux';

const dialIcon = (onAdd, goCanvas, handler, flag) => {
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
          onClick={() => { goCanvas(); handler('Back to the Map', 7); }}
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
          onClick={() => { onAdd(); handler('새 노드 추가됨', 8); }}
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

const NavDial = ({ onAdd, onSave, onRestore, onFit, onSort, goSet, goCanvas, onShare, onReset, onGuide, socketON, hostFlag }) => {

  // REDUX
  const setModeFlag = useSelector((state) => state.flow.setModeFlag);
  // REACT
  const [opener, setOpener] = useState(false);
  const [openLock, setOpenLock] = useState(true);
  const [firstConnectionFlag, setFirstConnectionFlag] = useState(true)
  const [state, setState] = useState({
    open: false,
    Transition: SlideTransition,
    message: '',
  });

  const handleClick = (message = 'Done', tid) => {
    if (state.open && state.tid === tid) return;
    if (tid === 2 || tid === 9) {
      setOpenLock(true);
      setOpener(false);
    }
    setState({
      ...state,
      open: true,
      message,
      tid,
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  const actions = [
    { id: '1', icon: <Save />, name: 'Save', onClick: () => { onSave(); handleClick('Saved', 1); } },
    { id: '2', icon: <Replay />, name: 'Restore', onClick: () => { onRestore(); handleClick('Flow Restored', 2); } },
    { id: '3', icon: <ZoomInMap />, name: 'FitView', onClick: () => { onFit(); handleClick('Done', 3); } },
    { id: '4', icon: <Sort />, name: 'Sort', onClick: () => { onSort(); handleClick('Sorted', 4); } },
    { id: '5', icon: <Settings />, name: 'Settings', onClick: () => { goSet(); handleClick('Settings Canvas Drawing...', 5); } },
    { id: '6', icon: <Share />, name: 'Share', onClick: () => { onShare(); handleClick(`Copy Url${hostFlag ? '' : ' at Local'}`, 6); } },
    { id: '9', icon: <RestoreFromTrash />, name: 'Clear', onClick: () => { onReset(); handleClick('Clear Flow', 9) } },
    { id: '13', icon: <QuestionMark />, name: 'Guide', onClick: () => { onGuide(); handleClick('Open Tutorial', 13) } },
    { id: '12', icon: <Home sx={{ color: 'primary.main' }} />, name: 'You are Host', onClick: () => { handleClick('You are Host', 12) } },
  ];

  const setModeActions = ['3'];
  const socketActions = ['3', '4', '5', '6', '9', '12', '13'].filter(action => hostFlag || action !== '12');

  useEffect(() => {
    if (socketON === true)
      handleClick('Socket connected', 10)
    else
      firstConnectionFlag ? setFirstConnectionFlag(false) : handleClick(`Socket connection lost`, 11);
    // eslint-disable-next-line
  }, [socketON])

  return (
    <div>
      <SpeedDial
        ariaLabel='SpeedDial for drawing map'
        open={opener}
        onClick={(e) => { e.stopPropagation(); openLock && setOpener(true); openLock && setOpenLock(false); }}
        FabProps={{
          sx: {
            display: opener ? 'none' : 'flex',
          },
        }}
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          '& .MuiSpeedDial-actions > *': {
            my: 0.25,
          },
          '& .MuiSpeedDial-fab': {
            color: 'black',
            ...hostFlag ? deactivateFabGlowStyle : deactivateFabShadowStyle,
          },
          '& .MuiSpeedDial-fab:hover': {
            ...hostFlag ? activateFabGlowStyle : activateFabShadowStyle,
          }
        }}
        icon={opener ? null : dialIcon(onAdd, goCanvas, handleClick, setModeFlag)}
        openIcon={null}
      >
        {(setModeFlag ? actions.filter(action => setModeActions.includes(action.id)) : socketON ? actions.filter(action => socketActions.includes(action.id)) : actions.filter(action => action.id !== '12')).map((action) => (
          <SpeedDialAction
            sx={{
              ...hostFlag ? deactivateFabGlowStyle : deactivateFabShadowStyle,
              '&:hover': {
                ...hostFlag ? activateFabGlowStyle : activateFabShadowStyle,
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
        key={state.tid}
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