import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../api/axios';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (id) {
      API.get(`/orders/my/${id}`).then(res => setOrder(res.data)).catch(() => {});
    }
  }, [id]);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', padding: '60px 0' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6 text-center">
            <div className="card-custom p-5">
              <div className="success-animation">🎉</div>

              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--primary)', marginBottom: '12px' }}>
                Order Placed!
              </h1>
              <p style={{ color: 'var(--text-mid)', fontSize: '1.05rem', marginBottom: '8px' }}>
                Thank you for shopping with FreshMart!
              </p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Your order <strong style={{ color: 'var(--primary)' }}>#{id}</strong> has been confirmed and is being prepared.
              </p>

              {/* Order Summary Card */}
              {order && (
                <div className="p-4 rounded-3 mb-4" style={{ background: 'var(--primary-light)', textAlign: 'left' }}>
                  <h6 style={{ fontWeight: 700, marginBottom: '12px', color: 'var(--primary)' }}>
                    <i className="fas fa-receipt me-2"></i>Order Summary
                  </h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--text-mid)', fontSize: '0.9rem' }}>Order ID</span>
                    <span style={{ fontWeight: 700 }}>#{order.id}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--text-mid)', fontSize: '0.9rem' }}>Payment</span>
                    <span style={{ fontWeight: 700 }}>{order.payment_method}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--text-mid)', fontSize: '0.9rem' }}>Total Paid</span>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>
                      ₹{parseFloat(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-2 pt-2" style={{ borderTop: '1px dashed rgba(26,122,60,0.3)' }}>
                    <span style={{ color: 'var(--text-mid)', fontSize: '0.85rem' }}>
                      <i className="fas fa-map-marker-alt me-1" style={{ color: 'var(--accent)' }}></i>
                      {order.address}
                    </span>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="p-4 rounded-3 mb-4" style={{ background: 'var(--bg)', textAlign: 'left' }}>
                <h6 style={{ fontWeight: 700, marginBottom: '16px' }}>What happens next?</h6>
                {[
                  { icon: '✅', text: 'Order confirmed & sent to store', done: true },
                  { icon: '📦', text: 'Items being packed (15–30 mins)', done: false },
                  { icon: '🛵', text: 'Out for delivery (1–2 hours)', done: false },
                  { icon: '🏠', text: 'Delivered to your doorstep', done: false },
                ].map((step, i) => (
                  <div key={i} className="d-flex align-items-center gap-3 mb-3">
                    <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{step.icon}</span>
                    <span style={{ fontSize: '0.9rem', color: step.done ? 'var(--primary)' : 'var(--text-mid)', fontWeight: step.done ? 700 : 400 }}>
                      {step.text}
                    </span>
                    {step.done && <i className="fas fa-check-circle ms-auto" style={{ color: 'var(--primary)' }}></i>}
                  </div>
                ))}
              </div>

              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/my-orders" className="btn-primary-custom">
                  <i className="fas fa-box me-2"></i>Track Order
                </Link>
                <Link to="/shop" className="btn-outline-custom">
                  <i className="fas fa-store me-2"></i>Continue Shopping
                </Link>
              </div>

              <p className="mt-4 mb-0" style={{ color: 'var(--text-light)', fontSize: '0.82rem' }}>
                <i className="fas fa-envelope me-1"></i>
                A confirmation has been sent to <strong>{order?.customer_email || 'your email'}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
