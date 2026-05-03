import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { toast } from 'react-toastify';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    payment_method: 'COD',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const deliveryCharge = cartTotal >= 500 ? 0 : 40;
  const grandTotal = cartTotal + deliveryCharge;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (cart.length === 0) {
      toast.error('Cart is empty!');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
        payment_method: form.payment_method,
        notes: form.notes,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const res = await API.post('/orders', payload);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-success/${res.data.orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="fas fa-credit-card me-2"></i>Checkout</h1>
          <p>Complete your order below</p>
        </div>
      </div>

      <div className="container py-4 pb-5">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Left: Delivery Details */}
            <div className="col-lg-7">
              {/* Delivery Info */}
              <div className="card-custom p-4 mb-4">
                <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '20px' }}>
                  <i className="fas fa-map-marker-alt me-2" style={{ color: 'var(--accent)' }}></i>
                  Delivery Details
                </h5>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange}
                      className="form-control-custom" placeholder="Enter your full name" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Email *</label>
                    <input name="email" value={form.email} onChange={handleChange}
                      className="form-control-custom" type="email" placeholder="your@email.com" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange}
                      className="form-control-custom" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">City</label>
                    <input name="city" value={form.city} onChange={handleChange}
                      className="form-control-custom" placeholder="City name" />
                  </div>
                  <div className="col-12">
                    <label className="form-label-custom">Delivery Address *</label>
                    <textarea name="address" value={form.address} onChange={handleChange}
                      className="form-control-custom" rows={3}
                      placeholder="House No., Street, Area, Landmark..." required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label-custom">PIN Code</label>
                    <input name="pincode" value={form.pincode} onChange={handleChange}
                      className="form-control-custom" placeholder="6-digit PIN" maxLength={6} />
                  </div>
                  <div className="col-12">
                    <label className="form-label-custom">Special Instructions (optional)</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange}
                      className="form-control-custom" rows={2}
                      placeholder="Any special delivery instructions..." />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card-custom p-4">
                <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '20px' }}>
                  <i className="fas fa-wallet me-2" style={{ color: 'var(--accent)' }}></i>
                  Payment Method
                </h5>

                <div className="row g-3">
                  {[
                    { value: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives at your door' },
                    { value: 'UPI', label: 'UPI Payment', icon: '📱', desc: 'Pay via Google Pay, PhonePe, Paytm, etc.' },
                  ].map(opt => (
                    <div className="col-md-6" key={opt.value}>
                      <label
                        style={{
                          display: 'block', padding: '16px 20px', borderRadius: 'var(--radius-md)',
                          border: `2px solid ${form.payment_method === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                          cursor: 'pointer', transition: 'all 0.2s',
                          background: form.payment_method === opt.value ? 'var(--primary-light)' : 'white',
                        }}
                      >
                        <input type="radio" name="payment_method" value={opt.value}
                          checked={form.payment_method === opt.value}
                          onChange={handleChange} style={{ display: 'none' }} />
                        <div className="d-flex align-items-center gap-3">
                          <span style={{ fontSize: '1.8rem' }}>{opt.icon}</span>
                          <div>
                            <p style={{ fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>{opt.label}</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: 0 }}>{opt.desc}</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="col-lg-5">
              <div className="card-custom p-4" style={{ position: 'sticky', top: '100px' }}>
                <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '20px' }}>
                  <i className="fas fa-receipt me-2" style={{ color: 'var(--accent)' }}></i>
                  Order Summary
                </h5>

                {/* Cart Items */}
                <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '16px' }}>
                  {cart.map(item => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-2 py-2"
                      style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                          {item.quantity}
                        </span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>{item.name}</span>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: 'var(--text-mid)' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: 'var(--text-mid)' }}>Delivery</span>
                  <span style={{ fontWeight: 600, color: deliveryCharge === 0 ? 'var(--primary)' : 'inherit' }}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary)' }}>₹{grandTotal.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary-custom"
                  style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '1rem' }}
                >
                  {submitting ? (
                    <><div className="spinner-custom" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></div> Placing Order...</>
                  ) : (
                    <><i className="fas fa-check-circle me-2"></i>Place Order — ₹{grandTotal.toFixed(2)}</>
                  )}
                </button>

                <div className="text-center mt-3">
                  <small style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>
                    <i className="fas fa-shield-alt me-1"></i> Your data is safe and encrypted
                  </small>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
