"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Server,
  Ticket,
  ShoppingBag,
  Zap,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Music,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  adminOnly?: boolean;
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const isAdmin = (session?.user as any)?.role === "DEVELOPER";

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: "Servidores",
      href: "/dashboard/servidores",
      icon: <Server className="w-5 h-5" />,
    },
    {
      title: "Economía",
      href: "/dashboard/economia",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      title: "Tickets",
      href: "/dashboard/tickets",
      icon: <Ticket className="w-5 h-5" />,
    },
    {
      title: "Comandos",
      href: "/dashboard/comandos",
      icon: <Zap className="w-5 h-5" />,
    },
    ...(isAdmin
      ? [
          {
            title: "Admin Panel",
            href: "/dashboard/admin",
            icon: <BarChart3 className="w-5 h-5" />,
            badge: "ADMIN",
          },
        ]
      : []),
  ];

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href;

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
          isActive
            ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/25"
            : "text-gray-300 hover:bg-white/5 hover:text-white"
        )}
        onClick={() => setOpen(false)}
      >
        {/* Efecto glow en hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-violet-600/0 group-hover:from-purple-600/10 group-hover:to-violet-600/10 transition-all duration-300" />
        <span className="relative flex items-center gap-3">
          {item.icon}
          <span className="font-medium">{item.title}</span>
          {item.badge && (
            <span className="ml-auto text-xs bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-1 rounded-full font-bold animate-pulse-glow">
              {item.badge}
            </span>
          )}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 md:hidden glass-strong p-3 rounded-xl text-white hover:scale-105 transition-transform"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 w-72 h-screen glass-strong overflow-y-auto transition-all duration-500 z-40",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-purple-500/20">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30 animate-pulse-glow">
              G
            </div>
            <div>
              <p className="font-bold text-white text-xl bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                Galaxity
              </p>
              <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Bot Panel</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        {session?.user && (
          <div className="p-4 mx-4 my-4 rounded-2xl glass animate-float">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <img
                  src={(session.user as any).image || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-12 h-12 rounded-xl ring-2 ring-purple-500/50"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a1a]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{session.user.name}</p>
                <p className="text-xs text-purple-400 font-medium">
                  {((session.user as any).role || "Usuario").toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* Settings & Logout */}
        <div className="p-4 border-t border-purple-500/20 mt-auto space-y-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-300 group"
            onClick={() => setOpen(false)}
          >
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">Configuración</span>
          </Link>

          <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>

        {/* Decorative gradient orb */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      </aside>

      {/* Overlay para móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
