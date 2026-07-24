'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, Lock, User, Phone, ChevronRight, Utensils, Eye, EyeOff, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  registrationNumber: z.string().regex(/^\d{8}$/, 'Must be exactly 8 digits'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const selectedRole = watch('role' as any) || 'STUDENT';

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          registrationNumber: data.registrationNumber,
          phone: data.phone,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Registration failed. Please try again.');
        return;
      }
      router.push('/login?registered=1');
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  const roles = [
    { value: 'STUDENT', label: 'Student' },
    { value: 'VENDOR', label: 'Vendor' },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-12 h-12 border-4 border-foreground rounded-xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform brutal-shadow-sm">
              <Utensils className="w-6 h-6 text-foreground" />
            </div>
          </Link>
          <h1 className="text-4xl font-black uppercase text-foreground text-center">Create account</h1>
          <p className="text-foreground/70 font-bold mt-2 text-sm uppercase text-center">Join LPU SmartFood today</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border-4 border-foreground brutal-shadow">
          <div className="flex rounded-xl bg-muted p-1 mb-6 border-2 border-foreground brutal-shadow-sm">
            {roles.map((role) => (
              <button
                key={role.value}
                id={`role-${role.value.toLowerCase()}`}
                type="button"
                onClick={() => setValue('role' as any, role.value)}
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
            <div>
              <label className="block text-sm font-black uppercase text-foreground mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
                <input
                  id="register-name"
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  className={cn(
                    'w-full bg-white border-2 rounded-xl py-3 pl-10 pr-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-4 focus:ring-secondary transition-all font-bold',
                    errors.name ? 'border-destructive bg-destructive/10' : 'border-foreground brutal-shadow-sm'
                  )}
                />
              </div>
              {errors.name && <p className="mt-2 text-xs font-bold text-destructive uppercase">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-black uppercase text-foreground mb-2">Registration Number</label>
              <div className="relative">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
                <input
                  id="register-reg"
                  type="text"
                  placeholder="12012345"
                  {...register('registrationNumber')}
                  className={cn(
                    'w-full bg-white border-2 rounded-xl py-3 pl-10 pr-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-4 focus:ring-secondary transition-all font-bold',
                    errors.registrationNumber ? 'border-destructive bg-destructive/10' : 'border-foreground brutal-shadow-sm'
                  )}
                />
              </div>
              {errors.registrationNumber && <p className="mt-2 text-xs font-bold text-destructive uppercase">{errors.registrationNumber.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-black uppercase text-foreground mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
                <input
                  id="register-email"
                  type="email"
                  placeholder="you@lpu.edu.in"
                  {...register('email')}
                  className={cn(
                    'w-full bg-white border-2 rounded-xl py-3 pl-10 pr-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-4 focus:ring-secondary transition-all font-bold',
                    errors.email ? 'border-destructive bg-destructive/10' : 'border-foreground brutal-shadow-sm'
                  )}
                />
              </div>
              {errors.email && <p className="mt-2 text-xs font-bold text-destructive uppercase">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-black uppercase text-foreground mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
                <input
                  id="register-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  {...register('phone')}
                  className={cn(
                    'w-full bg-white border-2 rounded-xl py-3 pl-10 pr-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-4 focus:ring-secondary transition-all font-bold',
                    errors.phone ? 'border-destructive bg-destructive/10' : 'border-foreground brutal-shadow-sm'
                  )}
                />
              </div>
              {errors.phone && <p className="mt-2 text-xs font-bold text-destructive uppercase">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-black uppercase text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={cn(
                    'w-full bg-white border-2 rounded-xl py-3 pl-10 pr-10 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-4 focus:ring-secondary transition-all font-bold',
                    errors.password ? 'border-destructive bg-destructive/10' : 'border-foreground brutal-shadow-sm'
                  )}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-xs font-bold text-destructive uppercase">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-black uppercase text-foreground mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
                <input
                  id="register-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={cn(
                    'w-full bg-white border-2 rounded-xl py-3 pl-10 pr-10 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-4 focus:ring-secondary transition-all font-bold',
                    errors.confirmPassword ? 'border-destructive bg-destructive/10' : 'border-foreground brutal-shadow-sm'
                  )}
                />
              </div>
              {errors.confirmPassword && <p className="mt-2 text-xs font-bold text-destructive uppercase">{errors.confirmPassword.message}</p>}
            </div>

            {error && (
              <div className="bg-destructive border-2 border-foreground rounded-xl px-4 py-3 text-sm font-bold text-white uppercase brutal-shadow-sm">
                {error}
              </div>
            )}

            <button
              id="register-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-foreground font-black uppercase py-4 border-4 border-foreground rounded-xl brutal-shadow-sm brutal-shadow-hover flex items-center justify-center gap-2 text-lg mt-4 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-primary transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Sign up
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm font-bold text-foreground/60 mt-8 uppercase">
            Already have an account?{' '}
            <Link href="/login" className="text-foreground hover:text-primary transition-colors font-black underline decoration-2 underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
