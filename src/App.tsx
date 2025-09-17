import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "./pages/Home";
import Wishlist from "./pages/Wishlist";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Blog from "./pages/Blog";
import Sport from "./pages/categories/Sport";
import Lifestyle from "./pages/categories/Lifestyle";
import Prismatic from "./pages/categories/Prismatic";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Lazy load admin pages for better bundle splitting
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminSystemUsers = lazy(() => import("./pages/admin/AdminSystemUsers"));
const AdminSuppliers = lazy(() => import("./pages/admin/AdminSuppliers"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminCollections = lazy(() => import("./pages/admin/AdminCollections"));
const AdminVariants = lazy(() => import("./pages/admin/AdminVariants"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminInvoices = lazy(() => import("./pages/admin/AdminInvoices"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import LegalNotice from "./pages/LegalNotice";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfSale from "./pages/TermsOfSale";
import NotFound from "./pages/NotFound";

// Import i18n configuration
import './i18n/config';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sport" element={<Sport />} />
                <Route path="/lifestyle" element={<Lifestyle />} />
                <Route path="/prismatic" element={<Prismatic />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/account" element={<Account />} />
                <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <AdminDashboard />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <AdminUsers />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/system-users" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <AdminSystemUsers />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/suppliers" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <AdminSuppliers />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <AdminProducts />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/collections" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <AdminCollections />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/variants" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <AdminVariants />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/categories" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <AdminCategories />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <AdminOrders />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/invoices" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <AdminInvoices />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <AdminSettings />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
                    <AdminAnalytics />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:orderId" element={<OrderSuccess />} />
              <Route path="/mentions-legales" element={<LegalNotice />} />
              <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
              <Route path="/conditions-generales-vente" element={<TermsOfSale />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
