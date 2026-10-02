import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Briefcase } from 'lucide-react';
import ApplicationsPage from './pages/ApplicationsPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <a href="/" className="topbar-logo">
            <Briefcase size={20} />
            <span>Job<b style={{ color: 'var(--primary)' }}>Tracker</b></span>
          </a>
        </header>

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<ApplicationsPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailPage />} />
            <Route
              path="*"
              element={
                <div className="page">
                  <div className="empty-state">
                    <h1 className="page-title">Page not found</h1>
                    <p>The page you’re looking for doesn’t exist.</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
                      Go to applications
                    </Link>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '8px',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  );
}
