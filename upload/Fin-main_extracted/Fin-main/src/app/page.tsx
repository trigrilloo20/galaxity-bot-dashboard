"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  TrendingUp,
  Zap,
  Users,
  Gift,
  ArrowRight,
  LogIn,
  Menu,
  X,
} from "lucide-react";

/* ━━━ Starfield Background (conservado) ━━━ */
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const stars: any[] = [];
    const shootingStars: any[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 250; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.02 + 0.005,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    function spawnShootingStar() {
      if (shootingStars.length < 2 && Math.random() < 0.008) {
        shootingStars.push({
          x: Math.random() * canvas.width * 0.8 + canvas.width * 0.2,
          y: Math.random() * canvas.height * 0.3,
          len: Math.random() * 80 + 40,
          speed: Math.random() * 4 + 3,
          opacity: 1,
          angle: (Math.PI / 4) + Math.random() * 0.3,
          life: 0,
          maxLife: Math.random() * 40 + 30,
        });
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        star.opacity += star.twinkleSpeed;
        if (star.opacity >= 1 || star.opacity <= 0.1) star.twinkleSpeed *= -1;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${star.opacity * 0.8})`;
        ctx.fill();

        if (star.r > 1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${star.opacity * 0.15})`;
          ctx.fill();
        }
      }

      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life++;
        ss.x -= Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity = 1 - (ss.life / ss.maxLife);

        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x + Math.cos(ss.angle) * ss.len;
        const tailY = ss.y - Math.sin(ss.angle) * ss.len;

        const gradient = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
        gradient.addColorStop(1, `rgba(59, 130, 246, 0)`);

        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background:
          "linear-gradient(180deg, #0f172a 0%, #0c1527 40%, #0a1436 70%, #0f172a 100%)",
      }}
    />
  );
}

/* ━━━ Animated Section ━━━ */
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ━━━ Navbar ━━━ */
function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="relative z-50 border-b border-blue-500/10 bg-blue-950/30 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            K
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Kimeoro
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          <a href="#tops" className="text-gray-300 hover:text-blue-400 transition">
            Tops
          </a>
          <a href="#servidores" className="text-gray-300 hover:text-blue-400 transition">
            Servidores
          </a>
          {session ? (
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-lg font-semibold transition-all"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login con Discord
            </Link>
          )}
        </div>

        <button
          className="sm:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div className="sm:hidden bg-blue-950/50 border-t border-blue-500/10 p-4">
          <div className="flex flex-col gap-3">
            <a href="#tops" className="text-gray-300 hover:text-blue-400">
              Tops
            </a>
            <a href="#servidores" className="text-gray-300 hover:text-blue-400">
              Servidores
            </a>
            {session ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-center"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-center flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

/* ━━━ Hero Section ━━━ */
function HeroSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <AnimatedSection>
          <h1 className="text-5xl sm:text-7xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              Kimeoro Bot
            </span>
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Panel de administración completo para tu bot de Discord. Economía,
            tickets, comandos personalizados y mucho más.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              Comienza Ahora
            </Link>
            <a
              href="#tops"
              className="px-8 py-4 border border-blue-500/50 hover:border-blue-400 text-blue-300 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
            >
              Ver Tops
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ━━━ Tops Section ━━━ */
function TopsSection() {
  const millonarios = [
    { rank: 1, username: "Usuario1", balance: 1000000 },
    { rank: 2, username: "Usuario2", balance: 850000 },
    { rank: 3, username: "Usuario3", balance: 720000 },
    { rank: 4, username: "Usuario4", balance: 650000 },
    { rank: 5, username: "Usuario5", balance: 500000 },
  ];

  const donadores = [
    { rank: 1, username: "Donador1", donated: 500000 },
    { rank: 2, username: "Donador2", donated: 350000 },
    { rank: 3, username: "Donador3", donated: 250000 },
    { rank: 4, username: "Donador4", donated: 180000 },
    { rank: 5, username: "Donador5", donated: 120000 },
  ];

  return (
    <section id="tops" className="relative py-24 sm:py-32">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              Tops
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Los jugadores más destacados de la comunidad
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-8">
          {/* Top Millonarios */}
          <AnimatedSection delay={0.1}>
            <div className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border border-blue-500/20 rounded-2xl p-8 backdrop-blur">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">
                  Top Millonarios 💰
                </h3>
              </div>

              <div className="space-y-3">
                {millonarios.map((user) => (
                  <motion.div
                    key={user.rank}
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-blue-900/20 hover:bg-blue-900/40 transition"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      #{user.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{user.username}</p>
                      <p className="text-sm text-gray-400">
                        ${user.balance.toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Top Donadores */}
          <AnimatedSection delay={0.2}>
            <div className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border border-blue-500/20 rounded-2xl p-8 backdrop-blur">
              <div className="flex items-center gap-2 mb-6">
                <Gift className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">
                  Top Donadores 🎁
                </h3>
              </div>

              <div className="space-y-3">
                {donadores.map((user) => (
                  <motion.div
                    key={user.rank}
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-blue-900/20 hover:bg-blue-900/40 transition"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      #{user.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{user.username}</p>
                      <p className="text-sm text-gray-400">
                        ${user.donated.toLocaleString()} donados
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ━━━ Servidores Section ━━━ */
function ServidoresSection() {
  const [servidores, setServidores] = useState([
    {
      id: 1,
      name: "Servidor 1",
      members: 1250,
      icon: "🎮",
      status: "activo",
    },
    {
      id: 2,
      name: "Servidor 2",
      members: 850,
      icon: "🎯",
      status: "activo",
    },
    {
      id: 3,
      name: "Servidor 3",
      members: 620,
      icon: "🚀",
      status: "activo",
    },
    {
      id: 4,
      name: "Servidor 4",
      members: 400,
      icon: "💎",
      status: "activo",
    },
  ]);

  return (
    <section id="servidores" className="relative py-24 sm:py-32">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              Servidores
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Administra todos tus servidores desde aquí
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servidores.map((servidor, i) => (
            <AnimatedSection key={servidor.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border border-blue-500/20 rounded-xl p-6 backdrop-blur hover:border-blue-400/40 transition-all cursor-pointer group"
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">
                  {servidor.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{servidor.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  {servidor.members} miembros
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-400">En línea</span>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ━━━ Footer ━━━ */
function Footer() {
  return (
    <footer className="relative py-12 border-t border-blue-500/10 mt-24">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center text-gray-400">
        <p>&copy; 2024 Kimeoro Bot. Todos los derechos reservados.</p>
        <p className="text-sm mt-2">Panel de administración para Discord</p>
      </div>
    </footer>
  );
}

/* ━━━ Main Page ━━━ */
export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <Starfield />
      <Navbar />
      <div className="relative z-10 flex-1">
        <HeroSection />
        <TopsSection />
        <ServidoresSection />
        <Footer />
      </div>
    </main>
  );
}
