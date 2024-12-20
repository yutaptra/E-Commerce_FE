import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearHistory } from '../redux/slices/orderSlice';

const OrderHistory = () => {
  const orders = useSelector((state) => state.orders.history);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const location = useLocation();
  const successMessage = location.state?.successMessage || '';

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const handleClearHistory = () => {
    setShowConfirmDialog(true);
  };

  const confirmClearHistory = () => {
    dispatch(clearHistory());
    setShowConfirmDialog(false);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Order History</h2>
        {orders.length > 0 && (
          <button 
            className="btn btn-danger"
            onClick={handleClearHistory}
          >
            Clear History
          </button>
        )}
      </div>
      
      {successMessage && (
        <div className="alert alert-success mb-4">
          {successMessage}
        </div>
      )}
      
      {showConfirmDialog && (
        <div className="alert alert-warning mb-4">
          <p className="mb-3">Are you sure you want to clear all order history? This action cannot be undone.</p>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-danger"
              onClick={confirmClearHistory}
            >
              Yes, Clear History
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {orders.length === 0 ? (
        <div className="alert alert-info">
          <p className="mb-0">No orders yet.</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card mb-3">
            <div className="card-header d-flex justify-content-between">
              <span>Order #{order.id}</span>
              <span>{new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.quantity}</td>
                        <td>{formatter.format(item.price)}</td>
                        <td>{formatter.format(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end fw-bold">Total:</td>
                      <td className="fw-bold">{formatter.format(order.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
      
      <button 
        className="btn btn-primary"
        onClick={() => navigate('/')}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderHistory;