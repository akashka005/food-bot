'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { Loader2, Mail, Lock, ChevronRight, Utensils, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['STUDENT', 'VENDOR', 'ADMIN']),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: 'STUDENT' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      role: data.role,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
    } else {
      if (data.role === 'STUDENT') router.push('/dashboard');
      else if (data.role === 'VENDOR') router.push('/vendor');
      else router.push('/admin');
    }
  };

  const roles = [
    { value: 'STUDENT', label: 'Student' },
    { value: 'VENDOR', label: 'Vendor' },
    { value: 'ADMIN', label: 'Admin' },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-12 h-12 border-4 border-foreground rounded-xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform brutal-shadow-sm">
              <Utensils className="w-6 h-6 text-foreground" />
            </div>
          </Link>
          <h1 className="text-4xl font-black uppercase text-foreground">Welcome back</h1>
          <p className="text-foreground/70 font-bold mt-2 text-sm uppercase">Sign in to continue ordering</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border-4 border-foreground brutal-shadow">
          {/* Role tabs */}
          <div className="flex rounded-xl bg-muted p-1 mb-6 border-2 border-foreground brutal-shadow-sm">
            {roles.map((role) => (
              <button
                key={role.value}
                id={`role-${role.value.toLowerCase()}`}
                type="button"
                onClick={() => setValue('role', role.value)}
                className={cn(
                  'flex-1 py-2 text-sm font-black uppercase rounded-lg transition-all border-2 border-transparent',
                  selectedRole === role.value
                    ? 'bg-primary text-foreground border-foreground brutal-shadow-sm'
                    : 'text-foreground/60 hover:text-foreground'
                )}
              >
                {role.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-black uppercase text-foreground mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@lpu.edu.in"
                  autoComplete="email"
                  {...register('email')}
                  className={cn(
                    'w-full bg-white border-2 rounded-xl py-3 pl-10 pr-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-4 focus:ring-secondary transition-all font-bold',
                    errors.email ? 'border-destructive bg-destructive/10' : 'border-foreground brutal-shadow-sm'
                  )}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs font-bold text-destructive uppercase">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-black uppercase text-foreground">Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-primary hover:text-secondary transition-colors uppercase">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                  className={cn(
                    'w-full bg-white border-2 rounded-xl py-3 pl-10 pr-10 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-4 focus:ring-secondary transition-all font-bold',
                    errors.password ? 'border-destructive bg-destructive/10' : 'border-foreground brutal-shadow-sm'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs font-bold text-destructive uppercase">{errors.password.message}</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-destructive border-2 border-foreground rounded-xl px-4 py-3 text-sm font-bold text-white uppercase brutal-shadow-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-foreground font-black uppercase py-4 border-4 border-foreground rounded-xl brutal-shadow-sm brutal-shadow-hover flex items-center justify-center gap-2 text-lg mt-4 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-primary transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm font-bold text-foreground/60 mt-8 uppercase">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-foreground hover:text-primary transition-colors font-black underline decoration-2 underline-offset-4">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
