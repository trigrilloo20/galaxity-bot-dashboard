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
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin" />
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
    },
    {
      title: "Mi Balance",
      value: "$1,250",
      icon: <ShoppingBag className="w-6 h-6" />,
      href: "/dashboard/economia",
    },
    {
      title: "Tickets Abiertos",
      value: "2",
      icon: <Users className="w-6 h-6" />,
      href: "/dashboard/tickets",
    },
    {
      title: "Mis Comandos",
      value: "12",
      icon: <Zap className="w-6 h-6" />,
      href: "/dashboard/comandos",
    },
  ];

  return (
    <main className="md:ml-64 p-4 sm:p-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          ¡Bienvenido, {user?.name}!
        </h1>
        <p className="text-gray-400">
          Panel de administración de Kimeoro Bot
        </p>
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
            className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border border-blue-500/20 rounded-xl p-6 backdrop-blur hover:border-blue-400/40 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-600/20 rounded-lg text-blue-400 group-hover:bg-blue-600/40 transition">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.a>
        ))}
      </div>

      {/* Admin Stats */}
      {isAdmin && (
        <>
          <h2 className="text-2xl font-bold text-white mb-6">
            📊 Estadísticas del Admin
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.a
              href="/dashboard/admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border border-purple-500/20 rounded-xl p-6 backdrop-blur hover:border-purple-400/40 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-600/20 rounded-lg text-purple-400 group-hover:bg-purple-600/40 transition">
                  <Zap className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Uso de IA</h3>
              <p className="text-3xl font-bold text-white">2.5K</p>
              <p className="text-xs text-gray-500 mt-2">+15% este mes</p>
            </motion.a>

            <motion.a
              href="/dashboard/admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-gradient-to-br from-pink-950/40 to-pink-900/20 border border-pink-500/20 rounded-xl p-6 backdrop-blur hover:border-pink-400/40 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-pink-600/20 rounded-lg text-pink-400 group-hover:bg-pink-600/40 transition">
                  <Music className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Reproducción Música</h3>
              <p className="text-3xl font-bold text-white">8.3K</p>
              <p className="text-xs text-gray-500 mt-2">+32% este mes</p>
            </motion.a>

            <motion.a
              href="/dashboard/admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-gradient-to-br from-green-950/40 to-green-900/20 border border-green-500/20 rounded-xl p-6 backdrop-blur hover:border-green-400/40 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-600/20 rounded-lg text-green-400 group-hover:bg-green-600/40 transition">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Economía</h3>
              <p className="text-3xl font-bold text-white">15.7K</p>
              <p className="text-xs text-gray-500 mt-2">+45% este mes</p>
            </motion.a>

            <motion.a
              href="/dashboard/admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border border-cyan-500/20 rounded-xl p-6 backdrop-blur hover:border-cyan-400/40 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-cyan-600/20 rounded-lg text-cyan-400 group-hover:bg-cyan-600/40 transition">
                  <Server className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Servidores</h3>
              <p className="text-3xl font-bold text-white">42</p>
              <p className="text-xs text-gray-500 mt-2">+8 nuevos</p>
            </motion.a>
          </div>
        </>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border border-blue-500/20 rounded-xl p-8 backdrop-blur"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Acciones Rápidas</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="/dashboard/tickets/crear"
            className="flex items-center gap-3 p-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
          >
            <Users className="w-5 h-5" />
            <span className="font-semibold">Crear Ticket</span>
          </a>
          <a
            href="/dashboard/comandos/crear"
            className="flex items-center gap-3 p-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
          >
            <Zap className="w-5 h-5" />
            <span className="font-semibold">Nuevo Comando</span>
          </a>
        </div>
      </motion.div>
    </main>
  );
}
