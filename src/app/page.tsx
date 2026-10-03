"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Globe,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Users,
  Server,
  Heart,
  ChevronDown,
  Sparkles,
  Shield,
  HardDrive,
  ArrowRight,
  ExternalLink,
  Menu,
  X,
  HandCoins,
  TrendingUp,
  MessageCircle,
  Scale,
  Bot,
  Settings,
  Zap,
  BarChart3,
  Link2,
} from "lucide-react";
import Image from "next/image";

/* ─── deterministic pseudo-random (seeded) ─── */
function seededValues(count: number, seed = 42) {
  const vals: number[] = [];
  let s = seed;
  for (let i = 0; i < count; i++) {
    s = (s * 16807) % 2147483647;
    vals.push((s - 1) / 2147483646);
  }
  return vals;
}

/* ─── Starfield Background ─── */
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const stars: { x: number; y: number; r: number; speed: number; opacity: number; twinkleSpeed: number }[] = [];
    const shootingStars: { x: number; y: number; len: number; speed: number; opacity: number; angle: number; life: number; maxLife: number }[] = [];

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
        ctx.fillStyle = `rgba(200, 180, 255, ${star.opacity * 0.8})`;
        ctx.fill();

        if (star.r > 1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(124, 58, 237, ${star.opacity * 0.15})`;
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
        gradient.addColorStop(1, `rgba(124, 58, 237, 0)`);

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
      style={{ background: "linear-gradient(180deg, #050510 0%, #0a0a2e 40%, #0f0f3a 70%, #050510 100%)" }}
    />
  );
}

/* ─── Animated Section Wrapper ─── */
function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

/* ─── Floating Particles (SSR-safe with seeded values) ─── */
function FloatingParticles() {
  const particles = useMemo(() => {
    const rands = seededValues(80, 7);
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: rands[i * 4] * 100,
      y: rands[i * 4 + 1] * 100,
      size: rands[i * 4 + 2] * 4 + 2,
      opacity: rands[i * 4 + 3] * 0.3 + 0.1,
      duration: rands[i * 4 + 2] * 10 + 10,
      delay: rands[i * 4 + 3] * 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(124, 58, 237, ${p.opacity})`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Inicio", href: "#hero" },
    { label: "Features", href: "#features" },
    { label: "Dashboard", href: "#dashboard" },
    { label: "Servidores", href: "#servers" },
  ];

  const externalLinks = [
    {
      label: "Discord",
      href: "https://discord.com/developers/applications",
      icon: <MessageCircle className="w-4 h-4" />,
      className: "text-gray-300 hover:text-indigo-400",
    },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong shadow-lg shadow-purple-900/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Image
              src="/galaxity-logo.png"
              alt="Galaxity Bot Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Galaxity Bot
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 text-sm rounded-lg hover:bg-white/5 transition-all duration-300 flex items-center gap-2 ${link.className}`}
              >
                {link.icon}
                {link.label}
              </a>
            ))}
            <a
              href="/api/auth/discord"
              className="ml-2 px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-900/30"
            >
              <Bot className="w-4 h-4" />
              Conectar Bot
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden glass-strong rounded-xl mb-4"
            >
              <div className="p-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                  >
                    {link.label}
                  </a>
                ))}
                {externalLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-lg hover:bg-white/5 transition-all flex items-center gap-2 ${link.className}`}
                  >
                    {link.icon}
                    {link.label}
                  </a>
                ))}
                <a
                  href="/api/auth/discord"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-center flex items-center justify-center gap-2"
                >
                  <Bot className="w-4 h-4" />
                  Conectar Bot
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  const [serverCount, setServerCount] = useState(0);
  const targetCount = 150;

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 3;
      setCount(current > targetCount ? targetCount : current);
      if (current >= targetCount) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= targetCount / 3) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <FloatingParticles />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-800/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="mb-8 inline-block"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-xl scale-110" />
            <Image
              src="/galaxity-logo.png"
              alt="Galaxity Bot"
              width={120}
              height={120}
              className="relative rounded-2xl animate-pulse-glow"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl sm:text-7xl md:text-8xl font-extrabold mb-6"
        >
          <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
            Galaxity Bot
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xl sm:text-2xl text-gray-300 mb-4 font-medium"
        >
          Dashboard de Discord Bot
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-gray-400 mb-8"
        >
          <Bot className="w-4 h-4 text-purple-400" />
          <span>Compatible con</span>
          <span className="text-purple-400 font-semibold">Discord API</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="glass rounded-2xl p-6 sm:p-8 inline-block mb-10 max-w-lg mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Zap className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-cyan-400">Panel de Control Total</h3>
          </div>
          <p className="text-gray-300 text-sm sm:text-base">
            Gestiona tu bot de Discord desde una interfaz intuitiva.
            <br />
            <span className="text-cyan-300 font-semibold">
              Más de {count} servidores ya conectados.
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/api/auth/discord"
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-lg transition-all duration-300 shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 flex items-center gap-3"
          >
            <Bot className="w-5 h-5" />
            Conectar con Discord
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#features"
            className="px-8 py-4 rounded-xl glass hover:bg-white/10 text-white font-bold text-lg transition-all duration-300 flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            Ver Features
          </a>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-16"
        >
          <ChevronDown className="w-8 h-8 text-purple-400/60 mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Features Section ─── */
