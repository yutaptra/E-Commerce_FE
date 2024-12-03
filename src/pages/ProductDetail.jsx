import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../redux/slices/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);
  const isInCart = cartItems.some((item) => item.id === Number(id));
  const productStock = useSelector((state) =>
    state.products.items.find((item) => item.id === Number(id))?.quantity || 0
  );

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="alert alert-danger m-3">
        {error || 'Product not found'}
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <img
              src={product.image}
              alt={product.title}
              className="card-img-top p-4"
              style={{ height: '400px', objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="col-md-6">
          <h2 className="mb-3">{product.title}</h2>
          <p className="text-muted mb-4">{product.category}</p>

          <div className="mb-4">
            <h4 className="text-primary">${product.price.toFixed(2)}</h4>
            <p className="text-muted">Stock Available: {productStock}</p>
          </div>

          <div className="mb-4">
            <h5>Description</h5>
            <p>{product.description}</p>
          </div>

          <button
            className={`btn btn-lg ${isInCart ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleAddToCart}
            disabled={isInCart || productStock === 0}
          >
            {isInCart ? 'In Your Cart' : productStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;