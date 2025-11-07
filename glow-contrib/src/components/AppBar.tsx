import { Bell, Menu, User, LogOut, Settings, CheckCircle, XCircle, FileText, Shield, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

interface AppBarProps {
  onMenuClick?: () => void;
}

export const AppBar = ({ onMenuClick }: AppBarProps) => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/submit', label: 'Contributions' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/profile', label: 'Profile' },
  ];

  // Add admin link if user is admin
  if (isAuthenticated && user?.role === 'admin') {
    navLinks.push({ path: '/admin', label: 'Admin' });
  }

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-primary/20">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">C</span>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:inline">
              ContriBlock
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={location.pathname === link.path ? 'secondary' : 'ghost'}
                  size="sm"
                  className="text-sm"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Notifications + Wallet + Avatar */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 glass border-primary/20">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAll();
                    }}
                    className="h-6 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[400px]">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">No notifications</p>
                    <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="py-1">
                    {notifications.map((notif) => {
                      const Icon = 
                        notif.type === 'success' ? CheckCircle :
                        notif.type === 'error' ? XCircle :
                        notif.type === 'warning' ? Shield :
                        FileText;
                      
                      return (
                        <DropdownMenuItem
                          key={notif.id}
                          className={`p-3 mb-1 ${!notif.read ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                          onClick={() => !notif.read && markAsRead(notif.id)}
                        >
                          <div className="flex items-start gap-3 w-full">
                            <div className={`mt-0.5 rounded-full p-1.5 ${
                              notif.type === 'success' ? 'bg-green-500/20 text-green-500' :
                              notif.type === 'error' ? 'bg-red-500/20 text-red-500' :
                              notif.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                              'bg-blue-500/20 text-blue-500'
                            }`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium line-clamp-1 ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notif.title}
                              </p>
                              <p className={`text-xs mt-1 line-clamp-2 ${!notif.read ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                                {notif.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            {!notif.read && (
                              <div className="h-2 w-2 rounded-full bg-primary mt-1 flex-shrink-0" />
                            )}
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Wallet removed - using login/signup instead */}

          {/* Avatar Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {user?.name || 'Profile'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/signup" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
