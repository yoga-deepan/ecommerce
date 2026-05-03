import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import OrderSuccess from './pages/OrderSuccess';
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected route for authenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{height:'100vh'}}><div className="spinner-custom"></div></div>;
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Admin only route
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{height:'100vh'}}><div className="spinner-custom"></div></div>;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;
  return children;
};

// Layout for customer-facing pages (with navbar and footer)
const CustomerLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ minHeight: '70vh' }}>{children}</main>
    <Footer />
  </>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
      <Route path="/shop" element={<CustomerLayout><Shop /></CustomerLayout>} />
      <Route path="/product/:id" element={<CustomerLayout><ProductDetails /></CustomerLayout>} />
      <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
      <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
      <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />

      {/* Protected Customer Routes */}
      <Route path="/checkout" element={<ProtectedRoute><CustomerLayout><Checkout /></CustomerLayout></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute><CustomerLayout><MyOrders /></CustomerLayout></ProtectedRoute>} />
      <Route path="/order-success/:id" element={<ProtectedRoute><CustomerLayout><OrderSuccess /></CustomerLayout></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
