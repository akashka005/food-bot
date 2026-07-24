import { auth } from '@smartfood/auth';
import { prisma } from '@smartfood/database';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { User, Mail, Phone, Shield, Edit3 } from 'lucide-react';

export const metadata: Metadata = { title: 'My Profile' };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const student = await prisma.student.findUnique({
    where: { id: session.user.id },
  });

  if (!student) redirect('/login');

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings</p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-brand opacity-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-24 h-24 rounded-full bg-gradient-brand flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-card">
            {student.name.charAt(0)}
          </div>
          
          <div className="flex-1 text-center md:text-left pt-2">
            <h2 className="font-display text-2xl font-bold text-foreground">{student.name}</h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mt-2">
              <Shield className="w-3.5 h-3.5" />
              LPU Student
            </div>
          </div>

          <button className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email Address</label>
            <div className="mt-1.5 flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3 border border-border">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">{student.email}</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
            <div className="mt-1.5 flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3 border border-border">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">{student.phone}</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Dietary Preference</label>
            <div className="mt-1.5 flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3 border border-border">
              <Utensils className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground capitalize">{student.dietaryPreference?.toLowerCase() ?? 'Not set'}</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Loyalty Points</label>
            <div className="mt-1.5 flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3 border border-border">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-foreground">{student.rewardPoints} points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Additional icons
function Utensils(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
