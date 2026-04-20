'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  FileText, 
  Settings, 
  LogOut,
  X,
  Puzzle,
  Rss,
  Image as ImageIcon,
  CalendarDays,
  ChevronRight,
  Mail,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  logout: () => void;
  user: any;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Properties', href: '/dashboard/properties', icon: Home },
  { name: 'Pages', href: '/dashboard/pages', icon: FileText, adminOnly: true },
  { name: 'Blog', href: '/dashboard/blog', icon: Rss, adminOnly: true },
  { name: 'Media', href: '/dashboard/media', icon: ImageIcon },
  { name: 'Bookings', href: '/dashboard/bookings', icon: CalendarDays },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Inquiries', href: '/dashboard/inquiries', icon: Mail, adminOnly: true },
  { name: 'Users', href: '/dashboard/users', icon: Users, adminOnly: true },
  { name: 'Plugins', href: '/dashboard/plugins', icon: Puzzle, adminOnly: true },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, adminOnly: true },
];

export function Sidebar({ isOpen, onClose, logout, user }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = user?.role === 'ADMIN';

  const filteredItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="flex items-center justify-between h-20 px-8 border-b border-border bg-primary/5">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-xl italic">I</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">IslandInvest</span>
            </Link>
            <button className="lg:hidden p-2 hover:bg-muted rounded-full transition-colors" onClick={onClose}>
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1 custom-scrollbar">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link 
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={cn(
                    "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 translate-x-1" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className={cn("mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110")} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={16} className="text-primary-foreground/70" />}
                </Link>
              );
            })}
          </nav>

          {/* User Section / Bottom */}
          <div className="p-4 border-t border-border bg-muted/30">
            <button 
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200 group"
            >
              <LogOut className="mr-3 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
