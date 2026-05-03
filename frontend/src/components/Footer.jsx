import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4">
          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand">🛒 FreshMart</div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.7', maxWidth: '280px' }}>
              Your trusted online grocery store. Fresh products delivered to your doorstep with care and speed.
            </p>
            <div className="d-flex gap-3 mt-3">
              {['facebook', 'instagram', 'twitter', 'youtube'].map(s => (
                <a key={s} href="#" className="footer-link" style={{ display: 'inline', fontSize: '1.1rem' }}>
                  <i className={`fab fa-${s}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Quick Links</h6>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/shop" className="footer-link">Shop</Link>
            <Link to="/cart" className="footer-link">Cart</Link>
            <Link to="/my-orders" className="footer-link">My Orders</Link>
            <Link to="/register" className="footer-link">Register</Link>
          </div>

          {/* Categories */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Categories</h6>
            {['Vegetables', 'Fruits', 'Dairy & Eggs', 'Grains & Rice', 'Pulses & Lentils', 'Beverages'].map(cat => (
              <Link key={cat} to={`/shop?category=${cat}`} className="footer-link">{cat}</Link>
            ))}
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Contact Us</h6>
            <div className="footer-link d-flex align-items-start gap-2">
              <i className="fas fa-map-marker-alt mt-1" style={{ color: 'var(--accent)', flexShrink: 0 }}></i>
              <span>123 Market Street, Sivakasi, Tamil Nadu 626 123</span>
            </div>
            <div className="footer-link d-flex align-items-center gap-2 mt-2">
              <i className="fas fa-phone" style={{ color: 'var(--accent)' }}></i>
              +91 98765 43210
            </div>
            <div className="footer-link d-flex align-items-center gap-2 mt-2">
              <i className="fas fa-envelope" style={{ color: 'var(--accent)' }}></i>
              support@freshmart.in
            </div>
            <div className="mt-3 p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>
                <i className="fas fa-clock me-1" style={{ color: 'var(--accent)' }}></i>
                Mon–Sat: 8AM–9PM &nbsp;|&nbsp; Sun: 9AM–7PM
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 FreshMart. All rights reserved. Built with ❤️ for fresh groceries.</p>
        </div>
      </div>
    </footer>
  );
}
