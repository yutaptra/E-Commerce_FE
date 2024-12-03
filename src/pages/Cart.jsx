import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateQuantity, removeFromCart } from '../redux/slices/cartSlice';
import { decrementQuantity } from '../redux/slices/productSlice';
import { useCart } from '../hooks/useCart';

const Cart = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { cartItems, getAvailableStock, isQuantityExceedsStock, total, hasInvalidItems } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (item, newQuantity) => {
    const availableStock = getAvailableStock(item.id);
    const quantity = Math.min(Math.max(1, newQuantity), availableStock);
    dispatch(updateQuantity({ id: item.id, quantity }));
  };

  const handleCheckout = async () => {
    if (!window.confirm('Are you sure you want to proceed with checkout?')) {
      return;
    }

    setIsCheckingOut(true);
    try {
      const validItems = cartItems.filter(item => !isQuantityExceedsStock(item));
      
      validItems.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
          dispatch(decrementQuantity(item.id));
        }
      });

      cartItems.forEach(item => {
        dispatch(removeFromCart(item.id));
      });

      navigate('/');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="alert alert-info text-center">
          <h4>Your cart is empty</h4>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate('/')}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Shopping Cart</h2>
      
      <div className="card">
        <div className="card-body">
          {cartItems.map((item) => {
            const availableStock = getAvailableStock(item.id);
            const isExceedingStock = isQuantityExceedsStock(item);

            return (
              <div key={item.id} className="row mb-4 align-items-center">
                <div className="col-md-2">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="img-fluid rounded"
                    style={{ maxHeight: '100px', objectFit: 'contain' }}
                  />
                </div>
                
                <div className="col-md-4">
                  <h5 className="mb-1">{item.title}</h5>
                  <p className="text-muted mb-0">{formatter.format(item.price)}</p>
                </div>
                
                <div className="col-md-3">
                  <div className={`input-group ${isExceedingStock ? 'has-validation' : ''}`}>
                    <input
                      type="number"
                      className={`form-control ${isExceedingStock ? 'is-invalid' : ''}`}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                      min="1"
                      max={availableStock}
                    />
                    {isExceedingStock && (
                      <div className="invalid-feedback d-block text-danger">
                        Insufficient stock! Available: {availableStock}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="col-md-2">
                  <p className="mb-0 fw-bold">
                    {formatter.format(item.price * item.quantity)}
                  </p>
                </div>
                
                <div className="col-md-1">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
          
          <hr className="my-4" />
          
          <div className="row align-items-center">
            <div className="col-md-6">
              <h4 className="mb-0">
                Total: {formatter.format(total)}
              </h4>
            </div>
            <div className="col-md-6 text-end">
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCheckout}
                disabled={hasInvalidItems || isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Processing...
                  </>
                ) : 'Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;