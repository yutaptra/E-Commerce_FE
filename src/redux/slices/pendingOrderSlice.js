import { createSlice } from '@reduxjs/toolkit';

const pendingOrderSlice = createSlice({
  name: 'pendingOrder',
  initialState: {
    items: [],
    total: 0
  },
  reducers: {
    setPendingOrder: (state, action) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
    clearPendingOrder: (state) => {
      state.items = [];
      state.total = 0;
    }
  }
});

export const { setPendingOrder, clearPendingOrder } = pendingOrderSlice.actions;
export default pendingOrderSlice.reducer;