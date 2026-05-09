import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ExpertsPage from './pages/ExpertsPage';
import ExpertDetailPage from './pages/ExpertDetailPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import { pageVariants } from './utils/motion';

function AppContent() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <div className="app-grid" />
      <div className="app-orb app-orb--violet" />
      <div className="app-orb app-orb--cyan" />

      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          key={`${location.pathname}${location.search}`}
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="min-h-[calc(100vh-96px)] pb-10"
        >
          <Routes location={location}>
            <Route path="/" element={<ExpertsPage />} />
            <Route path="/experts/:id" element={<ExpertDetailPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.92)',
            color: '#f8fafc',
            border: '1px solid rgba(148, 163, 184, 0.16)',
            borderRadius: '18px',
            fontSize: '14px',
            boxShadow: '0 18px 48px rgba(2, 6, 23, 0.42)',
            backdropFilter: 'blur(18px)',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#08111f' } },
          error: { iconTheme: { primary: '#fb7185', secondary: '#08111f' } },
        }}
      />
      <AppContent />
    </Router>
  );
}
