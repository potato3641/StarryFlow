import { Panel } from '@xyflow/react';
import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Typography, Button } from '@mui/material'
import { Check } from '@mui/icons-material';
import { setsLabel, setsFontSize, activateApplyFlag } from '../redux/flowSlice';
import { useDispatch, useSelector } from 'react-redux';
import './NodePanel.css';

const NodePanel = () => {
  const id = useSelector((state) => state.flow.selectedNode);
  const label = useSelector((state) => state.flow.sLabel);
  const fontSize = useSelector((state) => state.flow.sFontSize);
  const [localLabel, setLocalLabel] = useState(label || '');
  const [localFontSize, setLocalFontSize] = useState(fontSize || 14);
  const dispatch = useDispatch();

  useEffect(() => {
    setLocalLabel(label);
    setLocalFontSize(fontSize);
    // eslint-disable-next-line
  }, [id])

  const applySelectedNode = useCallback(() => {
    dispatch(setsLabel(localLabel))
    dispatch(setsFontSize(localFontSize))
    dispatch(activateApplyFlag())
  }, [dispatch, localFontSize, localLabel])

  return (
    <Panel className="nodePanel" position="top-left">
      <Typography variant='h6'>Label: </Typography>
      <TextField
        value={localLabel}
        onChange={(evt) => setLocalLabel(evt.target.value)}
        variant="outlined" multiline autoFocus
      />
      <Typography variant='h6'>FontSize: </Typography>
      <TextField
        type="number"
        value={localFontSize}
        onChange={(evt) => setLocalFontSize(evt.target.value)}
        onInput={(e) => {
          const val = parseFloat(e.target.value);
          if (val > 100)
            e.target.value = 100
          if (val < 0)
            e.target.value = 0
        }}
      />
      <Typography variant='h6'>Apply:
        <Button onClick={applySelectedNode}>
          <Check />
        </Button>
      </Typography>

    </Panel>
  );
};

export default NodePanel;