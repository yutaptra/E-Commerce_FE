import api from './api';

export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/auth/login', {
      username,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      const userResponse = await api.get('/users');
      const user = userResponse.data.find(u => u.username === username);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        return { user, token: response.data.token };
      }
    }
    throw new Error('Invalid credentials');
  } catch (error) {
    throw new Error(error.response?.data || 'Login failed');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getStoredAuth = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  return { token, user };
};