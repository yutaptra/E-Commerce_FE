import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
      <div className="container py-4">
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <Skeleton height={400} />
            </div>
          </div>
          <div className="col-md-6">
            <Skeleton height={40} className="mb-3" /> {/* Title */}
            <Skeleton width={100} className="mb-4" /> {/* Category */}
            
            <div className="mb-4">
              <Skeleton width={150} height={30} className="mb-2" /> {/* Price */}
              <Skeleton width={200} className="mb-2" /> {/* Stock */}
              <Skeleton width={180} /> {/* Rating */}
            </div>
            
            <div className="mb-4">
              <Skeleton width={120} height={25} className="mb-2" /> {/* Description title */}
              <Skeleton count={4} /> {/* Description paragraphs */}
            </div>
            
            <Skeleton width={200} height={48} /> {/* Button */}
          </div>
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
            <p className="text-warning">
              Rating: {product.rating?.rate || 'N/A'} ★ ({product.rating?.count || 0} reviews)
            </p>
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