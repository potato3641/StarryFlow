import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // values
  selectedNode: false,
  defaultNodeValue: 0,
  defaultNodeAlign: 'center',
  defaultNodeColor: 'rgba(10, 10, 60, 0.85)',
  defaultEdgeColor: 'rgba(177, 177, 183, 1)',
  sLabel: '',
  sFontSize: 14,
  sWidth: 140,
  sHeight: 80,
  // flags
  applyFlag: false,
  sortDirectionFlag: false, // LR : false, TB : true
  autoFitViewFlag: true,
  mapFlag: true,
  cycleValidateFlag: true,
  zoomOutBlurFlag: false,
  setModeFlag: false,
  turboFlag: false,
};

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    setSelectedNode(state, action) {
      state.selectedNode = action.payload;
    },
    clearSelectedNode(state) {
      state.selectedNode = false;
    },
    setsLabel(state, action) {
      if (typeof action.payload !== 'undefined')
        state.sLabel = action.payload;
    },
    clearsLabel(state) {
      state.sLabel = '';
    },
    setsFontSize(state, action) {
      if (typeof action.payload !== 'undefined')
        state.sFontSize = action.payload;
    },
    clearsFontSize(state) {
      state.sFontSize = 14;
    },
    activateApplyFlag(state) {
      state.applyFlag = true;
    },
    deactivateApplyFlag(state) {
      state.applyFlag = false;
    },
    TBSortDirectionFlag(state) {
      state.sortDirectionFlag = true;
    },
    LRSortDirectionFlag(state) {
      state.sortDirectionFlag = false;
    },
    setSortDirectionFlag(state, action) {
      if (typeof action.payload !== 'undefined')
        state.sortDirectionFlag = action.payload;
    },
    setDefaultNodeValue(state, action) {
      if (typeof action.payload !== 'undefined')
        state.defaultNodeValue = action.payload;
    },
    clearDefaultNodeValue(state) {
      state.defaultNodeValue = 0;
    },
    setDefaultNodeAlign(state, action) {
      if (typeof action.payload !== 'undefined')
        state.defaultNodeAlign = action.payload;
    },
    clearDefaultNodeAlign(state) {
      state.defaultNodeAlign = 'center';
    },
    setDefaultNodeColor(state, action) {
      if (typeof action.payload !== 'undefined')
        state.defaultNodeColor = action.payload;
    },
    clearDefaultNodeColor(state) {
      state.defaultNodeColor = 'rgba(10, 10, 60, 0.85)';
    },
    setDefaultEdgeColor(state, action) {
      if (typeof action.payload !== 'undefined')
        state.defaultEdgeColor = action.payload;
    },
    clearDefaultEdgeColor(state) {
      state.defaultEdgeColor = 'rgba(177, 177, 183, 1)';
    },
    activateAutoFitViewFlag(state) {
      state.autoFitViewFlag = true;
    },
    deactivateAutoFitViewFlag(state) {
      state.autoFitViewFlag = false;
    },
    setAutoFitViewFlag(state, action) {
      if (typeof action.payload !== 'undefined')
        state.autoFitViewFlag = action.payload;
    },
    activateMapFlag(state) {
      state.mapFlag = true;
    },
    deactivateMapFlag(state) {
      state.mapFlag = false;
    },
    setMapFlag(state, action) {
      if (typeof action.payload !== 'undefined')
        state.mapFlag = action.payload;
    },
    activateCycleValidateFlag(state) {
      state.cycleValidateFlag = true;
    },
    deactivateCycleValidateFlag(state) {
      state.cycleValidateFlag = false;
    },
    setCycleValidateFlag(state, action) {
      if (typeof action.payload !== 'undefined')
        state.cycleValidateFlag = action.payload;
    },
    activateSetModeFlag(state) {
      state.setModeFlag = true;
    },
    deactivateSetModeFlag(state) {
      state.setModeFlag = false;
    },
    activateZoomOutBlurFlag(state) {
      state.zoomOutBlurFlag = true;
    },
    deactivateZoomOutBlurFlag(state) {
      state.zoomOutBlurFlag = false;
    },
    setZoomOutBlurFlag(state, action) {
      if (typeof action.payload !== 'undefined')
        state.zoomOutBlurFlag = action.payload;
    },
    activateTurboFlag(state) {
      state.turboFlag = true;
    },
    deactivateTurboFlag(state) {
      state.turboFlag = false;
    },
    setTurboFlag(state, action) {
      if (typeof action.payload !== 'undefined')
        state.turboFlag = action.payload;
    },
  }
})

export const {
  setSelectedNode,
  clearSelectedNode,
  setsLabel,
  clearsLabel,
  setsFontSize,
  clearsFontSize,
  activateApplyFlag,
  deactivateApplyFlag,
  TBSortDirectionFlag,
  LRSortDirectionFlag,
  setSortDirectionFlag,
  setDefaultNodeValue,
  clearDefaultNodeValue,
  activateAutoFitViewFlag,
  deactivateAutoFitViewFlag,
  setAutoFitViewFlag,
  activateMapFlag,
  deactivateMapFlag,
  setMapFlag,
  setDefaultNodeAlign,
  clearDefaultNodeAlign,
  activateCycleValidateFlag,
  deactivateCycleValidateFlag,
  setCycleValidateFlag,
  setDefaultNodeColor,
  clearDefaultNodeColor,
  activateSetModeFlag,
  deactivateSetModeFlag,
  activateZoomOutBlurFlag,
  deactivateZoomOutBlurFlag,
  setZoomOutBlurFlag,
  activateTurboFlag,
  deactivateTurboFlag,
  setTurboFlag,
  setDefaultEdgeColor,
  clearDefaultEdgeColor,
} = flowSlice.actions;
export default flowSlice.reducer;
