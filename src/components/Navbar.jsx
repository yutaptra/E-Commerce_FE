import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { stopAnimation } from '../redux/slices/cartSlice';
import { logoutAndClearCart } from '../redux/slices/authSlice';
import '../styles/navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAnimating = useSelector((state) => state.cart.isAnimating);
  useEffect(() => {
    if (isAnimating) {
      setTimeout(() => {
        dispatch(stopAnimation());
      }, 300);
    }
  }, [isAnimating, dispatch]);
  
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logoutAndClearCart());
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Yuta Shop</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/cart">
                Cart
                {cartItemCount > 0 && (
                  <span className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ${isAnimating ? 'badge-animate' : ''}`}>
                  {cartItemCount}
                  <span className="visually-hidden">items in cart</span>
                  </span>
                )}
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="nav-link disabled">Hello, {user?.username}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-outline-primary" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;