import { auth } from '@smartfood/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Search, Filter, MessageSquare, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Support Tickets' };

export default async function AdminSupportPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login');

  // Mock support tickets since there's no DB model for this yet
  const tickets = [
    {
      id: 'T-1042',
      subject: 'Issue with payment deduction',
      user: 'Ravi Kumar',
      role: 'Student',
      status: 'OPEN',
      priority: 'HIGH',
      updatedAt: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: 'T-1041',
      subject: 'Menu item picture not uploading',
      user: 'Spice Route',
      role: 'Vendor',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: 'T-1040',
      subject: 'Order marked as ready but stall was closed',
      user: 'Priya Sharma',
      role: 'Student',
      status: 'RESOLVED',
      priority: 'HIGH',
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Support Tickets</h1>
          <p className="text-muted-foreground mt-1">Manage user issues and inquiries</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search tickets..."
              className="bg-card border border-border rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-64"
            />
          </div>
          <button className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-border">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-secondary/30 transition-colors group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  ticket.status === 'OPEN' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                  ticket.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' :
                  'bg-green-100 text-green-600 dark:bg-green-900/30'
                }`}>
                  {ticket.status === 'OPEN' ? <AlertCircle className="w-5 h-5" /> :
                   ticket.status === 'IN_PROGRESS' ? <MessageSquare className="w-5 h-5" /> :
                   <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">{ticket.id}</span>
                    <h3 className="font-semibold text-foreground text-sm">{ticket.subject}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {ticket.user} ({ticket.role})
                    </span>
                    <span>•</span>
                    <span>Updated {formatRelativeTime(ticket.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  ticket.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {ticket.priority} PRIORITY
                </span>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                  ticket.status === 'OPEN' ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                  ticket.status === 'IN_PROGRESS' ? 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' :
                  'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:border-green-800'
                }`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
