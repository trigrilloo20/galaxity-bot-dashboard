"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Zap,
  Music,
  ShoppingBag,
  Users,
  Server,
  TrendingUp,
  Bot,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050510]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-900 border-t-purple-500 rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-violet-500/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user as any;
  const isAdmin = user?.role === "DEVELOPER";

  const stats = [
    {
      title: "Mis Servidores",
      value: "5",
      icon: <Server className="w-6 h-6" />,
      href: "/dashboard/servidores",
      gradient: "from-purple-600 to-violet-600",
      shadowColor: "purple",
    },
    {
      title: "Mi Balance",
      value: "$1,250",
      icon: <ShoppingBag className="w-6 h-6" />,
      href: "/dashboard/economia",
      gradient: "from-emerald-500 to-green-600",
      shadowColor: "emerald",
    },
    {
      title: "Tickets Abiertos",
      value: "2",
      icon: <Users className="w-6 h-6" />,
      href: "/dashboard/tickets",
      gradient: "from-blue-500 to-cyan-500",
      shadowColor: "blue",
    },
    {
      title: "Mis Comandos",
      value: "12",
      icon: <Zap className="w-6 h-6" />,
      href: "/dashboard/comandos",
      gradient: "from-amber-500 to-orange-500",
      shadowColor: "amber",
    },
  ];

  const adminStats = [
    {
      title: "Uso de IA",
      value: "2.5K",
      change: "+15% este mes",
      icon: <Zap className="w-6 h-6" />,
      gradient: "from-purple-600 to-violet-600",
    },
    {
      title: "Reproducción Música",
      value: "8.3K",
      change: "+32% este mes",
      icon: <Music className="w-6 h-6" />,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "Economía",
      value: "15.7K",
      change: "+45% este mes",
      icon: <ShoppingBag className="w-6 h-6" />,
      gradient: "from-emerald-500 to-green-600",
    },
    {
      title: "Servidores",
      value: "42",
      change: "+8 nuevos",
      icon: <Server className="w-6 h-6" />,
      gradient: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <main className="md:ml-72 p-4 sm:p-8 min-h-screen">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="glass-strong rounded-2xl p-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/15 rounded-full blur-[60px]" />
          
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.image || "/default-avatar.png"}
                alt="Avatar"
                className="w-20 h-20 rounded-2xl ring-4 ring-purple-500/30"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-lg border-4 border-[#0f0f2a] flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                ¡Bienvenido, <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">{user?.name}</span>!
              </h1>
              <p className="text-gray-400 text-lg">Panel de administración de Galaxity Bot</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isAdmin 
                    ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white" 
                    : "bg-white/10 text-gray-300"
                }`}>
                  {(user?.role || "USUARIO").toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.a
            key={i}
            href={stat.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-strong rounded-2xl p-6 cursor-pointer group relative overflow-hidden transition-all duration-300"
          >
            {/* Hover glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            <div className="relative">
              <div className={`flex items-start justify-between mb-4`}>
                <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl text-white shadow-lg shadow-${stat.shadowColor}/25 group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <Bot className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="text-gray-400 text-sm mb-1 font-medium">{stat.title}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Admin Stats */}
      {isAdmin && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">📊 Estadísticas del Admin</h2>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {adminStats.map((stat, i) => (
              <motion.a
                key={i}
                href="/dashboard/admin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-strong rounded-2xl p-6 cursor-pointer group relative overflow-hidden transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm mb-1 font-medium">{stat.title}</h3>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-green-400 mt-2 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass-strong rounded-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-[60px]" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Acciones Rápidas</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="/dashboard/tickets/crear"
              className="group flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02]"
            >
              <div className="p-3 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-lg block">Crear Ticket</span>
                <span className="text-sm text-white/70">Abre un nuevo ticket de soporte</span>
              </div>
            </a>
            
            <a
              href="/dashboard/comandos/crear"
              className="group flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02]"
            >
              <div className="p-3 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-lg block">Nuevo Comando</span>
                <span className="text-sm text-white/70">Crea un comando personalizado</span>
              </div>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Bottom spacing for sidebar */}
      <div className="h-8" />
    </main>
  );
}
