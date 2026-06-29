'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  // Verify / OAuth callback routes redirect here with ?error=... on failure.
  useEffect(() => {
    const err = new URLSearchParams(window.location.search).get('error');
    if (err === 'magic') {
      setError(t('magicError'));
    } else if (err === 'oauth') {
      setError(t('oauthError'));
    }
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/customer-login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/products');
        router.refresh();
      } else {
        setError(t('invalidCredentials'));
      }
    } catch {
      setError(t('connectionError'));
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setError('');
    if (!email) {
      setError(t('magicNeedEmail'));
      return;
    }
    setMagicLoading(true);
    try {
      // Endpoint always returns 200 (no account enumeration); success is the
      // same regardless of whether the email exists.
      await fetch('/api/auth/magic/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setMagicSent(true);
    } catch {
      setError(t('connectionError'));
    } finally {
      setMagicLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t('signInTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          {magicSent ? (
            <p className="text-sm text-muted-foreground">{t('magicSent', { email })}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('signInLoading') : t('signIn')}
              </Button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">{t('or')}</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={magicLoading}
                onClick={handleMagicLink}
              >
                {magicLoading ? t('magicSending') : t('magicButton')}
              </Button>

              {/* OAuth start routes are server redirects, so use a full-page
                  navigation rather than the client router. */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = '/api/auth/oauth/google/start';
                }}
              >
                {t('oauthGoogle')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = '/api/auth/oauth/yandex/start';
                }}
              >
                {t('oauthYandex')}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {t('noAccount')}{' '}
                <Link href="/register" className="underline underline-offset-4">
                  {t('signUp')}
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
