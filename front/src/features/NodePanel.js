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
  setDefaultEdgeColor,
} from '../redux/flowSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RgbaStringColorPicker } from 'react-colorful';
import './NodePanel.css';

const NodePanel = () => {
  const id = useSelector((state) => state.flow.selectedNode);
  const label = useSelector((state) => state.flow.sLabel);
  const fontSize = useSelector((state) => state.flow.sFontSize);
  const nodeColor = useSelector((state) => state.flow.defaultNodeColor);
  const edgeColor = useSelector((state) => state.flow.defaultEdgeColor);
  const value = useSelector((state) => state.flow.defaultNodeValue);
  const setModeFlag = useSelector((state) => state.flow.setModeFlag);
  const [localNodeColor, setLocalNodeColor] = useState(nodeColor);
  const [localEdgeColor, setLocalEdgeColor] = useState(edgeColor);
  const [localLabel, setLocalLabel] = useState(label || '');
  const [localFontSize, setLocalFontSize] = useState(fontSize || 14);
  const dispatch = useDispatch();

  useEffect(() => {
    setLocalLabel(label);
    setLocalFontSize(fontSize);
    if (label === "nodecolor")
      setLocalNodeColor(nodeColor);
    if (label === "edgecolor")
      setLocalEdgeColor(edgeColor);
    if (label === "value")
      setLocalLabel(value);
    // eslint-disable-next-line
  }, [id])

  const applySelectedNode = useCallback(() => {
    dispatch(setsLabel(localLabel));
    dispatch(setsFontSize(localFontSize));
    if (id === "nodecolor")
      dispatch(setDefaultNodeColor(localNodeColor)); // 6 node default color 변경 
    if (id === "edgecolor")
      dispatch(setDefaultEdgeColor(localEdgeColor)); // 9 edge default color 변경 
    if (id === "value")
      dispatch(setDefaultNodeValue(localLabel)); // 7 node color 팔레트
    dispatch(activateApplyFlag())
  }, [dispatch, id, localFontSize, localLabel, localEdgeColor, localNodeColor])

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
        background: setModeFlag && id === "nodecolor" ? localNodeColor : 'beige',
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
      {setModeFlag && id === "nodecolor" && (<>
        <Typography variant='h6'>Node Color </Typography>
        <RgbaStringColorPicker
          color={localNodeColor}
          onChange={setLocalNodeColor}
        /></>)}
      {setModeFlag && id === "edgecolor" && (<>
        <Typography variant='h6'>Edge Color </Typography>
        <RgbaStringColorPicker
          color={localEdgeColor}
          onChange={setLocalEdgeColor}
        /></>)}
      <Typography variant='h6'>Apply
        <Button onClick={applySelectedNode}>
          <Check />
        </Button>
      </Typography>

    </Panel >
  );
};

export default NodePanel;