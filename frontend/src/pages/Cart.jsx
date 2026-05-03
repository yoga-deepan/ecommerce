import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const deliveryCharge = cartTotal >= 500 ? 0 : 40;
  const grandTotal = cartTotal + deliveryCharge;

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      toast.info('Please login to continue checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div>
        <div className="page-header">
          <div className="container">
            <h1><i className="fas fa-shopping-cart me-2"></i>My Cart</h1>
          </div>
        </div>
        <div className="container py-5">
          <div className="empty-state">
            <span className="empty-icon">🛒</span>
            <h4>Your cart is empty</h4>
            <p>Looks like you haven't added any products yet!</p>
            <Link to="/shop" className="btn-primary-custom mt-3">
              <i className="fas fa-store me-2"></i> Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="fas fa-shopping-cart me-2"></i>My Cart ({cart.length} items)</h1>
        </div>
      </div>

      <div className="container py-4 pb-5">
        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 style={{ fontWeight: 700, margin: 0 }}>Cart Items</h5>
              <button
                onClick={() => { clearCart(); toast.success('Cart cleared'); }}
                style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
              >
                <i className="fas fa-trash me-1"></i> Clear Cart
              </button>
            </div>

            {cart.map(item => (
              <div className="cart-item" key={item.id}>
                {/* Image */}
                {item.image ? (
                  <img src={item.image} alt={item.name} className="cart-item-img"
                    onError={e => { e.target.src = ''; e.target.style.display = 'none'; }} />
                ) : (
                  <div className="cart-item-img d-flex align-items-center justify-content-center" style={{ fontSize: '2rem', background: 'var(--primary-light)' }}>
                    🛒
                  </div>
                )}

                {/* Info */}
                <div className="flex-grow-1">
                  <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'var(--text-dark)' }}>
                    <p style={{ fontWeight: 700, margin: '0 0 4px', fontSize: '1rem' }}>{item.name}</p>
                  </Link>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.82rem', margin: '0 0 4px' }}>{item.unit}</p>
                  <p style={{ color: 'var(--primary)', fontWeight: 700, margin: 0 }}>₹{parseFloat(item.price).toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <span className="qty-display">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>

                {/* Subtotal */}
                <div className="text-end" style={{ minWidth: '80px' }}>
                  <p style={{ fontWeight: 800, color: 'var(--primary)', margin: '0 0 8px', fontSize: '1.05rem' }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => { removeFromCart(item.id); toast.info(`${item.name} removed`); }}
                    style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    <i className="fas fa-times me-1"></i> Remove
                  </button>
                </div>
              </div>
            ))}

            <Link to="/shop" className="btn-outline-custom mt-3">
              <i className="fas fa-arrow-left me-1"></i> Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card-custom p-4" style={{ position: 'sticky', top: '100px' }}>
              <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '20px' }}>Order Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: 'var(--text-mid)' }}>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span style={{ fontWeight: 600 }}>₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: 'var(--text-mid)' }}>Delivery Charge</span>
                {deliveryCharge === 0 ? (
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>FREE</span>
                ) : (
                  <span style={{ fontWeight: 600 }}>₹{deliveryCharge.toFixed(2)}</span>
                )}
              </div>

              {deliveryCharge > 0 && (
                <div className="delivery-free-badge mb-3">
                  <i className="fas fa-truck"></i>
                  Add ₹{(500 - cartTotal).toFixed(2)} more for free delivery!
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Grand Total</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>₹{grandTotal.toFixed(2)}</span>
              </div>

              <button onClick={handleCheckout} className="btn-primary-custom" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                <i className="fas fa-lock me-2"></i>Proceed to Checkout
              </button>

              <div className="text-center mt-3">
                <small style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>
                  <i className="fas fa-shield-alt me-1"></i> Secure checkout with 256-bit encryption
                </small>
              </div>

              {/* Payment Badges */}
              <div className="d-flex justify-content-center gap-2 mt-3">
                {['💳 COD', '📱 UPI'].map(m => (
                  <span key={m} style={{ background: 'var(--bg)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-mid)' }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
