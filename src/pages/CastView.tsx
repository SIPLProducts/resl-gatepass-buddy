import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import Dashboard from '@/pages/Dashboard';
import Reports from '@/pages/Reports';
import DisplayEntry from '@/pages/DisplayEntry';
import InwardWithoutReference from '@/pages/inward/InwardWithoutReference';

function normalizePath(path: string) {
  if (!path.startsWith('/')) return '/dashboard';
  return path;
}

export default function CastView() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Cast Display | Gate Pass';
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [loading, user, navigate]);

  const target = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return normalizePath(params.get('path') || '/dashboard');
  }, [location.search]);

  if (loading) return null;
  if (!user) return null;

  const content = (() => {
    // Render directly (no iframe) so auth/session/state always works.
    switch (true) {
      case target.startsWith('/reports'):
        return <Reports />;
      case target.startsWith('/display'):
        return <DisplayEntry />;
      case target.startsWith('/inward/without-reference'):
        return <InwardWithoutReference />;
      case target.startsWith('/dashboard'):
      default:
        return <Dashboard />;
    }
  })();

  return (
    <main className="min-h-screen w-full bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3">
          <h1 className="text-base font-semibold text-foreground">Cast Display</h1>
          <div className="text-xs text-muted-foreground">Showing: {target}</div>
        </div>
      </header>
      <section className="mx-auto max-w-screen-2xl p-4">
        {content}
      </section>
    </main>
  );
}
