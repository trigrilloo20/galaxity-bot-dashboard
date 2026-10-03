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
    { label: "Historia", href: "#lore" },
    { label: "Aviso", href: "#closure" },
    { label: "Founders", href: "#owners" },
  ];

  const externalLinks = [
    {
      label: "Discord",
      href: "https://discord.galaxity.lol",
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
              alt="Galaxity Network Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Galaxity Network
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
              href="https://galaxity.tebex.io"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-900/30"
            >
              <ShoppingBag className="w-4 h-4" />
              Tienda
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
                  href="https://galaxity.tebex.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-center flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Tienda
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
  const [count, setCount] = useState(0);
  const targetCount = 11;

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= targetCount) clearInterval(interval);
    }, 150);
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
              alt="Galaxity Network"
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
            Galaxity Network
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xl sm:text-2xl text-gray-300 mb-4 font-medium"
        >
          Servidor de Minecraft
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-gray-400 mb-8"
        >
          <Server className="w-4 h-4 text-purple-400" />
          <span>Alojado en</span>
          <span className="text-purple-400 font-semibold">GalaxityHosting</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="glass rounded-2xl p-6 sm:p-8 inline-block mb-10 max-w-lg mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-amber-400">Aviso Importante</h3>
          </div>
          <p className="text-gray-300 text-sm sm:text-base">
            Este servidor podr&iacute;a cerrar temporalmente en los pr&oacute;ximos d&iacute;as o meses.
            <br />
            <span className="text-amber-300 font-semibold">
              Esta ser&iacute;a la vez n&uacute;mero {count} que cerramos.
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
            href="https://galaxity.tebex.io"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-lg transition-all duration-300 shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 flex items-center gap-3"
          >
            <ShoppingBag className="w-5 h-5" />
            Visitar Tienda
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#lore"
            className="px-8 py-4 rounded-xl glass hover:bg-white/10 text-white font-bold text-lg transition-all duration-300 flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            Nuestra Historia
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

