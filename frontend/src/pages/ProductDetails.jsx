import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setImgError(false);
    setQty(1);
    API.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        // Fetch related
        return API.get(`/products?category=${encodeURIComponent(res.data.category)}`);
      })
      .then(res => {
        setRelated(res.data.filter(p => p.id !== parseInt(id)).slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${qty}x ${product.name} added to cart!`, { icon: '🛒' });
  };

  const discount = product?.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  if (loading) return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-md-5"><div className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }}></div></div>
        <div className="col-md-7">
          {[240, 120, 80, 200].map((w, i) => (
            <div key={i} className="skeleton mb-3" style={{ height: '24px', width: `${w}px`, maxWidth: '100%' }}></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="empty-state py-5">
      <span className="empty-icon">😕</span>
      <h4>Product not found</h4>
      <Link to="/shop" className="btn-primary-custom mt-3">Back to Shop</Link>
    </div>
  );

  return (
    <div>
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav>
          <ol className="breadcrumb breadcrumb-custom mb-4">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/shop">Shop</Link></li>
            <li className="breadcrumb-item"><Link to={`/shop?category=${product.category}`}>{product.category}</Link></li>
            <li className="breadcrumb-item active">{product.name}</li>
          </ol>
        </nav>

        <div className="row g-5 align-items-start">
          {/* Product Image */}
          <div className="col-md-5">
            <div className="card-custom" style={{ overflow: 'hidden' }}>
              {product.image && !imgError ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="product-img-placeholder" style={{ height: '400px', fontSize: '6rem' }}>
                  🛒
                </div>
              )}
            </div>

            {product.stock > 0 && product.stock < 20 && (
              <div className="mt-3 p-3 rounded-3" style={{ background: '#fff3cd', border: '1px solid #ffc107' }}>
                <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Only {product.stock} left in stock!</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="col-md-7">
            <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
              {product.category}
            </span>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginTop: '16px', marginBottom: '8px' }}>
              {product.name}
            </h1>

            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '20px' }}>
              <i className="fas fa-weight me-1"></i> Per {product.unit}
            </p>

            {/* Price */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                ₹{parseFloat(product.price).toFixed(2)}
              </span>
              {product.original_price && (
                <span style={{ fontSize: '1.1rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                  ₹{parseFloat(product.original_price).toFixed(2)}
                </span>
              )}
              {discount && (
                <span style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-4 p-4 rounded-3" style={{ background: 'var(--bg)', borderLeft: '4px solid var(--primary)' }}>
                <p style={{ margin: 0, lineHeight: '1.8', color: 'var(--text-mid)' }}>{product.description}</p>
              </div>
            )}

            {/* Stock Status */}
            <div className="d-flex align-items-center gap-2 mb-4">
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: product.stock > 0 ? '#22c55e' : '#ef4444', display: 'inline-block' }}></span>
              <span style={{ fontWeight: 600, color: product.stock > 0 ? '#22c55e' : '#ef4444', fontSize: '0.9rem' }}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Qty & Add to Cart */}
            {product.stock > 0 && (
              <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-display">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
                <button className="btn-primary-custom flex-grow-1" onClick={handleAddToCart} style={{ justifyContent: 'center', padding: '14px 24px' }}>
                  <i className="fas fa-cart-plus"></i> Add to Cart
                </button>
              </div>
            )}

            <Link to="/cart" className="btn-accent-custom" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              <i className="fas fa-shopping-cart"></i> View Cart
            </Link>

            {/* Info Pills */}
            <div className="d-flex flex-wrap gap-2 mt-4">
              {['🚚 Fast Delivery', '🌿 Fresh Quality', '↩️ Easy Returns', '💳 Secure Payment'].map(tag => (
                <span key={tag} style={{
                  background: 'var(--primary-light)', color: 'var(--primary)',
                  padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-5 pt-4" style={{ borderTop: '2px solid var(--border)' }}>
            <div className="section-line"></div>
            <h2 className="section-title mb-4">Related Products</h2>
            <div className="row g-4">
              {related.map(p => (
                <div className="col-6 col-md-3" key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
