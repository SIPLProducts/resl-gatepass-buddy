import { useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

function safePath(path: string) {
  if (!path.startsWith('/')) return '/dashboard';
  if (path.startsWith('/cast')) return '/dashboard';
  return path;
}

export default function CastView() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate('/auth', { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    document.title = 'Cast Display | Gate Pass';
  }, []);

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const path = safePath(params.get('path') || '/dashboard');

  if (loading) return null;
  if (!user) return null;

  return (
    <main className="h-screen w-screen bg-background">
      <iframe
        title="Cast display"
        src={path}
        className="h-full w-full border-0"
        loading="eager"
      />
    </main>
  );
}
