import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
              <Route path="/order-history" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
