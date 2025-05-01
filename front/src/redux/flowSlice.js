import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // values
  selectedNode: false,
  defaultNodeValue: 0,
  defaultNodeAlign: 'center',
  defaultNodeColor: 'rgba(10, 10, 60, 0.85)',
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
    setDefaultNodeValue(state, action) {
      state.defaultNodeValue = action.payload;
    },
    clearDefaultNodeValue(state) {
      state.defaultNodeValue = 0;
    },
    setDefaultNodeAlign(state, action) {
      state.defaultNodeAlign = action.payload;
    },
    clearDefaultNodeAlign(state) {
      state.defaultNodeAlign = 'center';
    },
    setDefaultNodeColor(state, action) {
      state.defaultNodeColor = action.payload;
    },
    clearDefaultNodeColor(state) {
      state.defaultNodeColor = 'rgba(10, 10, 60, 0.85)';
    },
    activateAutoFitViewFlag(state) {
      state.autoFitViewFlag = true;
    },
    deactivateAutoFitViewFlag(state) {
      state.autoFitViewFlag = false;
    },
    activateMapFlag(state) {
      state.mapFlag = true;
    },
    deactivateMapFlag(state) {
      state.mapFlag = false;
    },
    activateCycleValidateFlag(state) {
      state.cycleValidateFlag = true;
    },
    deactivateCycleValidateFlag(state) {
      state.cycleValidateFlag = false;
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
  setDefaultNodeValue,
  clearDefaultNodeValue,
  activateAutoFitViewFlag,
  deactivateAutoFitViewFlag,
  activateMapFlag,
  deactivateMapFlag,
  setDefaultNodeAlign,
  clearDefaultNodeAlign,
  activateCycleValidateFlag,
  deactivateCycleValidateFlag,
  setDefaultNodeColor,
  clearDefaultNodeColor,
} = flowSlice.actions;
export default flowSlice.reducer;
