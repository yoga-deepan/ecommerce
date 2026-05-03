import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', background: 'var(--bg)', padding: '40px 0' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card-custom p-5">
              {/* Logo */}
              <div className="text-center mb-4">
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🛒</div>
                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', margin: 0 }}>FreshMart</h2>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: '8px 0 0' }}>Sign in to your account</p>
              </div>

              {/* Quick fill for demo */}
              <div className="p-3 rounded-3 mb-4" style={{ background: 'var(--accent-light)', border: '1px solid rgba(249,115,22,0.2)' }}>
                <p style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent)', margin: '0 0 8px' }}>
                  <i className="fas fa-info-circle me-1"></i> Demo Credentials
                </p>
                <div className="d-flex gap-2 flex-wrap">
                  <button onClick={() => setForm({ email: 'admin@gmail.com', password: 'admin123' })}
                    style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                    Admin Login
                  </button>
                  <button onClick={() => setForm({ email: 'customer@gmail.com', password: 'customer123' })}
                    style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                    Customer Login
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label-custom">Email Address</label>
                  <div className="position-relative">
                    <i className="fas fa-envelope position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', zIndex: 1 }}></i>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="form-control-custom"
                      placeholder="your@email.com"
                      style={{ paddingLeft: '42px' }}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label-custom">Password</label>
                  <div className="position-relative">
                    <i className="fas fa-lock position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', zIndex: 1 }}></i>
                    <input
                      name="password"
                      type={showPwd ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange}
                      className="form-control-custom"
                      placeholder="Your password"
                      style={{ paddingLeft: '42px', paddingRight: '42px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}
                    >
                      <i className={`fas fa-eye${showPwd ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-custom"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                >
                  {loading ? (
                    <><div className="spinner-custom" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></div> Signing in...</>
                  ) : (
                    <><i className="fas fa-sign-in-alt me-2"></i>Sign In</>
                  )}
                </button>
              </form>

              <p className="text-center mt-4 mb-0" style={{ fontSize: '0.9rem', color: 'var(--text-mid)' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
                  Sign up free →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
