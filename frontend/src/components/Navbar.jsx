import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="navbar-top-bar">
        <i className="fas fa-truck me-2"></i>
        Free delivery on orders above ₹500 &nbsp;|&nbsp;
        <i className="fas fa-phone me-1"></i> +91 98765 43210
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-custom py-2">
        <div className="container">
          {/* Brand */}
          <Link to="/" className="navbar-brand-custom">
            <span style={{ fontSize: '1.8rem' }}>🛒</span>
            FreshMart
          </Link>

          {/* Mobile Toggle */}
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <i className="fas fa-bars" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}></i>
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            {/* Center Links */}
            <ul className="navbar-nav mx-auto gap-1">
              <li className="nav-item">
                <NavLink to="/" end className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                  <i className="fas fa-home me-1"></i> Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/shop" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                  <i className="fas fa-store me-1"></i> Shop
                </NavLink>
              </li>
              {isAuthenticated() && !isAdmin() && (
                <li className="nav-item">
                  <NavLink to="/my-orders" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                    <i className="fas fa-box me-1"></i> My Orders
                  </NavLink>
                </li>
              )}
              {isAdmin() && (
                <li className="nav-item">
                  <NavLink to="/admin" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                    <i className="fas fa-tachometer-alt me-1"></i> Admin Panel
                  </NavLink>
                </li>
              )}
            </ul>

            {/* Right Side */}
            <div className="d-flex align-items-center gap-2">
              {/* Cart */}
              {!isAdmin() && (
                <Link to="/cart" className="btn-outline-custom position-relative" style={{ padding: '9px 18px', fontSize: '0.9rem' }}>
                  <i className="fas fa-shopping-cart"></i>
                  {cartCount > 0 && (
                    <span className="cart-badge-nav">{cartCount}</span>
                  )}
                  <span className="ms-1 d-none d-md-inline">Cart</span>
                </Link>
              )}

              {/* Auth */}
              {isAuthenticated() ? (
                <div className="dropdown">
                  <button className="btn-primary-custom dropdown-toggle" data-bs-toggle="dropdown" style={{ padding: '9px 18px', fontSize: '0.9rem' }}>
                    <i className="fas fa-user"></i>
                    <span className="ms-1 d-none d-md-inline">{user?.name?.split(' ')[0]}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end border-0 shadow rounded-3 py-2 mt-2">
                    <li><span className="dropdown-item-text px-4 py-1 text-muted small">Signed in as</span></li>
                    <li><span className="dropdown-item-text px-4 py-1 fw-bold">{user?.email}</span></li>
                    <li><hr className="dropdown-divider" /></li>
                    {!isAdmin() && (
                      <li><Link to="/my-orders" className="dropdown-item px-4 py-2"><i className="fas fa-box me-2 text-muted"></i>My Orders</Link></li>
                    )}
                    {isAdmin() && (
                      <li><Link to="/admin" className="dropdown-item px-4 py-2"><i className="fas fa-cog me-2 text-muted"></i>Admin Panel</Link></li>
                    )}
                    <li>
                      <button onClick={handleLogout} className="dropdown-item px-4 py-2 text-danger">
                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn-outline-custom" style={{ padding: '9px 18px', fontSize: '0.9rem' }}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary-custom" style={{ padding: '9px 18px', fontSize: '0.9rem' }}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
