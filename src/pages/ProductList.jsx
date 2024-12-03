import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, status, error } = useSelector((state) => state.products);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const isProductInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({
      ...product,
      quantity: 1
    }));
  };

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h2 className="mb-4">Products</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {products.map((product) => (
          <div key={product.id} className="col">
            <div className="card h-100">
              <img 
                src={product.image} 
                className="card-img-top p-3" 
                alt={product.title}
                style={{ height: '200px', objectFit: 'contain' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title" style={{ height: '48px', overflow: 'hidden' }}>
                  {product.title}
                </h5>
                <p className="card-text text-muted mb-2">
                  Stock: {product.quantity}
                </p>
                <p className="card-text fw-bold text-primary mb-3">
                  ${product.price.toFixed(2)}
                </p>
                <div className="d-flex gap-2 mt-auto">
                  <button
                    className="btn btn-outline-primary flex-grow-1"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    View Detail
                  </button>
                  <button
                    className={`btn ${isProductInCart(product.id) ? 'btn-secondary' : 'btn-primary'} flex-grow-1`}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.quantity <= 0 || isProductInCart(product.id)}
                  >
                    {isProductInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;