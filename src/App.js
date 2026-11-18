import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ResearchSection = lazy(() => import('./components/ResearchSection'));
const TeamSection = lazy(() => import('./components/TeamSection'));
const PublicationsSection = lazy(() => import('./components/PublicationsSection'));
const NewsSection = lazy(() => import('./components/NewsSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Login = lazy(() => import('./pages/Login'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-drone-dark">
    <div className="w-12 h-12 border-4 border-drone-blue border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.4,
};

const PublicLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PublicLayout>
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <HomePage />
            </motion.div>
          </PublicLayout>
        } />
        <Route path="/research" element={
          <PublicLayout>
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <ResearchSection />
            </motion.div>
          </PublicLayout>
        } />
        <Route path="/team" element={
          <PublicLayout>
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <TeamSection />
            </motion.div>
          </PublicLayout>
        } />
        <Route path="/publications" element={
          <PublicLayout>
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <PublicationsSection />
            </motion.div>
          </PublicLayout>
        } />
        <Route path="/news" element={
          <PublicLayout>
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <NewsSection />
            </motion.div>
          </PublicLayout>
        } />
        <Route path="/contact" element={
          <PublicLayout>
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <ContactSection />
            </motion.div>
          </PublicLayout>
        } />
        <Route path="/admin-login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="min-h-screen bg-drone-dark">
          <AnimatedRoutes />
        </div>
      </Suspense>
    </Router>
  );
}

export default App;