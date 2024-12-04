import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    history: []
  },
  reducers: {
    addOrder: (state, action) => {
      state.history.unshift({
        id: Date.now(),
        date: new Date().toISOString(),
        items: action.payload.items,
        total: action.payload.total
      });
    },
    clearHistory: (state) => {
      state.history = [];
    }
  }
});

export const { addOrder, clearHistory } = orderSlice.actions;
export default orderSlice.reducer;