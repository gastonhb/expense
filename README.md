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

## 📝 Notas

- **Node.js**: Versión 22+ requerida
- **npm**: Versión 10+ requerida
- **PostgreSQL**: Compatible con versiones 14+
- **Warnings deprecated**: Suprimidos via `.npmrc` con `loglevel=error`

El archivo `.npmrc` está configurado para mostrar solo errores, ocultando warnings de dependencias deprecated que no podemos controlar (ej: swagger dependencies). Los overrides en package.json mantienen la estabilidad de las versiones.
