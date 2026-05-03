import { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { toast } from 'react-toastify';

/* ─────────────────────── SIDEBAR ─────────────────────── */
function Sidebar({ onLogout }) {
  const links = [
    { to: '/admin', icon: 'fa-tachometer-alt', label: 'Dashboard', end: true },
    { to: '/admin/products', icon: 'fa-boxes', label: 'Products' },
    { to: '/admin/orders', icon: 'fa-shopping-bag', label: 'Orders' },
  ];
  return (
    <div className="admin-sidebar">
      <div className="admin-logo">
        <h3>🛒 FreshMart</h3>
        <p>Admin Panel</p>
      </div>
      <nav className="mt-2">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.end}
            className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
            <i className={`fas ${l.icon}`} style={{ width: '20px' }}></i> {l.label}
          </NavLink>
        ))}
        <button onClick={onLogout}
          className="admin-nav-link w-100 border-0 mt-4"
          style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', cursor: 'pointer', textAlign: 'left' }}>
          <i className="fas fa-sign-out-alt" style={{ width: '20px' }}></i> Logout
        </button>
      </nav>
    </div>
  );
}

/* ─────────────────────── OVERVIEW ─────────────────────── */
function Overview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([API.get('/products'), API.get('/orders/all')])
      .then(([p, o]) => {
        const orders = o.data;
        const revenue = orders.filter(x => x.status === 'Delivered').reduce((s, x) => s + parseFloat(x.total_amount), 0);
        setStats({
          products: p.data.length,
          orders: orders.length,
          revenue,
          pending: orders.filter(x => x.status === 'Pending').length,
        });
      }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Products', value: stats?.products ?? '—', icon: '📦', bg: '#e8f5ee', color: '#1a7a3c' },
    { label: 'Total Orders', value: stats?.orders ?? '—', icon: '🛒', bg: '#e0f2fe', color: '#0369a1' },
    { label: 'Revenue', value: stats ? `₹${stats.revenue.toFixed(0)}` : '—', icon: '💰', bg: '#fef3c7', color: '#b45309' },
    { label: 'Pending Orders', value: stats?.pending ?? '—', icon: '⏳', bg: '#fce7f3', color: '#be185d' },
  ];

  return (
    <div>
      <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '24px' }}>Welcome back, Admin! 👋</h5>
      <div className="row g-4 mb-4">
        {cards.map(c => (
          <div className="col-6 col-xl-3" key={c.label}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: c.bg }}>
                <span style={{ fontSize: '1.8rem' }}>{c.icon}</span>
              </div>
              <div>
                <div className="stat-num">{c.value}</div>
                <div className="stat-lbl">{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 rounded-3" style={{ background: 'var(--primary-light)', border: '1px solid rgba(26,122,60,0.15)' }}>
        <h6 style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
          <i className="fas fa-lightbulb me-2"></i>Quick Actions
        </h6>
        <div className="d-flex gap-3 flex-wrap">
          <NavLink to="/admin/products" className="btn-primary-custom" style={{ fontSize: '0.85rem', padding: '8px 18px' }}>
            <i className="fas fa-plus"></i> Add Product
          </NavLink>
          <NavLink to="/admin/orders" className="btn-outline-custom" style={{ fontSize: '0.85rem', padding: '8px 18px' }}>
            <i className="fas fa-eye"></i> View Orders
          </NavLink>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── PRODUCT FORM MODAL ─────────────────────── */
function ProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    original_price: product?.original_price || '',
    category: product?.category || '',
    stock: product?.stock || '',
    unit: product?.unit || 'piece',
    is_featured: product?.is_featured ? 'true' : 'false',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const CATEGORIES = ['Vegetables','Fruits','Dairy & Eggs','Grains & Rice','Pulses & Lentils','Flour & Atta','Oils & Ghee','Beverages','Snacks','Personal Care','Grocery'];

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);

      if (product) {
        await API.put(`/products/${product.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated!');
      } else {
        await API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product added!');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" style={{ fontFamily: 'var(--font-display)' }}>
              {product ? '✏️ Edit Product' : '➕ Add New Product'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <form onSubmit={handleSubmit} id="productForm">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label-custom">Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="form-control-custom" placeholder="e.g. Fresh Tomatoes" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className="form-control-custom" required>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Unit</label>
                  <input name="unit" value={form.unit} onChange={handleChange} className="form-control-custom" placeholder="e.g. 1 kg, 500 g, dozen" />
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Price (₹) *</label>
                  <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className="form-control-custom" placeholder="0.00" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Original Price (₹)</label>
                  <input name="original_price" type="number" step="0.01" value={form.original_price} onChange={handleChange} className="form-control-custom" placeholder="0.00" />
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Stock Quantity</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} className="form-control-custom" placeholder="0" />
                </div>
                <div className="col-12">
                  <label className="form-label-custom">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} className="form-control-custom" rows={3} placeholder="Product description..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Product Image</label>
                  <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="form-control-custom" style={{ cursor: 'pointer' }} />
                  {product?.image && !image && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '4px' }}>
                      <i className="fas fa-image me-1"></i>Current image will be kept if no new image is selected.
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Featured Product?</label>
                  <select name="is_featured" value={form.is_featured} onChange={handleChange} className="form-control-custom">
                    <option value="false">No</option>
                    <option value="true">Yes — Show on Homepage</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn-outline-custom" style={{ padding: '10px 24px' }}>Cancel</button>
            <button type="submit" form="productForm" disabled={loading} className="btn-primary-custom" style={{ padding: '10px 24px' }}>
              {loading ? <><div className="spinner-custom" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div> Saving...</> : <><i className="fas fa-save me-1"></i>Save Product</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── PRODUCTS PAGE ─────────────────────── */
function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | product-object
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    API.get('/products').then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted.');
      load();
    } catch { toast.error('Failed to delete.'); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h5 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>Products Management</h5>
          <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: 0 }}>{products.length} total products</p>
        </div>
        <button onClick={() => setModal('add')} className="btn-primary-custom">
          <i className="fas fa-plus"></i> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="search-bar mb-4" style={{ maxWidth: '360px' }}>
        <i className="fas fa-search search-icon"></i>
        <input type="text" className="form-control-custom" placeholder="Search products..."
          value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '44px' }} />
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-custom mx-auto"></div></div>
      ) : (
        <div className="table-custom">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-4" style={{ color: 'var(--text-light)' }}>No products found</td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>{i + 1}</td>
                  <td>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} onError={e => e.target.style.display='none'} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🛒</div>
                    )}
                  </td>
                  <td>
                    <p style={{ fontWeight: 700, margin: '0 0 2px' }}>{p.name}</p>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.78rem', margin: 0 }}>{p.unit}</p>
                  </td>
                  <td>
                    <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600 }}>{p.category}</span>
                  </td>
                  <td>
                    <p style={{ fontWeight: 700, color: 'var(--primary)', margin: 0 }}>₹{parseFloat(p.price).toFixed(2)}</p>
                    {p.original_price && <p style={{ color: 'var(--text-light)', fontSize: '0.78rem', textDecoration: 'line-through', margin: 0 }}>₹{parseFloat(p.original_price).toFixed(2)}</p>}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: p.stock < 10 ? '#dc3545' : 'var(--text-dark)' }}>{p.stock}</span>
                  </td>
                  <td>
                    {p.is_featured ? <span style={{ color: 'var(--accent)', fontWeight: 700 }}>⭐ Yes</span> : <span style={{ color: 'var(--text-light)' }}>No</span>}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button onClick={() => setModal(p)}
                        style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', padding: '6px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)}
                        style={{ background: '#fee2e2', color: '#dc3545', border: 'none', padding: '6px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── ORDERS PAGE ─────────────────────── */
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  const STATUS_OPTIONS = ['Pending', 'Packed', 'Out for Delivery', 'Delivered'];
  const STATUS_COLORS = {
    'Pending': { bg: '#fff8e6', color: '#d97706' },
    'Packed': { bg: '#e0f2fe', color: '#0369a1' },
    'Out for Delivery': { bg: '#fef3c7', color: '#b45309' },
    'Delivered': { bg: '#e8f5ee', color: '#1a7a3c' },
  };

  const load = () => {
    setLoading(true);
    API.get('/orders/all').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      toast.success(`Order #${id} → ${status}`);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch { toast.error('Failed to update status.'); }
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h5 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>Orders Management</h5>
          <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: 0 }}>{orders.length} total orders</p>
        </div>
        {/* Status Filter Pills */}
        <div className="d-flex gap-2 flex-wrap">
          <button onClick={() => setFilter('')} className={`category-pill ${!filter ? 'active' : ''}`} style={{ padding: '6px 16px', fontSize: '0.82rem' }}>All</button>
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`category-pill ${filter === s ? 'active' : ''}`} style={{ padding: '6px 16px', fontSize: '0.82rem' }}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-custom mx-auto"></div></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">📋</span><h4>No orders found</h4></div>
      ) : (
        <div>
          {filtered.map(order => {
            const sc = STATUS_COLORS[order.status] || STATUS_COLORS['Pending'];
            const isOpen = expanded === order.id;
            return (
              <div key={order.id} className="order-card mb-3">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                  <div>
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                      <h6 style={{ fontWeight: 800, margin: 0 }}>Order #{order.id}</h6>
                      <span style={{ background: sc.bg, color: sc.color, padding: '3px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                        {order.status}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-mid)', fontSize: '0.85rem', margin: '0 0 2px' }}>
                      <i className="fas fa-user me-1"></i> <strong>{order.customer_name}</strong> — {order.customer_email}
                    </p>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.82rem', margin: 0 }}>
                      <i className="fas fa-map-marker-alt me-1"></i>{order.address}{order.city ? `, ${order.city}` : ''}
                      {order.pincode ? ` - ${order.pincode}` : ''}
                    </p>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.78rem', margin: '4px 0 0' }}>
                      <i className="fas fa-calendar me-1"></i>{new Date(order.created_at).toLocaleString('en-IN')}
                      &nbsp;|&nbsp; <i className="fas fa-credit-card me-1"></i>{order.payment_method}
                    </p>
                  </div>
                  <div className="text-end">
                    <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)', margin: '0 0 8px' }}>
                      ₹{parseFloat(order.total_amount).toFixed(2)}
                    </p>
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      style={{
                        padding: '7px 14px', borderRadius: '8px',
                        border: `2px solid ${sc.color}`,
                        color: sc.color, fontWeight: 700, fontSize: '0.82rem',
                        background: sc.bg, cursor: 'pointer', outline: 'none',
                      }}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <button onClick={() => setExpanded(isOpen ? null : order.id)}
                  style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                  <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} me-1`}></i>
                  {isOpen ? 'Hide' : 'View'} Items ({order.items?.length || 0})
                </button>

                {isOpen && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="row g-2">
                      {order.items?.map(item => (
                        <div className="col-md-6" key={item.id}>
                          <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'var(--bg)' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>🛒</div>
                            <div className="flex-grow-1 min-w-0">
                              <p style={{ fontWeight: 700, margin: 0, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product_name}</p>
                              <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.78rem' }}>₹{parseFloat(item.price).toFixed(2)} × {item.quantity}</p>
                            </div>
                            <span style={{ fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>₹{parseFloat(item.subtotal).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {order.notes && (
                      <div className="mt-2 p-3 rounded-3" style={{ background: '#fff8e6' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem' }}><i className="fas fa-sticky-note me-1" style={{ color: 'var(--accent)' }}></i><strong>Note:</strong> {order.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── MAIN LAYOUT ─────────────────────── */
const PAGE_TITLES = {
  '/admin': 'Dashboard Overview',
  '/admin/products': 'Product Management',
  '/admin/orders': 'Order Management',
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const path = window.location.pathname;

  const handleLogout = () => {
    logout();
    toast.success('Logged out.');
    navigate('/login');
  };

  const title = Object.entries(PAGE_TITLES).find(([k]) => path === k)?.[1] || 'Admin Panel';

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onLogout={handleLogout} />
      <div className="admin-content">
        <div className="admin-header">
          <h4>{title}</h4>
          <div className="d-flex align-items-center gap-3">
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 700, margin: 0, fontSize: '0.9rem' }}>{user?.name}</p>
              <p style={{ color: 'var(--accent)', fontSize: '0.75rem', margin: 0, fontWeight: 600 }}>
                <i className="fas fa-crown me-1"></i>Administrator
              </p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        <div className="admin-main">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
