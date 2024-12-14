import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import '../styles/loading.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, status, error } = useSelector((state) => state.products);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);

  const [filter, setFilter] = useState(products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  useEffect(() => {
    setFilter(products);
  }, [products]);

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

  const filterProduct = (category) => {
    const filtered = products.filter((product) => product.category === category);
    setFilter(filtered);
  };

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="loading-animation">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
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

      {/* Filter Buttons */}
      <div className="buttons d-flex justify-content-center mb-5 pb-5">
        <button className="btn btn-outline-dark me-2" onClick={() => setFilter(products)}>All</button>
        <button className="btn btn-outline-dark me-2" onClick={() => filterProduct("men's clothing")}>Men`s Clothing</button>
        <button className="btn btn-outline-dark me-2" onClick={() => filterProduct("women's clothing")}>Women`s Clothing</button>
        <button className="btn btn-outline-dark me-2" onClick={() => filterProduct("jewelery")}>Jewelry</button>
        <button className="btn btn-outline-dark me-2" onClick={() => filterProduct("electronics")}>Electronic</button>
      </div>

      {/* Product Cards */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {filter.map((product) => (
          <div key={product.id} className="col">
            <div className="card h-100">
              <img 
                src={product.image}
                alt={product.title} 
                className="card-img-top p-3" 
                style={{ height: '200px', objectFit: 'contain' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title" style={{ height: '48px', overflow: 'hidden' }}>
                  {product.title}
                </h5>
                <p className="card-text text-muted mb-2">
                  Stock: {product.quantity}
                </p>
                <p className="card-text fw-bold text-primary mb-2">
                  ${product.price.toFixed(2)}
                </p>
                <p className="card-text text-warning mb-3">
                  Rating: {product.rating?.rate || 'N/A'} ★ ({product.rating?.count || 0} reviews)
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