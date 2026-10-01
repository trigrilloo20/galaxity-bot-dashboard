# 📁 ESTRUCTURA DE CARPETAS - KIMEORO BOT PANEL

## Carpeta: `src/app/`
```
src/app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx           # Página login Discord
│   └── logout/
│       └── route.ts           # Logout handler
│
├── (dashboard)/
│   ├── layout.tsx             # Layout principal con Sidebar
│   ├── page.tsx               # Dashboard principal
│   │
│   ├── servidores/
│   │   ├── page.tsx           # Lista de servidores
│   │   └── [guildId]/
│   │       ├── page.tsx       # Detalles servidor
│   │       ├── economia/
│   │       │   └── page.tsx
│   │       ├── comandos/
│   │       │   └── page.tsx
│   │       └── settings/
│   │           └── page.tsx
│   │
│   ├── tickets/
│   │   ├── page.tsx           # Mis tickets
│   │   ├── crear/
│   │   │   └── page.tsx
│   │   └── [ticketId]/
│   │       └── page.tsx
│   │
│   ├── economia/
│   │   └── page.tsx           # Mi saldo y transacciones
│   │
│   ├── comandos/
│   │   ├── page.tsx           # Mis comandos personalizados
│   │   └── crear/
│   │       └── page.tsx
│   │
│   └── admin/ (solo DEVELOPER)
│       ├── page.tsx           # Admin panel
│       ├── stats/
│       │   └── page.tsx       # Estadísticas IA, Música, etc
│       ├── servidores/
│       │   └── page.tsx       # Ver todos servidores
│       └── usuarios/
│           └── page.tsx       # Gestión usuarios
│
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts       # NextAuth handler
│   │
│   ├── bots/
│   │   ├── route.ts           # GET, POST bots
│   │   ├── [botId]/
│   │   │   └── route.ts       # GET, PUT, DELETE bot
│   │   └── [botId]/servidores/
│   │       └── route.ts       # GET servidores del bot
│   │
│   ├── servidores/
│   │   ├── route.ts           # GET servidores (donde está el bot)
│   │   ├── [guildId]/
│   │   │   ├── route.ts       # GET servidor
│   │   │   ├── economia/
│   │   │   │   └── route.ts   # Economía del servidor
│   │   │   └── stats/
│   │   │       └── route.ts   # Estadísticas
│   │
│   ├── tickets/
│   │   ├── route.ts           # GET, POST tickets
│   │   └── [ticketId]/
│   │       └── route.ts       # GET, PUT, DELETE ticket
│   │
│   ├── comandos/
│   │   ├── route.ts           # GET, POST comandos
│   │   └── [comandoId]/
│   │       └── route.ts       # GET, PUT, DELETE comando
│   │
│   ├── economia/
│   │   ├── transacciones/
│   │   │   └── route.ts       # GET transacciones usuario
│   │   └── tops/
│   │       ├── millonarios/
│   │       │   └── route.ts   # Top millonarios
│   │       └── donadores/
│   │           └── route.ts   # Top donadores
│   │
│   ├── admin/
│   │   ├── stats/
│   │   │   ├── ia/
│   │   │   │   └── route.ts   # Estadísticas IA
│   │   │   ├── musica/
│   │   │   │   └── route.ts   # Estadísticas Música
│   │   │   ├── economia/
│   │   │   │   └── route.ts   # Estadísticas Economía
│   │   │   └── general/
│   │   │       └── route.ts   # Stats generales
│   │   └── servidores/
│   │       └── route.ts       # Todos los servidores
│   │
│   └── users/
│       ├── [userId]/
│       │   └── route.ts       # GET usuario profile
│       └── role/
│           └── route.ts       # POST cambiar rol (admin)
│
├── layout.tsx                 # Layout raíz
├── page.tsx                   # Landing page (inicio con tops)
├── globals.css
└── robots.txt
```

## Carpeta: `src/components/`
```
src/components/
├── Sidebar.tsx                # Sidebar navigation
├── Navbar.tsx                 # Top navbar
├── RoleGuard.tsx              # Protección por roles
├── Loader.tsx                 # Loading spinner
├── StatsCard.tsx              # Card para estadísticas
├── ServerCard.tsx             # Card para servidor
├── BotCard.tsx                # Card para bot
│
├── Dashboard/
│   ├── WelcomeCard.tsx
│   ├── StatsOverview.tsx
│   └── RecentActivity.tsx
│
├── Servidor/
│   ├── EconomiaPanel.tsx
│   ├── ComandosPanel.tsx
│   └── SettingsPanel.tsx
│
├── Admin/
│   ├── IAStatsChart.tsx
│   ├── MusicStatsChart.tsx
│   ├── EconomyStatsChart.tsx
│   ├── ServidoresTable.tsx
│   └── UsersTable.tsx
│
├── Tops/
│   ├── TopMillonarios.tsx
│   ├── TopDonadores.tsx
│   └── TopsSection.tsx
│
└── ui/
    └── (ya existen los componentes Shadcn)
```

## Carpeta: `src/lib/`
```
src/lib/
├── auth.ts                    # Configuración NextAuth
├── db.ts                      # Cliente Prisma
├── utils.ts                   # Utilidades
├── permissions.ts             # Checkers de roles
├── validators.ts              # Validaciones Zod
└── constants.ts               # Constantes
```

## Carpeta: `src/types/`
```
src/types/
├── index.ts                   # Tipos principales
├── user.ts
├── bot.ts
├── servidor.ts
├── economia.ts
├── ticket.ts
└── comando.ts
```

## Archivos raíz
```
├── middleware.ts              # Protección de rutas
├── next.config.ts             # Config Next.js
├── tailwind.config.ts         # Config Tailwind (colores azules)
├── .env.local                 # Variables de entorno
└── package.json               # Dependencias
```

---

## 📊 DEPENDENCIAS A INSTALAR

```bash
npm install next-auth @auth/prisma-adapter
npm install prisma @prisma/client
npm install zod
npm install recharts             # Para gráficos de stats
npm install axios                # Para llamadas API
npm install zustand              # State management
```

---

## 🎨 COLORES AZUL KIMEORO (Tailwind)

Agregar a `tailwind.config.ts`:

```ts
colors: {
  'kimeoro': {
    50: '#f0f7ff',
    100: '#e0eeff',
    200: '#baddff',
    300: '#7eb3ff',
    400: '#3b82f6',    // Azul principal
    500: '#2563eb',    // Azul más oscuro
    600: '#1d4ed8',
    700: '#1e40af',
    800: '#1e3a8a',
    900: '#172554',    // Azul muy oscuro
  }
}
```

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Reemplazar schema Prisma
2. ✅ Crear middleware.ts
3. ✅ Crear componentes principales (Sidebar, Navbar)
4. ✅ Crear páginas landing y dashboard
5. ✅ Crear rutas API CRUD
6. ✅ Implementar tops (millonarios, donadores)
7. ✅ Panel admin con estadísticas
8. ✅ Sistema de tickets
9. ✅ Comandos personalizados
10. ✅ Testing y deploy
