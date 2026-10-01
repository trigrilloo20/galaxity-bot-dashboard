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
  Server,
  Sparkles,
} from "lucide-react";

/* ━━━ Starfield Background (Galaxity Style) ━━━ */
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

    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.02 + 0.005,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.8 ? "#a78bfa" : "#e2e8f0",
      });
    }

    function spawnShootingStar() {
      if (shootingStars.length < 3 && Math.random() < 0.01) {
        shootingStars.push({
          x: Math.random() * canvas.width * 0.8 + canvas.width * 0.2,
          y: Math.random() * canvas.height * 0.3,
          len: Math.random() * 100 + 50,
          speed: Math.random() * 5 + 4,
          opacity: 1,
          angle: (Math.PI / 4) + Math.random() * 0.3,
          life: 0,
          maxLife: Math.random() * 50 + 30,
        });
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar estrellas
      for (const star of stars) {
        star.opacity += star.twinkleSpeed;
        if (star.opacity >= 1 || star.opacity <= 0.1) star.twinkleSpeed *= -1;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.color === "#a78bfa" 
          ? `rgba(167, 139, 250, ${star.opacity * 0.9})`
          : `rgba(226, 232, 240, ${star.opacity * 0.8})`;
        ctx.fill();

        // Glow para estrellas púrpuras
        if (star.r > 1 && star.color === "#a78bfa") {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(124, 58, 237, ${star.opacity * 0.15})`;
          ctx.fill();
        }
      }

      spawnShootingStar();
      
      // Dibujar estrellas fugaces
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
        gradient.addColorStop(0.3, `rgba(167, 139, 250, ${ss.opacity * 0.8})`);
        gradient.addColorStop(1, `rgba(124, 58, 237, 0)`);

        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Cabeza de la estrella fugaz
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
        ctx.fill();
        
        // Glow púrpura
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${ss.opacity * 0.4})`;
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
          "linear-gradient(180deg, #050510 0%, #0a0a1a 40%, #0f0f2a 70%, #050510 100%)",
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

/* ━━━ Navbar Galaxity Style ━━━ */
function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="relative z-50 glass-strong">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30 animate-pulse-glow">
            G
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Galaxity
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-8">
          <a href="#tops" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium">
            Tops
          </a>
          <a href="#servidores" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium">
            Servidores
          </a>
          {session ? (
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login con Discord
            </Link>
          )}
        </div>

        <button
          className="sm:hidden text-white p-2 glass rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="sm:hidden glass-strong border-t border-purple-500/20 p-4"
        >
          <div className="flex flex-col gap-4">
            <a href="#tops" className="text-gray-300 hover:text-purple-400 font-medium py-2">
              Tops
            </a>
            <a href="#servidores" className="text-gray-300 hover:text-purple-400 font-medium py-2">
              Servidores
            </a>
            {session ? (
              <Link
                href="/dashboard"
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl text-center font-semibold"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl text-center font-semibold flex items-center justify-center gap-2"
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

/* ━━━ Hero Section Galaxity ━━━ */
function HeroSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm text-purple-300">
            <Sparkles className="w-4 h-4" />
            <span>Panel de Administración Next-Gen</span>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-300 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Galaxity
            </span>
            <br />
            <span className="text-white">Bot Panel</span>
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Panel de administración completo para tu bot de Discord. 
            <span className="text-purple-400 font-medium"> Economía</span>, 
            <span className="text-violet-400 font-medium"> tickets</span>, 
            <span className="text-indigo-400 font-medium"> comandos</span> personalizados y mucho más.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 flex items-center justify-center gap-3"
            >
              <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Comienza Ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#tops"
              className="group px-8 py-4 glass-strong hover:bg-white/10 text-white rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
            >
              Ver Tops
              <TrendingUp className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </AnimatedSection>

        {/* Stats preview */}
        <AnimatedSection delay={0.5}>
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">42+</p>
              <p className="text-sm text-gray-400 mt-1">Servidores</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">15K+</p>
              <p className="text-sm text-gray-400 mt-1">Usuarios</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">99.9%</p>
              <p className="text-sm text-gray-400 mt-1">Uptime</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ━━━ Tops Section Galaxity ━━━ */
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
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-purple-300 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              🏆 Tops de la Comunidad
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Los jugadores más destacados de nuestra galaxia
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-8">
          {/* Top Millonarios */}
          <AnimatedSection delay={0.1}>
            <div className="glass-strong rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Top Millonarios 💰
                </h3>
              </div>

              <div className="space-y-3">
                {millonarios.map((user, index) => (
                  <motion.div
                    key={user.rank}
                    whileHover={{ x: 8, scale: 1.02 }}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                      index === 0 ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20" : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                      index === 0 
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/30" 
                        : index === 1 
                        ? "bg-gradient-to-br from-gray-300 to-gray-400"
                        : index === 2 
                        ? "bg-gradient-to-br from-amber-600 to-amber-700"
                        : "bg-gradient-to-br from-purple-500/50 to-violet-500/50"
                    }`}>
                      #{user.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{user.username}</p>
                      <p className="text-sm text-gray-400">
                        ${user.balance.toLocaleString()}
                      </p>
                    </div>
                    {index === 0 && (
                      <span className="text-2xl">👑</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Top Donadores */}
          <AnimatedSection delay={0.2}>
            <div className="glass-strong rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Top Donadores 🎁
                </h3>
              </div>

              <div className="space-y-3">
                {donadores.map((user, index) => (
                  <motion.div
                    key={user.rank}
                    whileHover={{ x: 8, scale: 1.02 }}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                      index === 0 ? "bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20" : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                      index === 0 
                        ? "bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30" 
                        : index === 1 
                        ? "bg-gradient-to-br from-purple-400 to-violet-500"
                        : index === 2 
                        ? "bg-gradient-to-br from-indigo-500 to-blue-500"
                        : "bg-gradient-to-br from-purple-500/50 to-violet-500/50"
                    }`}>
                      #{user.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{user.username}</p>
                      <p className="text-sm text-gray-400">
                        ${user.donated.toLocaleString()} donados
                      </p>
                    </div>
                    {index === 0 && (
                      <span className="text-2xl">💜</span>
                    )}
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

/* ━━━ Servidores Section Galaxity ━━━ */
function ServidoresSection() {
  const [servidores] = useState([
    { id: 1, name: "Servidor Principal", members: 1250, icon: "🎮", status: "activo" },
    { id: 2, name: "Comunidad VIP", members: 850, icon: "⭐", status: "activo" },
    { id: 3, name: "Gaming Hub", members: 620, icon: "🎯", status: "activo" },
    { id: 4, name: "Staff Team", members: 400, icon: "💎", status: "activo" },
  ]);

  return (
    <section id="servidores" className="relative py-24 sm:py-32">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-purple-300 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              🖥️ Nuestros Servidores
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Administra todos tus servidores desde un solo lugar
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servidores.map((servidor, i) => (
            <AnimatedSection key={servidor.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -12, scale: 1.03 }}
                className="glass-strong rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-violet-600/0 group-hover:from-purple-600/10 group-hover:to-violet-600/10 transition-all duration-300" />
                
                <div className="relative">
                  <div className="text-5xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                    {servidor.icon}
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{servidor.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <Users className="w-4 h-4" />
                    {servidor.members} miembros
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                    <span className="text-xs text-green-400 font-medium">En línea</span>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ━━━ Footer Galaxity ━━━ */
function Footer() {
  return (
    <footer className="relative py-12 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="glass-strong rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              G
            </div>
            <span className="font-bold text-white text-lg bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Galaxity Bot Panel
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 Galaxity Network. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Panel de administración para Discord • Hecho con 💜
          </p>
        </div>
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
