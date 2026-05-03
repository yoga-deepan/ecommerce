import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { toast } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all required fields.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      login(res.data.user, res.data.token);
      toast.success(`Welcome to FreshMart, ${res.data.user.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#ef4444', '#f97316', '#22c55e'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', background: 'var(--bg)', padding: '40px 0' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card-custom p-5">
              {/* Logo */}
              <div className="text-center mb-4">
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🛒</div>
                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', margin: 0 }}>Create Account</h2>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: '8px 0 0' }}>Join FreshMart and shop fresh today!</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label-custom">Full Name *</label>
                    <div className="position-relative">
                      <i className="fas fa-user position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}></i>
                      <input name="name" value={form.name} onChange={handleChange}
                        className="form-control-custom" placeholder="Your full name"
                        style={{ paddingLeft: '42px' }} required />
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label-custom">Email Address *</label>
                    <div className="position-relative">
                      <i className="fas fa-envelope position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}></i>
                      <input name="email" type="email" value={form.email} onChange={handleChange}
                        className="form-control-custom" placeholder="your@email.com"
                        style={{ paddingLeft: '42px' }} required />
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label-custom">Phone Number</label>
                    <div className="position-relative">
                      <i className="fas fa-phone position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}></i>
                      <input name="phone" value={form.phone} onChange={handleChange}
                        className="form-control-custom" placeholder="+91 XXXXX XXXXX"
                        style={{ paddingLeft: '42px' }} />
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label-custom">Password *</label>
                    <div className="position-relative">
                      <i className="fas fa-lock position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}></i>
                      <input name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={handleChange}
                        className="form-control-custom" placeholder="Min. 6 characters"
                        style={{ paddingLeft: '42px', paddingRight: '42px' }} required />
                      <button type="button" onClick={() => setShowPwd(!showPwd)}
                        style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                        <i className={`fas fa-eye${showPwd ? '-slash' : ''}`}></i>
                      </button>
                    </div>
                    {form.password && (
                      <div className="mt-2">
                        <div style={{ height: '4px', borderRadius: '2px', background: 'var(--border)', overflow: 'hidden' }}>
                          <div style={{ width: `${(strength / 3) * 100}%`, height: '100%', background: strengthColors[strength], transition: 'all 0.3s', borderRadius: '2px' }}></div>
                        </div>
                        <small style={{ color: strengthColors[strength], fontWeight: 600 }}>{strengthLabels[strength]} password</small>
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="form-label-custom">Confirm Password *</label>
                    <div className="position-relative">
                      <i className="fas fa-lock position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}></i>
                      <input name="confirm" type="password" value={form.confirm} onChange={handleChange}
                        className="form-control-custom" placeholder="Re-enter password"
                        style={{ paddingLeft: '42px', borderColor: form.confirm && form.confirm !== form.password ? '#ef4444' : '' }} required />
                    </div>
                    {form.confirm && form.confirm !== form.password && (
                      <small style={{ color: '#ef4444', fontWeight: 600 }}>Passwords do not match</small>
                    )}
                  </div>

                  <div className="col-12">
                    <button type="submit" disabled={loading} className="btn-primary-custom"
                      style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                      {loading ? (
                        <><div className="spinner-custom" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></div> Creating Account...</>
                      ) : (
                        <><i className="fas fa-user-plus me-2"></i>Create Account</>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              <p className="text-center mt-4 mb-0" style={{ fontSize: '0.9rem', color: 'var(--text-mid)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
                  Sign in →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
