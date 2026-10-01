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
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
          isActive
            ? "bg-blue-600 text-white shadow-lg"
            : "text-gray-300 hover:bg-blue-950/50"
        )}
        onClick={() => setOpen(false)}
      >
        {item.icon}
        <span className="font-medium">{item.title}</span>
        {item.badge && (
          <span className="ml-auto text-xs bg-red-600 px-2 py-1 rounded">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 p-2 rounded-lg text-white"
      >
        {open ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 w-64 h-screen bg-gradient-to-b from-blue-950 to-blue-900 border-r border-blue-800 overflow-y-auto transition-all duration-300",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              K
            </div>
            <div>
              <p className="font-bold text-white text-lg">Kimeoro</p>
              <p className="text-xs text-gray-400">Bot Panel</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        {session?.user && (
          <div className="p-4 border-b border-blue-800 mx-4 my-4 rounded-lg bg-blue-950/50">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={(session.user as any).image || "/default-avatar.png"}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate text-sm">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-400">
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

        {/* Settings */}
        <div className="p-4 border-t border-blue-800 mt-auto space-y-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-blue-950/50 transition-all"
            onClick={() => setOpen(false)}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configuración</span>
          </Link>

          <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-950/50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Overlay para móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