function FeaturesSection() {
  const features = [
    {
      title: "Gestión de Servidores",
      description: "Administra todos tus servidores de Discord desde un solo lugar. Configura canales, roles y permisos de forma centralizada.",
      icon: <Server className="w-5 h-5" />,
      color: "from-purple-600 to-indigo-600",
    },
    {
      title: "Moderación Automática",
      description: "Sistema de moderación inteligente con filtros anti-spam, protección contra raids y advertencias automáticas.",
      icon: <Shield className="w-5 h-5" />,
      color: "from-cyan-600 to-blue-600",
    },
    {
      title: "Estadísticas en Tiempo Real",
      description: "Monitoreo completo de actividad del servidor, mensajes, usuarios activos y crecimiento con gráficos detallados.",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "from-pink-600 to-rose-600",
    },
    {
      title: "Sistema de Niveles",
      description: "Recompensa la actividad de tu comunidad con un sistema de XP, rangos y recompensas personalizables.",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-amber-600 to-orange-600",
    },
    {
      title: "AutoMod Avanzado",
      description: "Configura reglas automáticas para contenido, enlaces, palabras clave y comportamiento de los miembros.",
      icon: <Settings className="w-5 h-5" />,
      color: "from-green-600 to-emerald-600",
    },
    {
      title: "Integración Webhooks",
      description: "Conecta con servicios externos mediante webhooks personalizados para notificaciones y automatizaciones.",
      icon: <Link2 className="w-5 h-5" />,
      color: "from-violet-600 to-purple-600",
    },
  ];

  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Características del Bot
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Todo lo que necesitas para gestionar tu comunidad de Discord de forma profesional y eficiente.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass rounded-2xl p-6 h-full hover:border-purple-500/40 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Dashboard Preview Section ─── */
function DashboardSection() {
  const stats = [
    { label: "Servidores Conectados", value: "150+", icon: <Server className="w-5 h-5" />, change: "+12%" },
    { label: "Usuarios Activos", value: "25K+", icon: <Users className="w-5 h-5" />, change: "+8%" },
    { label: "Comandos Procesados", value: "1M+", icon: <Zap className="w-5 h-5" />, change: "+23%" },
    { label: "Uptime del Bot", value: "99.9%", icon: <Shield className="w-5 h-5" />, change: "Estable" },
  ];

  return (
    <section id="dashboard" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-6">
            <BarChart3 className="w-4 h-4" />
            Panel de Control
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Dashboard en Tiempo Real
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Monitorea y controla todas las operaciones de tu bot desde un dashboard intuitivo y potente.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass rounded-2xl p-8 sm:p-10 mb-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                  <div className="text-xs text-green-400 mt-1">{stat.change}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Configuración Rápida</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Accede a todas las configuraciones del bot desde un panel centralizado. Modifica prefijos, permisos, canales y más.
              </p>
              <div className="space-y-3">
                {["Prefijo personalizable", "Roles automáticos", "Bienvenida personalizada", "Logs de auditoría"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-600/20 flex items-center justify-center text-cyan-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Herramientas de Moderación</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Conjunto completo de herramientas para mantener tu servidor seguro y ordenado las 24 horas del día.
              </p>
              <div className="space-y-3">
                {["Sistema de warns/bans", "Filtro de contenido", "Protección anti-raid", "Mod logs detallados"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Horizontal Scrolling Server List ─── */
function ServerListSection() {
  const servers = [
    { name: "Galaxity Community", members: "12.5K", icon: "🌟", status: "online" },
    { name: "Gaming Hub", members: "8.3K", icon: "🎮", status: "online" },
    { name: "Dev Zone", members: "5.2K", icon: "💻", status: "online" },
    { name: "Music Lounge", members: "4.7K", icon: "🎵", status: "idle" },
    { name: "Art Gallery", members: "3.1K", icon: "🎨", status: "online" },
    { name: "Crypto Talk", members: "6.8K", icon: "💰", status: "dnd" },
    { name: "Study Group", members: "2.9K", icon: "📚", status: "online" },
    { name: "Sports Central", members: "4.2K", icon: "⚽", status: "idle" },
    { name: "Movie Night", members: "3.5K", icon: "🎬", status: "online" },
    { name: "Tech News", members: "7.1K", icon: "📰", status: "online" },
    { name: "Music Production", members: "2.4K", icon: "🎹", status: "dnd" },
    { name: "Photography", members: "1.8K", icon: "📸", status: "online" },
  ];

  return (
    <section id="servers" className="relative py-16 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Servidores Conectados
            </span>
          </h2>
          <p className="text-gray-400 text-base">
            Desliza para ver todos los servidores que usan Galaxity Bot →→→
          </p>
        </AnimatedSection>
      </div>

      {/* Horizontal Scrolling Container */}
      <div className="relative z-10">
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-600/40 scrollbar-track-transparent">
          <div className="flex gap-4 px-4 sm:px-6 min-w-max" style={{ maxWidth: "100vw" }}>
            {servers.map((server, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="glass rounded-xl p-4 min-w-[220px] hover:border-purple-500/40 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-cyan-600/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {server.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{server.name}</h4>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${
                        server.status === "online" ? "bg-green-400" :
                        server.status === "idle" ? "bg-yellow-400" : "bg-red-400"
                      }`} />
                      <span className="text-xs text-gray-400">{server.members} miembros</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-400 font-medium">Conectado</span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                </div>
              </motion.div>
            ))}
            
            {/* Scroll indicator arrow */}
            <div className="flex items-center justify-center min-w-[100px]">
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-2 text-purple-400/60"
              >
                <span className="text-sm">Más</span>
                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-[#050510] to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-[#050510] to-transparent pointer-events-none z-20" />
      </div>
    </section>
  );
}

/* ─── Discord API Integration Info ─── */
function DiscordIntegrationSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-6">
            <Link2 className="w-4 h-4" />
            Integración con Discord
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Cómo Conectar Tu Bot
            </span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-3xl mx-auto">
            Galaxity Bot utiliza la API oficial de Discord para conectarse con tus servidores.
            Sigue estos pasos simples para comenzar a usar el dashboard.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {[
              {
                step: "01",
                icon: <Bot className="w-6 h-6" />,
                title: "Crea tu Bot en Discord",
                description: "Ve a Discord Developer Portal, crea una aplicación y obtén tu token del bot. Guarda el token de forma segura.",
                color: "from-indigo-600 to-purple-600",
              },
              {
                step: "02",
                icon: <Settings className="w-6 h-6" />,
                title: "Configura los Permisos",
                description: "Activa los intents necesarios (Server Members, Message Content) y configura los permisos OAuth2 para tu bot.",
                color: "from-purple-600 to-pink-600",
              },
              {
                step: "03",
                icon: <Zap className="w-6 h-6" />,
                title: "Invita y Configura",
                description: "Usa la URL de invitación generada para añadir el bot a tu servidor. Luego configura desde este dashboard.",
                color: "from-cyan-600 to-blue-600",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass rounded-2xl p-6 text-left hover:border-purple-500/40 transition-all duration-300 group relative"
              >
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-bold">
                  {item.step}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 mt-2`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="glass rounded-2xl p-8 sm:p-10 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Variables de Entorno Necesarias</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Para conectar el bot con Discord, necesitas configurar estas variables en tu archivo <code className="px-2 py-1 rounded bg-purple-900/30 text-purple-300 text-sm">.env</code>:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                { label: "DISCORD_BOT_TOKEN", desc: "Token de tu bot de Discord", icon: <Bot className="w-4 h-4 text-purple-400" /> },
                { label: "DISCORD_CLIENT_ID", desc: "ID de la aplicación del bot", icon: <Settings className="w-4 h-4 text-purple-400" /> },
                { label: "DISCORD_CLIENT_SECRET", desc: "Secret de la aplicación OAuth2", icon: <Shield className="w-4 h-4 text-purple-400" /> },
                { label: "DISCORD_REDIRECT_URI", desc: "URL de redirección para auth", icon: <Link2 className="w-4 h-4 text-purple-400" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg hover:bg-white/5 transition-colors">
                  {item.icon}
                  <div>
                    <code className="text-sm text-cyan-400 font-mono">{item.label}</code>
                    <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://discord.com/developers/applications"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg transition-all duration-300 shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 flex items-center gap-3"
            >
              <ExternalLink className="w-5 h-5" />
              Discord Developer Portal
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#servers"
              className="px-8 py-4 rounded-xl glass hover:bg-white/10 text-white font-bold text-lg transition-all duration-300 flex items-center gap-3"
            >
              <Server className="w-5 h-5 text-purple-400" />
              Ver Servidores
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="relative py-16 border-t border-purple-900/20">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/galaxity-logo.png"
                alt="Galaxity Bot"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Galaxity Bot
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Dashboard profesional para bots de Discord. Compatible con la API oficial de Discord, 
              con herramientas de moderación, estadísticas y gestión de servidores.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Enlaces Rápidos</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://discord.com/developers/docs/intro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-400 transition-colors text-sm flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Documentación Discord API
              </a>
              <a
                href="#features"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Features
              </a>
              <a
                href="#servers"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2"
              >
                <Server className="w-4 h-4" />
                Servidores
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Información Técnica</h4>
            <div className="flex flex-col gap-3 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Discord.js v14+</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-purple-400" />
                <span>MySQL Database</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>OAuth2 Secure Auth</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-900/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            &copy; 2026 Galaxity Bot. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Discord
            </a>
            <a
              href="/api/auth/discord"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              Conectar Bot
            </a>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="mt-8 pt-6 border-t border-purple-900/10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-600 text-xs text-center">
            <div className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              <span>Este proyecto no está afiliado con Discord Inc. Discord es una marca registrada.</span>
            </div>
            <span className="hidden sm:inline">|</span>
            <span>Utiliza la API oficial de Discord de acuerdo con sus términos de servicio.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Page ─── */
export default function GalaxityBotPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <Starfield />
      <Navbar />
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <DashboardSection />
        <ServerListSection />
        <DiscordIntegrationSection />
        <Footer />
      </div>
    </main>
  );
}
