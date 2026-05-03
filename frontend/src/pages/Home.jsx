import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { name: 'Vegetables', icon: '🥦' },
  { name: 'Fruits', icon: '🍎' },
  { name: 'Dairy & Eggs', icon: '🥛' },
  { name: 'Grains & Rice', icon: '🌾' },
  { name: 'Pulses & Lentils', icon: '🫘' },
  { name: 'Beverages', icon: '☕' },
  { name: 'Snacks', icon: '🍿' },
  { name: 'Oils & Ghee', icon: '🫙' },
];

const FEATURES = [
  { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹500. Fast delivery within 2–4 hours.', color: '#e8f5ee' },
  { icon: '🌿', title: 'Farm Fresh', desc: 'Directly sourced from trusted farms. Always fresh, always quality.', color: '#fff3e8' },
  { icon: '💳', title: 'Easy Payments', desc: 'Pay via COD or UPI. Safe, quick, and hassle-free checkout.', color: '#eef2ff' },
  { icon: '↩️', title: 'Easy Returns', desc: 'Not happy? We\'ll make it right. Hassle-free return policy.', color: '#fef3c7' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/products?featured=true')
      .then(res => setFeatured(res.data.slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div>
      {/* ======= HERO ======= */}
      <section className="hero-section">
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-6 fade-in-up">
              <p style={{ color: '#86efac', fontWeight: 600, letterSpacing: '2px', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px' }}>
                🌿 Farm to Doorstep
              </p>
              <h1 className="hero-title">
                Fresh Groceries<br />
                <span>Delivered Fast</span><br />
                to Your Door
              </h1>
              <p className="hero-subtitle">
                Shop over 500+ fresh products — vegetables, fruits, dairy, and more. Order before 2PM for same-day delivery!
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="d-flex gap-3 mb-4" style={{ maxWidth: '480px' }}>
                <div className="flex-grow-1 position-relative">
                  <i className="fas fa-search position-absolute" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)', zIndex: 1 }}></i>
                  <input
                    type="text"
                    placeholder="Search for groceries..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      width: '100%', padding: '14px 16px 14px 46px',
                      border: '2px solid rgba(255,255,255,0.25)',
                      borderRadius: '12px', background: 'rgba(255,255,255,0.15)',
                      color: 'white', fontSize: '0.95rem', outline: 'none',
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                </div>
                <button type="submit" className="btn-accent-custom" style={{ whiteSpace: 'nowrap' }}>
                  Search
                </button>
              </form>

              <div className="d-flex gap-3">
                <Link to="/shop" className="btn-accent-custom">
                  <i className="fas fa-store"></i> Shop Now
                </Link>
                <Link to="/register" className="btn-outline-custom" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
                  <i className="fas fa-user-plus"></i> Join Free
                </Link>
              </div>

              <div className="hero-stats">
                <div className="hero-stat"><span className="num">500+</span><span className="lbl">Products</span></div>
                <div className="hero-stat"><span className="num">10K+</span><span className="lbl">Customers</span></div>
                <div className="hero-stat"><span className="num">2hr</span><span className="lbl">Delivery</span></div>
              </div>
            </div>

            <div className="col-lg-6 text-center d-none d-lg-block">
              <div style={{ fontSize: '12rem', lineHeight: 1, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}>
                🛒
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= FEATURES ======= */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-4">
            {FEATURES.map((f, i) => (
              <div className="col-lg-3 col-md-6" key={i}>
                <div className="feature-card">
                  <div className="feature-icon" style={{ background: f.color, fontSize: '2rem' }}>
                    {f.icon}
                  </div>
                  <h5 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '1rem' }}>{f.title}</h5>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= PROMO BANNER ======= */}
      <section className="py-4">
        <div className="container">
          <div className="promo-banner">
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', margin: '0 0 8px' }}>
                🎉 First Order Special!
              </h3>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
                Register now and get <strong>FREE delivery</strong> on your first order — no minimum required!
              </p>
            </div>
            <Link to="/register" className="btn-outline-custom" style={{ whiteSpace: 'nowrap', color: 'white', borderColor: 'rgba(255,255,255,0.7)', flexShrink: 0 }}>
              Claim Offer <i className="fas fa-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ======= CATEGORIES ======= */}
      <section className="py-5">
        <div className="container">
          <div className="section-line"></div>
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Explore our wide range of fresh and quality products</p>

          <div className="row g-3">
            {CATEGORIES.map((cat) => (
              <div className="col-6 col-md-3 col-lg-3" key={cat.name}>
                <Link
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="card-custom text-center p-4" style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '2.8rem', marginBottom: '12px', lineHeight: 1 }}>{cat.icon}</div>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.95rem' }}>{cat.name}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= FEATURED PRODUCTS ======= */}
      <section className="py-5" style={{ background: 'white' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <div className="section-line"></div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle mb-0">Hand-picked bestsellers and seasonal favorites</p>
            </div>
            <Link to="/shop" className="btn-outline-custom d-none d-md-flex">
              View All <i className="fas fa-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="row g-4">
              {[...Array(8)].map((_, i) => (
                <div className="col-6 col-md-4 col-lg-3" key={i}>
                  <div className="product-card">
                    <div className="skeleton" style={{ height: '190px' }}></div>
                    <div className="card-body">
                      <div className="skeleton mb-2" style={{ height: '20px', width: '60%' }}></div>
                      <div className="skeleton mb-2" style={{ height: '16px' }}></div>
                      <div className="skeleton" style={{ height: '36px' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-4">
              {featured.map((product, i) => (
                <div className="col-6 col-md-4 col-lg-3 fade-in-up" key={product.id} style={{ animationDelay: `${i * 0.06}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4 d-md-none">
            <Link to="/shop" className="btn-primary-custom">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ======= TRUST SECTION ======= */}
      <section className="py-5" style={{ background: 'var(--primary-light)' }}>
        <div className="container text-center">
          <div className="section-line mx-auto"></div>
          <h2 className="section-title">Why FreshMart?</h2>
          <div className="row g-4 mt-2">
            {[
              { n: '500+', l: 'Products Available', i: '📦' },
              { n: '10K+', l: 'Happy Customers', i: '😊' },
              { n: '4.8★', l: 'Average Rating', i: '⭐' },
              { n: '2hr', l: 'Fastest Delivery', i: '⚡' },
            ].map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{s.i}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>{s.n}</div>
                  <div style={{ color: 'var(--text-mid)', fontWeight: 500, fontSize: '0.9rem' }}>{s.l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
