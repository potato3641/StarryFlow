import { Panel } from '@xyflow/react';
import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Typography, Button } from '@mui/material'
import { Check } from '@mui/icons-material';
import {
  setsLabel,
  setsFontSize,
  activateApplyFlag,
  setDefaultNodeValue,
  setDefaultNodeColor,
} from '../redux/flowSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RgbaStringColorPicker } from 'react-colorful';
import './NodePanel.css';

const NodePanel = () => {
  const id = useSelector((state) => state.flow.selectedNode);
  const label = useSelector((state) => state.flow.sLabel);
  const fontSize = useSelector((state) => state.flow.sFontSize);
  const color = useSelector((state) => state.flow.defaultNodeColor);
  const value = useSelector((state) => state.flow.defaultNodeValue);
  const setModeFlag = useSelector((state) => state.flow.setModeFlag);
  const [localColor, setLocalColor] = useState(color);
  const [localLabel, setLocalLabel] = useState(label || '');
  const [localFontSize, setLocalFontSize] = useState(fontSize || 14);
  const dispatch = useDispatch();

  useEffect(() => {
    setLocalLabel(label);
    setLocalFontSize(fontSize);
    if (label === "color")
      setLocalColor(color);
    if (label === "value")
      setLocalLabel(value);
    // eslint-disable-next-line
  }, [id])

  const applySelectedNode = useCallback(() => {
    dispatch(setsLabel(localLabel));
    dispatch(setsFontSize(localFontSize));
    if (id === "color")
      dispatch(setDefaultNodeColor(localColor)); // 6 node default value 변경 
    if (id === "value") {
      dispatch(setDefaultNodeValue(localLabel)); // 7 node color 팔레트
    }
    dispatch(activateApplyFlag())
  }, [dispatch, id, localFontSize, localLabel, localColor])

  const onKeyDown = useCallback((event) => {
    if (!event.shiftKey && event.key === 'Enter')
      applySelectedNode();
  }, [applySelectedNode])

  return (
    <Panel
      className="nodePanel"
      position="top-left"
      onKeyDown={onKeyDown}
      style={{
        background: setModeFlag && id === "color" ? localColor : 'beige',
        color: 'black',
      }}
    >
      {(!setModeFlag || id === "value") && (<>
        <Typography variant='h6'>Label </Typography>
        <TextField
          value={localLabel}
          onChange={(evt) => setLocalLabel(evt.target.value)}
          variant="outlined" multiline autoFocus
        />
      </>)}
      {!setModeFlag && (<>
        <Typography variant='h6'>FontSize </Typography>
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
      </>)}
      {setModeFlag && id === "color" && (
        <RgbaStringColorPicker
          color={localColor}
          onChange={setLocalColor}
        />)}
      <Typography variant='h6'>Apply
        <Button onClick={applySelectedNode}>
          <Check />
        </Button>
      </Typography>

    </Panel >
  );
};

export default NodePanel;