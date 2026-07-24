import { auth } from '@smartfood/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ShieldAlert, Shield, Users, Lock, ChevronRight, Plus } from 'lucide-react';

export const metadata: Metadata = { title: 'Roles & Access' };

export default async function AdminRBACPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login');

  const roles = [
    {
      name: 'Super Admin',
      description: 'Full access to all platform features, billing, and system configurations.',
      users: 2,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      icon: ShieldAlert,
    },
    {
      name: 'Vendor',
      description: 'Can manage their assigned stall, menu items, kitchen queue, and view analytics.',
      users: 14,
      color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      icon: Shield,
    },
    {
      name: 'Student',
      description: 'Can browse menus, place orders, add to wallet, and leave reviews.',
      users: 2450,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      icon: Users,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Roles & Access Control</h1>
          <p className="text-muted-foreground mt-1">Manage permissions and security policies (RBAC)</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {roles.map((role) => (
          <div key={role.name} className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between hover:border-purple-500/30 transition-colors group">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${role.color}`}>
                <role.icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  {role.name}
                  {role.name === 'Super Admin' && (
                    <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                      Restricted
                    </span>
                  )}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">{role.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 w-full sm:w-auto border-t border-border sm:border-0 pt-4 sm:pt-0">
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Users</p>
                <p className="font-display font-bold text-xl">{role.users}</p>
              </div>
              <button className="ml-auto sm:ml-0 flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded-xl transition-colors">
                <Lock className="w-4 h-4" /> Edit Policies <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 mt-8 flex gap-4">
        <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-blue-800 dark:text-blue-300">Security Note</h3>
          <p className="text-sm text-blue-600/80 dark:text-blue-400/80 mt-1">
            Role assignments are strictly audited. Any changes to the Super Admin role require secondary confirmation from another Super Admin account to prevent accidental lockouts.
          </p>
        </div>
      </div>
    </div>
  );
}
