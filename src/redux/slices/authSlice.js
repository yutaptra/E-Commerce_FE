import { createSlice } from '@reduxjs/toolkit';
import { getStoredAuth } from '../../services/authService';
import { clearCart } from './cartSlice';

const { token, user } = getStoredAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!token,
    user: user,
    token: token
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { login, logout } = authSlice.actions;

export const logoutAndClearCart = () => (dispatch) => {
  dispatch(clearCart());
  dispatch(logout());
};

export default authSlice.reducer;