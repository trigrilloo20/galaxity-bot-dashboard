# 📋 PLAN DE TRANSFORMACIÓN: Galaxity → Kimeoro Bot Panel

## 🎯 Resumen del Proyecto
Transformar la web de Galaxity Network en un **Panel de Administración de Bots** con tema Kimeoro, login Discord y sistema de roles.

---

## 📊 CAMBIOS PRINCIPALES

### 1️⃣ **AUTENTICACIÓN - Login Discord**
**Estado Actual:** Sin autenticación
**Cambio:** Agregar OAuth2 de Discord
```
- Usar NextAuth.js (ya está en package.json)
- Integrar Discord como proveedor
- Guardar datos en Prisma DB
- Crear tipos de usuarios con roles
```

### 2️⃣ **SISTEMA DE ROLES**
```
├── Developer (Admin total)
├── Usuario (Acceso básico)
├── VIP (Acceso extendido)
├── VIP+ (Acceso premium)
└── Mega VIP (Acceso máximo)
```

### 3️⃣ **REBRANDING A KIMEORO**
**Colores actuales:** Purple (#7c3aed) + Cyan (#06b6d4)
**Colores Kimeoro:** Necesitamos que nos especifiques:
- Color primario
- Color secundario
- Colores de acentos
- Logo

**Para cambiar:**
- ✅ Colores en `tailwind.config.ts`
- ✅ Gradientes en CSS
- ✅ Logos e imágenes en `/public`
- ✅ Textos y metadatos
- ✅ Animaciones (CONSERVAR)

### 4️⃣ **REDISEÑO DEL MENÚ**
**Actual:** Navbar simple con links
**Nuevo:** Sidebar + Navbar modernos
```
Sidebar (Admin Panel):
├── Dashboard
├── Bots
│   ├── Crear Bot
│   ├── Mis Bots
│   └── Configuración
├── Usuarios
├── Estadísticas
├── Configuración
└── Logout
```

### 5️⃣ **INTEGRACIÓN API**
**Funcionalidades:**
- Crear/editar/eliminar bots
- Asignar permisos por rol
- Guardar configuraciones del bot
- Obtener estadísticas

**Rutas API recomendadas:**
```
POST   /api/auth/discord
POST   /api/bots
GET    /api/bots
GET    /api/bots/:id
PUT    /api/bots/:id
DELETE /api/bots/:id
POST   /api/users/role
GET    /api/stats
```

### 6️⃣ **BASE DE DATOS - Prisma Schema**
```prisma
model User {
  id          String    @id
  discordId   String    @unique
  email       String    @unique
  username    String
  avatar      String?
  role        Role      @default(USUARIO)
  bots        Bot[]
  createdAt   DateTime  @default(now())
}

model Bot {
  id          String    @id
  name        String
  token       String    @unique
  owner       User      @relation(fields: [ownerId], references: [id])
  ownerId     String
  status      Boolean   @default(false)
  settings    Json
  createdAt   DateTime  @default(now())
}

enum Role {
  DEVELOPER
  USUARIO
  VIP
  VIP_PLUS
  MEGA_VIP
}
```

### 7️⃣ **ESTRUCTURA DE CARPETAS NUEVA**
```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].ts
│   │   ├── bots/
│   │   ├── users/
│   │   └── stats/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── bots/
│   │   ├── users/
│   │   └── settings/
│   ├── layout.tsx
│   ├── page.tsx (landing)
│   └── globals.css
├── components/
│   ├── Sidebar.tsx
│   ├── Navbar.tsx
│   ├── BotCard.tsx
│   ├── RoleGuard.tsx
│   └── ui/ (ya existe)
├── lib/
│   ├── auth.ts (NextAuth config)
│   ├── db.ts (Prisma client)
│   └── utils.ts
├── types/
│   └── index.ts
└── middleware.ts
```

---

## 🔧 ARCHIVOS A MODIFICAR

### **PRIORIDAD 1 (CRITICAL)**
1. `tailwind.config.ts` - Cambiar colores
2. `package.json` - Agregar dependencias
3. `prisma/schema.prisma` - Crear modelos
4. `src/app/layout.tsx` - Agregar NextAuth provider
5. `src/app/page.tsx` - Separar landing

### **PRIORIDAD 2 (IMPORTANTE)**
6. Crear `src/lib/auth.ts` - Configuración NextAuth
7. Crear rutas API en `src/app/api/`
8. Crear `src/middleware.ts` - Proteger rutas
9. Crear componentes: Sidebar, RoleGuard
10. Crear páginas dashboard

### **PRIORIDAD 3 (MEJORAS)**
11. Crear formularios admin
12. Agregar estadísticas
13. Sistema de notificaciones
14. Temas y personalizaciones

---

## 📦 DEPENDENCIAS A AGREGAR

```json
{
  "next-auth": "^5.0.0",
  "prisma": "^6.11.1",
  "@prisma/client": "^6.11.1",
  "discord.js": "^14.14.1",
  "axios": "^1.6.5",
  "zustand": "^5.0.6"
}
```

---

## 🎨 COLORES KIMEORO
**POR FAVOR PROPORCIONA:**
- [ ] Color primario (hex)
- [ ] Color secundario (hex)
- [ ] Colores de roles (5)
- [ ] Logo PNG/SVG
- [ ] Paleta completa

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Definir colores Kimeoro
- [ ] Setup NextAuth Discord OAuth
- [ ] Crear models Prisma
- [ ] Migrar base de datos
- [ ] Crear middleware auth
- [ ] Diseñar dashboard layout
- [ ] Crear rutas API CRUD
- [ ] Componentes reutilizables
- [ ] Sistema de roles y permisos
- [ ] Validaciones frontend/backend
- [ ] Manejo de errores
- [ ] Testing básico

---

## 🚀 PASOS SIGUIENTES

1. **Hoy:** Confirma colores Kimeoro y especificaciones
2. **Paso 1:** Configuro NextAuth + Discord login
3. **Paso 2:** Creas estructura DB + Prisma models
4. **Paso 3:** Implementas dashboard y sidebar
5. **Paso 4:** Creamos rutas API para bots
6. **Paso 5:** Sistema de roles y permisos
7. **Paso 6:** Testing y deploy

---

## 📝 NOTAS IMPORTANTES

✅ **SE CONSERVA:**
- Animaciones con Framer Motion
- Starfield background
- Responsive design
- TypeScript strict mode

❌ **SE ELIMINA/CAMBIA:**
- Navbar simple → Sidebar + Navbar admin
- Landing page → Dashboard principal
- Colores Galaxity → Kimeoro
- Contenido de bienvenida → Admin content

---

**Siguiente:** Proporciona detalles de Kimeoro y comenzamos con la implementación.