/* ─── Lore Section ─── */
function LoreSection() {
  const timelineEvents = [
    {
      year: "2019",
      title: "El Comienzo",
      description: "Galaxity Network nació como dinos.aternos.me, un pequeño servidor de Aternos creado por Trgrilloo10 y ShockedRobin. Lo que empezó como un proyecto entre amigos pronto se convirtió en una comunidad de jugadores que disfrutaban juntos de Minecraft.",
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      year: "2019-2022",
      title: "Crecimiento y Comunidad",
      description: "Poco a poco el servidor fue creciendo. De ser un servidor pequeño en Aternos, la comunidad fue aumentando hasta alcanzar cientos de usuarios conectados diariamente. Era la época dorada de Galaxity Network, donde siempre había alguien en línea y la actividad no paraba.",
      icon: <Users className="w-5 h-5" />,
    },
    {
      year: "2022-2024",
      title: "Los Cierres y Regresos",
      description: "Por diferentes motivos —falta de tiempo, costos, problemas técnicos— el servidor tuvo que cerrar varias veces. Pero cada vez, Trgrilloo10 y ShockedRobin lo volvían a levantar. Hasta ahora, el servidor ha cerrado y reabierto aproximadamente 10 veces. Esta sería la vez número 11 si no logramos sostenerlo.",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    {
      year: "2024-2026",
      title: "GalaxityHosting y la Infraestructura Actual",
      description: "El servidor migró a GalaxityHosting con almacenamiento NVMe de alto rendimiento. Actualmente utiliza casi medio TB (~500 GB) de espacio. La máquina es potente, pero el costo mensual es elevado y sin suficiente apoyo de la comunidad, mantenerla es cada vez más difícil.",
      icon: <HardDrive className="w-5 h-5" />,
    },
    {
      year: "Ahora",
      title: "Galaxity Network Hoy",
      description: "La actividad diaria bajó considerablemente. De cientos de usuarios diarios pasamos a unos pocos. Los founders siguen apostando por el proyecto, pero la realidad es que sin apoyo —ya sea de la comunidad o de inversionistas— el servidor podría cerrar temporalmente en cualquier momento.",
      icon: <Server className="w-5 h-5" />,
    },
  ];

  return (
    <section id="lore" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Nuestra Historia
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Desde dinos.aternos.me en 2019 hasta Galaxity Network hoy. Un proyecto que ha resistido cierre tras cierre, siempre con la esperanza de volver.
          </p>
        </AnimatedSection>

        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 via-cyan-600 to-purple-600 transform sm:-translate-x-1/2" />

          {timelineEvents.map((event, i) => (
            <AnimatedSection key={i} delay={i * 0.12} className={`relative flex items-center mb-12 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
              <div className="absolute left-4 sm:left-1/2 w-4 h-4 bg-purple-500 rounded-full border-2 border-purple-300 transform -translate-x-1/2 z-10 shadow-lg shadow-purple-500/50" />

              <div className={`ml-12 sm:ml-0 sm:w-1/2 ${i % 2 === 0 ? "sm:pr-16" : "sm:pl-16"}`}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="glass rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400">
                      {event.icon}
                    </div>
                    <span className="text-sm font-bold text-purple-400 tracking-wider">{event.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{event.description}</p>
                </motion.div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Closure Notice Section ─── */
function ClosureSection() {
  const reasons = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Falta de Tiempo",
      description: "Trgrilloo10 y ShockedRobin han enfrentado una creciente falta de tiempo para dedicarle al servidor. Las responsabilidades personales hacen cada vez más difícil mantener el nivel de atención que Galaxity Network merece.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Falta de Apoyo",
      description: "Antes, Galaxity Network contaba con cientos de usuarios diarios. Actualmente, solo unos pocos se conectan al día. Sin una comunidad activa, se pierde la motivación y la viabilidad económica para sostener los costos del servidor.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <HardDrive className="w-6 h-6" />,
      title: "Precios Elevados",
      description: "El servidor usa casi medio TB (~500 GB) de almacenamiento NVMe en GalaxityHosting. El costo de la máquina es alto y sin los ingresos suficientes de la tienda o donaciones, pagar el servidor cada mes se vuelve insostenible.",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <section id="closure" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/10 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold mb-6">
            <AlertTriangle className="w-4 h-4" />
            Aviso de Posible Cierre
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-red-400 via-amber-400 to-red-400 bg-clip-text text-transparent">
              Por Qu&eacute; Podr&iacute;amos Cerrar
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Galaxity Network enfrenta serios desaf&iacute;os. Si no logramos recaudar los fondos necesarios, el servidor cerrar&aacute; temporalmente y esta ser&iacute;a la vez n&uacute;mero 11.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {reasons.map((reason, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass rounded-2xl p-6 h-full hover:border-red-500/30 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${reason.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {reason.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{reason.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{reason.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="glass rounded-2xl p-8 sm:p-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Almacenamiento NVMe", value: "~500 GB", icon: <HardDrive className="w-5 h-5" /> },
                { label: "Veces Cerrado", value: "10", icon: <AlertTriangle className="w-5 h-5" /> },
                { label: "Desde", value: "2019", icon: <Clock className="w-5 h-5" /> },
                { label: "Retorno Estimado", value: "1-4 meses", icon: <Sparkles className="w-5 h-5" /> },
              ].map((stat, i) => (
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
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Investors Section ─── */
function InvestorsSection() {
  return (
    <section id="investors" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-6">
            <HandCoins className="w-4 h-4" />
            Buscamos Apoyo
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
              &iquest;Quieres Ayudar?
            </span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-3xl mx-auto">
            Galaxity Network busca inversionistas o personas que quieran ayudar a continuar este proyecto.
            Llevamos desde 2019 manteniendo este servidor vivo, y aunque hemos cerrado y reabierto muchas veces,
            siempre hemos vuelto. Con tu apoyo podemos mantener el servidor en l&iacute;nea, mejorar la infraestructura
            y seguir creciendo como comunidad.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: <HandCoins className="w-6 h-6" />,
                title: "Inversionistas",
                description: "Si quieres invertir en Galaxity Network y ser parte del proyecto, contáctanos. Buscamos personas que crean en el potencial de esta comunidad y quieran ayudarnos a crecer de forma sostenible.",
                color: "from-purple-600 to-indigo-600",
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: "Donaciones",
                description: "Cualquier aportación ayuda a cubrir los costos mensuales del servidor. Puedes apoyarnos a través de nuestra tienda en Tebex, donde también recibes recompensas dentro del servidor.",
                color: "from-pink-500 to-rose-500",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Comunidad Activa",
                description: "Simplemente jugando y siendo parte activa de la comunidad ya nos ayudas mucho. Un servidor con jugadores activos atrae a más jugadores y hace que todo sea más sostenible para todos.",
                color: "from-cyan-500 to-blue-500",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass rounded-2xl p-6 text-left hover:border-purple-500/40 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
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
            <h3 className="text-2xl font-bold text-white mb-4">Lo que ofrecemos a inversionistas</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Si decides invertir en Galaxity Network, no solo estás apoyando un servidor de Minecraft.
              Estás respaldando un proyecto con más de 5 años de historia, una base de jugadores que
              aunque reducida ahora, demostró en el pasado que puede alcanzar cientos de usuarios diarios.
              Con la inversión adecuada, podemos optimizar el servidor, mejorar la experiencia de juego
              y atraer de nuevo a la comunidad que alguna vez tuvo Galaxity Network.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                { label: "Proyecto activo desde 2019", icon: <Clock className="w-4 h-4 text-purple-400" /> },
                { label: "Infraestructura NVMe de alto rendimiento", icon: <Server className="w-4 h-4 text-purple-400" /> },
                { label: "Historial de comunidad con cientos de jugadores", icon: <Users className="w-4 h-4 text-purple-400" /> },
                { label: "Founders comprometidos con el proyecto", icon: <Heart className="w-4 h-4 text-purple-400" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                  {item.icon}
                  <span className="text-gray-300 text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://galaxity.tebex.io"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-lg transition-all duration-300 shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 flex items-center gap-3"
            >
              <ShoppingBag className="w-5 h-5" />
              Apoyar en la Tienda
              <ExternalLink className="w-5 h-5" />
            </a>
            <a
              href="#owners"
              className="px-8 py-4 rounded-xl glass hover:bg-white/10 text-white font-bold text-lg transition-all duration-300 flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
              Conoce a los Founders
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Return Hope Section ─── */
function ReturnSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            No Todo Est&aacute; Perdido
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Posible Regreso
            </span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
            Si Galaxity Network cierra de forma temporal, no es el final. Planeamos regresar aproximadamente
            despu&eacute;s de <span className="text-cyan-400 font-bold">1 a 4 meses</span> con mejoras significativas.
            Durante ese tiempo, todos los datos del servidor ser&aacute;n guardados de forma segura en un servidor local
            mantenido por <span className="text-purple-400 font-bold">Trgrilloo10</span>, asegurando que ning&uacute;n
            progreso se pierda.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="glass rounded-2xl p-8 sm:p-10 mb-10">
            <h3 className="text-2xl font-bold text-white mb-6">Lo que haremos durante el cierre temporal:</h3>
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              {[
                { icon: <Shield className="w-5 h-5" />, title: "Respaldo Completo", desc: "Todos los datos del servidor serán guardados en un servidor local seguro de Trgrilloo10" },
                { icon: <Sparkles className="w-5 h-5" />, title: "Corrección de Bugs", desc: "Arreglaremos múltiples bugs y problemas técnicos que afectan la experiencia de juego" },
                { icon: <Server className="w-5 h-5" />, title: "Optimización", desc: "Mejoraremos el rendimiento del servidor para una experiencia más fluida" },
                { icon: <Heart className="w-5 h-5" />, title: "Reestructuración", desc: "Rediseñaremos aspectos del servidor para hacerlo más atractivo y sostenible" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  className="flex gap-4 items-start p-4 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <a
            href="https://galaxity.tebex.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-lg transition-all duration-300 shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 hover:scale-105"
          >
            <Heart className="w-5 h-5" />
            Apoya a Galaxity Network
            <ExternalLink className="w-5 h-5" />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Founders Section ─── */
function FoundersSection() {
  const founders = [
    {
      name: "Trgrilloo10",
      role: "Founder",
      description: "Co-fundador de Galaxity Network desde 2019. Encargado de la infraestructura técnica y el resguardo de datos en su servidor local en caso de cierre temporal. Ha sido el motor principal para mantener el proyecto vivo a lo largo de todos estos años y cierres.",
      color: "from-purple-600 to-indigo-600",
    },
    {
      name: "ShockedRobin516",
      role: "Founder",
      description: "Co-fundador de Galaxity Network. Parte fundamental del proyecto desde sus inicios como dinos.aternos.me. Junto con Trgrilloo10, ha mantenido la visión y el compromiso con la comunidad a través de cada cierre y reapertura del servidor.",
      color: "from-cyan-600 to-blue-600",
    },
  ];

  return (
    <section id="owners" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Founders
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Las personas detr&aacute;s de Galaxity Network que han mantenido este proyecto vivo desde 2019, a trav&eacute;s de cada cierre y cada regreso.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-8">
          {founders.map((founder, i) => (
            <AnimatedSection key={i} delay={i * 0.2}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass rounded-2xl p-8 text-center hover:border-purple-500/40 transition-all duration-300 group"
              >
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${founder.color} flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {founder.name[0]}
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{founder.name}</h3>
                <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
                  {founder.role}
                </span>
                <p className="text-gray-400 text-sm leading-relaxed">{founder.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
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
                alt="Galaxity Network"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Galaxity Network
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Servidor de Minecraft desde 2019. Alojado en GalaxityHosting con dedicaci&oacute;n y pasi&oacute;n por la comunidad. Fundado por Trgrilloo10 y ShockedRobin516.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Enlaces</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://discord.galaxity.lol"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-400 transition-colors text-sm flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Discord
              </a>
              <a
                href="https://galaxity.tebex.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Tienda (Tebex)
              </a>
              <a
                href="https://info.galaxity.lol"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Sitio Web Oficial
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Informaci&oacute;n</h4>
            <div className="flex flex-col gap-3 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-400" />
                <span>Alojado en GalaxityHosting</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-purple-400" />
                <span>~500 GB NVMe</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Desde 2019</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-900/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            &copy; 2019 - 2026 Galaxity Network. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://discord.galaxity.lol"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Discord
            </a>
            <a
              href="https://galaxity.tebex.io"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Tienda
            </a>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="mt-8 pt-6 border-t border-purple-900/10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-600 text-xs text-center">
            <div className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              <span>Este servidor no est&aacute; a la venta. Todos los derechos reservados para Galaxity Network.</span>
            </div>
            <span className="hidden sm:inline">|</span>
            <span>Esta web no est&aacute; afiliada ni asociada con Mojang.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Page ─── */
export default function GalaxityNetworkPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <Starfield />
      <Navbar />
      <div className="relative z-10">
        <HeroSection />
        <LoreSection />
        <ClosureSection />
        <InvestorsSection />
        <ReturnSection />
        <FoundersSection />
        <Footer />
      </div>
    </main>
  );
}
