import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FloatingCart from './components/ui/FloatingCart';
import HomePage from './pages/public/HomePage';
import CartPage from './pages/public/CartPage';
import CheckoutPage from './pages/public/CheckoutPage';
import OrderConfirmationPage from './pages/public/OrderConfirmationPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminBanners from './pages/admin/AdminBanners';
import AdminVouchers from './pages/admin/AdminVouchers';
import AdminTransactions from './pages/admin/AdminTransactions';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isFloatingCartVisible } = useCart();
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 bg-grid-cyan-500/[0.05]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/thank-you" element={<OrderConfirmationPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute>
                <AdminLayout><AdminProducts /></AdminLayout>
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/admin/banners" 
            element={
              <ProtectedRoute>
                <AdminLayout><AdminBanners /></AdminLayout>
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/admin/vouchers" 
            element={
              <ProtectedRoute>
                <AdminLayout><AdminVouchers /></AdminLayout>
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/admin/transactions" 
            element={
              <ProtectedRoute>
                <AdminLayout><AdminTransactions /></AdminLayout>
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {isFloatingCartVisible && <FloatingCart />}
      <Footer />
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <AuthProvider>
          <HashRouter>
            <AppContent />
          </HashRouter>
        </AuthProvider>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;