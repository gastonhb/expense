# API Template

Template de API REST con Node.js, Express, Sequelize y PostgreSQL.

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <tu-repo>
cd api-template

# Instalar dependencias (sin warnings deprecated)
npm install

# O usar el comando personalizado para instalación limpia
npm run install:clean
```

## 📦 Scripts Disponibles

```bash
npm start           # Iniciar en producción
npm run dev         # Desarrollo con nodemon
npm run dev:watch   # Desarrollo con --watch nativo
npm run lint        # Verificar código con ESLint
npm run lint:fix    # Corregir automáticamente con ESLint
npm run install:clean # Instalar sin warnings deprecated
```

## 🔧 Configuración

El proyecto incluye:
- ✅ Express 5.x
- ✅ PostgreSQL con Sequelize
- ✅ Helmet para seguridad
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Logging con Winston
- ✅ Validación con Joi
- ✅ ESLint configurado
- ✅ Documentación con Swagger

## 📁 Estructura

```
src/
├── config/          # Configuraciones
├── controllers/     # Controladores con herencia
├── middlewares/     # Middlewares personalizados
├── models/          # Modelos de Sequelize
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio con herencia
├── utils/           # Utilidades
└── validations/     # Validaciones con Joi
```

## 🏗️ Arquitectura

### Herencia de Servicios
- `BaseReadOnlyService` - Operaciones de solo lectura
- `BaseService` - CRUD completo (extiende ReadOnly)

### Herencia de Controllers
- `BaseReadOnlyController` - Endpoints de solo lectura
- `BaseController` - REST completo (extiende ReadOnly)

### Manejo de Errores
- `catchAsync` con mixin automático
- Middleware global de manejo de errores
- Códigos de estado HTTP estandarizados

## 🔒 Seguridad

- Helmet para headers de seguridad
- Rate limiting por IP
- CORS configurado
- Validación de entrada con Joi
- Sanitización de datos

## 📚 Documentación API

La documentación Swagger está disponible en:
```
http://localhost:3000/api-docs
```

## 🛠️ Desarrollo

```bash
# Variables de entorno
cp .env.example .env

# Iniciar base de datos (Docker)
docker run -d --name postgres -e POSTGRES_DB=api_template -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16

# En .env usar variables DB_* (DB_DIALECT, DB_HOST, DB_PORT, etc.)

# Desarrollo
npm run dev
```

## ☁️ Despliegue en Render (API + PostgreSQL)

### Opción recomendada: Blueprint con `render.yaml`

Este repositorio ya incluye [render.yaml](render.yaml) para crear en Render:
- Un servicio web Node.js (`expense-api`)
- Conexión a PostgreSQL externo (recomendado: Neon)

Pasos:

```bash
# 1) Subir cambios al repositorio remoto
git add render.yaml README.md
git commit -m "chore: add render blueprint for api and postgres"
git push
```

1. En Render, elegir **New +** -> **Blueprint**.
2. Conectar tu repositorio y seleccionar la rama.
3. Render detectará `render.yaml` y aprovisionará la API.
4. En variables de entorno, cargar `DATABASE_URL` con tu cadena de Neon.
4. Esperar el primer deploy y abrir la URL pública del servicio.

Variables importantes ya definidas en el blueprint:
- `DATABASE_URL`: se define manualmente en Render con la URL de Neon
- `DB_SSL=true`
- `DB_SYNC=false` (recomendado en producción)
- `NODE_ENV=production`
- `FIREBASE_PROJECT_ID`: ID del proyecto de Firebase
- `FIREBASE_CLIENT_EMAIL`: email del service account de Firebase
- `FIREBASE_PRIVATE_KEY`: private key del service account de Firebase

### Si preferís crear todo manualmente en Render

Configurar el Web Service con:
- Build Command: `corepack enable && pnpm install --frozen-lockfile`
- Start Command: `pnpm start`

Y definir estas variables de entorno:
- `NODE_ENV=production`
- `DATABASE_URL=<URL de conexión de Neon>`
- `DB_DIALECT=postgres`
- `DB_SSL=true`
- `DB_SYNC=false`
- `FIREBASE_PROJECT_ID=<id-del-proyecto-firebase>`
- `FIREBASE_CLIENT_EMAIL=<service-account-email>`
- `FIREBASE_PRIVATE_KEY=<private-key-con-\n>`
- `LOG_LEVEL=info`
- `SWAGGER_ENABLED=true` (si querés exponer `/api-docs` en producción)

## ▲ Despliegue en Vercel (API + PostgreSQL)

Este repositorio incluye:
- `vercel.json` con rewrite global hacia la función serverless
- `api/index.js` como entrypoint para ejecutar Express en Vercel Functions

### Pasos rápidos

1. Subir cambios al repositorio remoto.
2. En Vercel, crear un nuevo proyecto desde GitHub y seleccionar este repo.
3. En Project Settings -> Environment Variables, configurar las variables.
4. Hacer deploy y validar `https://<tu-dominio>/v1/health/live`.

### Variables de entorno recomendadas en Vercel

- `NODE_ENV=production`
- `URL=https://<tu-dominio-publico>`
- `DATABASE_URL=<connection string de PostgreSQL>`
- `DB_DIALECT=postgres`
- `DB_SSL=true` (usar `false` solo si tu proveedor no requiere SSL)
- `DB_SYNC=false` (recomendado en producción)
- `DB_LOGGING=false`
- `FIREBASE_PROJECT_ID=<id-del-proyecto-firebase>`
- `FIREBASE_CLIENT_EMAIL=<service-account-email>`
- `FIREBASE_PRIVATE_KEY=<private-key-con-\n>`
- `LOG_LEVEL=info`

### Nota sobre Vercel

- En Vercel, `PORT` no se configura manualmente para este despliegue serverless.
- Para evitar recrear tablas en cada cold start, mantener `DB_SYNC=false` en producción.

## 📝 Notas

- **Node.js**: Versión 22+ requerida
- **npm**: Versión 10+ requerida
- **PostgreSQL**: Compatible con versiones 14+
- **Warnings deprecated**: Suprimidos via `.npmrc` con `loglevel=error`

El archivo `.npmrc` está configurado para mostrar solo errores, ocultando warnings de dependencias deprecated que no podemos controlar (ej: swagger dependencies). Los overrides en package.json mantienen la estabilidad de las versiones.
