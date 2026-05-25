const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/environment');
const { AppError } = require('./errorHandler');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { User } = require('../models');

const jwksCache = new Map();

// Función para generar JWT
const signToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

// Función para crear y enviar token
const createSendToken = (user, statusCode, res, message = 'Autenticación exitosa') => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + config.jwt.cookieExpiresIn * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (config.env === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remover password del output
  user.password = undefined;

  logger.info('Token JWT creado', {
    userId: user.id,
    email: user.email
  });

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: {
      user
    },
    timestamp: new Date().toISOString()
  });
};

const getTokenFromRequest = (req) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    const match = authorizationHeader.trim().match(/^Bearer\s+(.+)$/i);

    if (match) {
      return match[1].trim();
    }
  }

  return req.cookies.jwt;
};

const isSupabaseIssuer = (issuer) => {
  if (!issuer) return false;
  if (config.supabase.authIssuer) return issuer === config.supabase.authIssuer;

  try {
    const url = new URL(issuer);
    return url.hostname.endsWith('.supabase.co') && url.pathname.replace(/\/$/, '') === '/auth/v1';
  } catch {
    return false;
  }
};

const getJwksForIssuer = async (issuer) => {
  const cached = jwksCache.get(issuer);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.keys;
  }

  const response = await fetch(`${issuer}/.well-known/jwks.json`);
  if (!response.ok) {
    throw new Error(`No se pudo obtener JWKS de Supabase (${response.status})`);
  }

  const { keys } = await response.json();
  jwksCache.set(issuer, {
    keys,
    expiresAt: Date.now() + 60 * 60 * 1000
  });

  return keys;
};

const verifySupabaseToken = async (token) => {
  const decoded = jwt.decode(token, { complete: true });
  const issuer = decoded?.payload?.iss;
  const kid = decoded?.header?.kid;

  if (!isSupabaseIssuer(issuer)) {
    throw new Error('El issuer del token no corresponde a Supabase');
  }

  if (!kid) {
    throw new Error('El token de Supabase no contiene kid');
  }

  const keys = await getJwksForIssuer(issuer);
  const key = keys.find((currentKey) => currentKey.kid === kid);

  if (!key) {
    throw new Error('No se encontro la clave publica del token');
  }

  const publicKey = crypto
    .createPublicKey({ key, format: 'jwk' })
    .export({ format: 'pem', type: 'spki' });

  return jwt.verify(token, publicKey, {
    algorithms: ['ES256', 'RS256'],
    audience: config.supabase.authAudience,
    issuer,
    clockTolerance: 10
  });
};

const findOrCreateSupabaseUser = async (decoded) => {
  const metadata = decoded.user_metadata || {};
  const email = (decoded.email || metadata.email)?.toLowerCase();
  const authenticationId = decoded.sub;

  if (!authenticationId || !email) {
    throw new AppError('El token de Supabase no contiene datos de usuario suficientes.', 401);
  }

  const existingUser = await User.findOne({ where: { authenticationId } });
  if (existingUser) return existingUser;

  const userByEmail = await User.findOne({ where: { email } });
  if (userByEmail) {
    await userByEmail.update({ authenticationId });
    return userByEmail;
  }

  return await User.create({
    authenticationId,
    email,
    name: metadata.first_name || metadata.name || email.split('@')[0],
    lastName: metadata.last_name || metadata.family_name || '-'
  });
};

const getAuthenticatedUser = async (token) => {
  const decodedToken = jwt.decode(token);

  if (isSupabaseIssuer(decodedToken?.iss)) {
    const decoded = await verifySupabaseToken(token);
    const user = await findOrCreateSupabaseUser(decoded);

    return {
      id: user.id,
      role: decoded.role,
      email: user.email,
      authenticationId: decoded.sub,
      authProvider: 'supabase'
    };
  }

  const decoded = jwt.verify(token, config.jwt.secret);
  return {
    id: decoded.id,
    authProvider: 'local'
  };
};

// Middleware para proteger rutas
const protect = catchAsync(async (req, res, next) => {
  // 1) Obtener token y verificar si existe
  const token = getTokenFromRequest(req);

  if (!token) {
    logger.warn('Acceso denegado - Sin token', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });

    return next(
      new AppError('No estás autenticado! Por favor inicia sesión para obtener acceso.', 401)
    );
  }

  try {
    // 2) Verificar token
    const user = await getAuthenticatedUser(token);

    // 3) Verificar si el usuario aún existe
    // const currentUser = await User.findById(decoded.id);
    // if (!currentUser) {
    //   return next(
    //     new AppError('El usuario que pertenece a este token ya no existe.', 401)
    //   );
    // }

    // 4) Verificar si el usuario cambió la password después de que el JWT fue emitido
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //   return next(
    //     new AppError('Usuario cambió recientemente la password! Por favor inicia sesión de nuevo.', 401)
    //   );
    // }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = user; // currentUser;
    res.locals.user = req.user;

    logger.info('Acceso autorizado', {
      userId: user.id,
      authProvider: user.authProvider,
      url: req.originalUrl
    });

    next();
  } catch (error) {
    logger.warn('Token JWT inválido', {
      token: token.substring(0, 20) + '...',
      error: error.message,
      ip: req.ip
    });

    return next(new AppError('Token inválido! Por favor inicia sesión de nuevo.', 401));
  }
});

// Middleware para restricción de roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      logger.warn('Acceso denegado - Rol insuficiente', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: roles,
        url: req.originalUrl
      });

      return next(
        new AppError('No tienes permisos para realizar esta acción', 403)
      );
    }
    next();
  };
};

// Middleware para verificar si está logueado (no obligatorio)
const isLoggedIn = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (token) {
    try {
      // 1) verify the token
      const user = await getAuthenticatedUser(token);

      // 2) Check if user still exists
      // const currentUser = await User.findById(decoded.id);
      // if (!currentUser) {
      //   return next();
      // }

      // 3) Check if user changed password after the token was issued
      // if (currentUser.changedPasswordAfter(decoded.iat)) {
      //   return next();
      // }

      // THERE IS A LOGGED IN USER
      res.locals.user = user; // currentUser;
      return next();
    } catch (err) {
      return next(err);
    }
  }
  next();
};

module.exports = {
  signToken,
  createSendToken,
  protect,
  restrictTo,
  isLoggedIn
};
