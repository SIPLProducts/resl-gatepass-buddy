import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import loginBg from '@/assets/login-bg.jpg';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-2xl">R</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">RESL</h1>
                <p className="text-sm opacity-80">Gate Entry Management</p>
              </div>
            </div>
          </div>
          
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4 animate-slide-up">
              Streamline Your Gate Operations
            </h2>
            <p className="text-lg opacity-90 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Efficient tracking of inward and outward movements with seamless SAP integration.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm opacity-70">
            <Shield className="w-4 h-4" />
            <span>Enterprise-grade security for your data</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">R</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">RESL</h1>
              <p className="text-sm text-muted-foreground">Gate Entry Management</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Enter your credentials to access the system</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) => setFormData({ ...formData, remember: checked as boolean })}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
              <button type="button" className="text-sm text-accent hover:underline">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Sign In
                </div>
              )}
            </Button>
          </form>

          <div className="mt-12 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Developed by <span className="font-medium">Sharvi Infotech Pvt. Ltd.</span>
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
