import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const STATUS_CONFIG = {
  'Pending':          { cls: 'status-pending',   icon: 'fa-clock',           step: 1 },
  'Packed':           { cls: 'status-packed',    icon: 'fa-box',             step: 2 },
  'Out for Delivery': { cls: 'status-out',       icon: 'fa-motorcycle',      step: 3 },
  'Delivered':        { cls: 'status-delivered', icon: 'fa-check-circle',    step: 4 },
};

const STEPS = ['Pending', 'Packed', 'Out for Delivery', 'Delivered'];

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    API.get('/orders/my')
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <div className="spinner-custom mx-auto mb-3"></div>
        <p style={{ color: 'var(--text-light)' }}>Loading your orders...</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="fas fa-box me-2"></i>My Orders</h1>
          <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
      </div>

      <div className="container py-4 pb-5">
        {orders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h4>No orders yet</h4>
            <p>You haven't placed any orders. Start shopping!</p>
            <Link to="/shop" className="btn-primary-custom mt-3">
              <i className="fas fa-store me-2"></i>Browse Products
            </Link>
          </div>
        ) : (
          <div>
            {orders.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
              const isOpen = expanded === order.id;

              return (
                <div className="order-card mb-4" key={order.id}>
                  {/* Order Header */}
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                    <div>
                      <div className="d-flex align-items-center gap-3 flex-wrap mb-1">
                        <h6 style={{ margin: 0, fontWeight: 800 }}>Order #{order.id}</h6>
                        <span className={`status-badge ${cfg.cls}`}>
                          <i className={`fas ${cfg.icon}`}></i> {order.status}
                        </span>
                        <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600 }}>
                          {order.payment_method}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: 0 }}>
                        <i className="fas fa-calendar me-1"></i>
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-end">
                      <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)', margin: 0 }}>
                        ₹{parseFloat(order.total_amount).toFixed(2)}
                      </p>
                      <p style={{ color: 'var(--text-light)', fontSize: '0.82rem', margin: 0 }}>
                        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Progress Tracker */}
                  <div className="mb-3 py-3 px-2 rounded-3" style={{ background: 'var(--bg)' }}>
                    <div className="d-flex align-items-center">
                      {STEPS.map((step, i) => {
                        const done = cfg.step > i + 1;
                        const current = cfg.step === i + 1;
                        return (
                          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '64px' }}>
                              <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: done || current ? 'var(--primary)' : 'var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.8rem', color: done || current ? 'white' : 'var(--text-light)',
                                fontWeight: 700, flexShrink: 0,
                                boxShadow: current ? '0 0 0 4px rgba(26,122,60,0.2)' : 'none',
                                transition: 'all 0.3s',
                              }}>
                                {done ? <i className="fas fa-check"></i> : i + 1}
                              </div>
                              <span style={{ fontSize: '0.65rem', fontWeight: 600, marginTop: '6px', textAlign: 'center', color: done || current ? 'var(--primary)' : 'var(--text-light)', lineHeight: '1.2' }}>
                                {step}
                              </span>
                            </div>
                            {i < STEPS.length - 1 && (
                              <div style={{ flex: 1, height: '3px', background: done ? 'var(--primary)' : 'var(--border)', margin: '0 4px', marginBottom: '18px', borderRadius: '2px', transition: 'all 0.3s' }}></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Address Preview */}
                  <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: '0 0 12px' }}>
                    <i className="fas fa-map-marker-alt me-1" style={{ color: 'var(--accent)' }}></i>
                    {order.address}{order.city ? `, ${order.city}` : ''}{order.pincode ? ` - ${order.pincode}` : ''}
                  </p>

                  {/* Toggle Items */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--primary)', padding: '7px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} me-1`}></i>
                    {isOpen ? 'Hide Items' : 'View Items'}
                  </button>

                  {/* Items Detail */}
                  {isOpen && (
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                      <div className="row g-2">
                        {order.items?.map(item => (
                          <div className="col-12" key={item.id}>
                            <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'var(--bg)' }}>
                              {item.product_image ? (
                                <img src={item.product_image} alt={item.product_name}
                                  style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', background: 'var(--primary-light)' }}
                                  onError={e => e.target.style.display = 'none'} />
                              ) : (
                                <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🛒</div>
                              )}
                              <div className="flex-grow-1">
                                <p style={{ fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>{item.product_name}</p>
                                <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.82rem' }}>
                                  ₹{parseFloat(item.price).toFixed(2)} × {item.quantity}
                                </p>
                              </div>
                              <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{parseFloat(item.subtotal).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 d-flex justify-content-end" style={{ borderTop: '1px dashed var(--border)' }}>
                        <div className="text-end">
                          <p style={{ color: 'var(--text-mid)', margin: '0 0 4px', fontSize: '0.9rem' }}>Order Total</p>
                          <p style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary)', margin: 0 }}>
                            ₹{parseFloat(order.total_amount).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
