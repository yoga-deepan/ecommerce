import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const categoryEmoji = {
  'Vegetables': '🥦',
  'Fruits': '🍎',
  'Dairy & Eggs': '🥛',
  'Grains & Rice': '🌾',
  'Pulses & Lentils': '🫘',
  'Flour & Atta': '🌾',
  'Oils & Ghee': '🫙',
  'Beverages': '☕',
  'Snacks': '🍿',
  'Personal Care': '🧴',
  'Grocery': '🛒',
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: { fontFamily: 'var(--font-body)', fontWeight: 500 },
    });
  };

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const emoji = categoryEmoji[product.category] || '🛍️';

  return (
    <div className="product-card h-100">
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Image */}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="card-img-top"
            style={{ height: '190px', objectFit: 'cover', width: '100%' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="product-img-placeholder" style={{ display: product.image ? 'none' : 'flex' }}>
          {emoji}
        </div>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'var(--radius-lg)',
          }}>
            <span style={{ background: 'white', color: '#dc3545', fontWeight: 700, padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem' }}>
              Out of Stock
            </span>
          </div>
        )}

        <div className="card-body">
          <span className="category-badge">{product.category}</span>
          <p className="product-name">{product.name}</p>
          <p className="unit-tag"><i className="fas fa-weight me-1"></i>{product.unit}</p>
          <div className="price-box">
            <span className="price">₹{parseFloat(product.price).toFixed(2)}</span>
            {product.original_price && (
              <span className="original-price">₹{parseFloat(product.original_price).toFixed(2)}</span>
            )}
            {discount && <span className="discount-badge">{discount}% OFF</span>}
          </div>
        </div>
      </Link>

      <div className="px-3 pb-3">
        <button
          className="add-to-cart-btn"
          onClick={handleAdd}
          disabled={product.stock === 0}
          style={{ opacity: product.stock === 0 ? 0.5 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}
        >
          <i className="fas fa-cart-plus"></i>
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
