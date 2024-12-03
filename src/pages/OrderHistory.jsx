import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const orders = useSelector((state) => state.orders.history);
  const navigate = useNavigate();

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <div className="container py-4">
      <h2 className="mb-4">Order History</h2>
      
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