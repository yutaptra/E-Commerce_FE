import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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

  const Loading = () => {
    return (
      <div className="container my-5 py-5">
        <div className="row">
          <div className="col-12 mb-5">
            <Skeleton height={45} width={250} className="mx-auto" /> {/* Title */}
            <Skeleton height={2} className="mt-4" /> {/* Divider */}
          </div>
        </div>
  
        <div className="row justify-content-center">
          {/* Skeleton for Filter Buttons */}
          <div className="buttons d-flex justify-content-center flex-wrap gap-2 mb-5 pb-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} width={100} height={38} className="me-2" />
            ))}
          </div>
  
          {/* Skeleton for Product Cards */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="col">
                <div className="card h-100 p-3">
                  <Skeleton height={200} className="mb-3" /> {/* Image */}
                  <Skeleton height={24} className="mb-2" /> {/* Title */}
                  <Skeleton width={100} className="mb-2" /> {/* Stock */}
                  <Skeleton width={80} className="mb-2" /> {/* Price */}
                  <Skeleton width={150} className="mb-3" /> {/* Rating */}
                  <div className="d-flex gap-2">
                    <Skeleton height={38} className="flex-grow-1" /> {/* View Detail button */}
                    <Skeleton height={38} className="flex-grow-1" /> {/* Add to Cart button */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'failed') {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div>
      {/* Products Section */}
      <div className="container my-5 py-5">
        <div className="row">
          <div className="col-12 mb-5">
            <h1 className="display-6 fw-bolder text-center">Latest Products</h1>
            <hr />
          </div>
        </div>
        
        <div className="row justify-content-center">
          {/* Filter Buttons */}
          <div className="buttons d-flex justify-content-center flex-wrap gap-2 mb-5 pb-5">
            <button className="btn btn-outline-dark" onClick={() => setFilter(products)}>All</button>
            <button className="btn btn-outline-dark" onClick={() => filterProduct("men's clothing")}>Men`s Clothing</button>
            <button className="btn btn-outline-dark" onClick={() => filterProduct("women's clothing")}>Women`s Clothing</button>
            <button className="btn btn-outline-dark" onClick={() => filterProduct("jewelery")}>Jewelry</button>
            <button className="btn btn-outline-dark" onClick={() => filterProduct("electronics")}>Electronic</button>
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
      </div>
    </div>
  );
};

export default ProductList;