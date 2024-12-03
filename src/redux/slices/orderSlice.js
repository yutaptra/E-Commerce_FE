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
    }
  }
});

export const { addOrder } = orderSlice.actions;
export default orderSlice.reducer;