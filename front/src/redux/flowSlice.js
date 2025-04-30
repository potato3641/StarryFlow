import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedNode: false,
  sLabel: '',
  sFontSize: 14,
  sWidth: 140,
  sHeight: 80,
  applyFlag: false,
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
      state.applyFlag = true
    },
    deactivateApplyFlag(state) {
      state.applyFlag = false
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
} = flowSlice.actions;
export default flowSlice.reducer;
