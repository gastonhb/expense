const { AppError } = require('./errorHandler');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { firebaseAuth } = require('../config/firebase');
const { User } = require('../models');

const getTokenFromRequest = (req) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    const match = authorizationHeader.trim().match(/^Bearer\s+(.+)$/i);

    if (match) {
      return match[1].trim();
    }
  }

  return req.cookies?.firebaseToken;
};

const splitDisplayName = (displayName = '') => {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);

  return {
    name: parts[0],
    lastName: parts.slice(1).join(' ')
  };
};

const findOrCreateFirebaseUser = async (decodedToken) => {
  const authenticationId = decodedToken.uid;
  const email = decodedToken.email?.toLowerCase();

  if (!authenticationId || !email) {
    throw new AppError('El token de Firebase no contiene datos de usuario suficientes.', 401);
  }

  const existingUser = await User.findOne({ where: { authenticationId } });
  if (existingUser) return existingUser;

  const userByEmail = await User.findOne({ where: { email } });
  if (userByEmail) {
    await userByEmail.update({ authenticationId });
    return userByEmail;
  }

  const displayName = splitDisplayName(decodedToken.name || decodedToken.email.split('@')[0]);

  const user = await User.create({
    authenticationId,
    email,
    name: displayName.name || email.split('@')[0],
    lastName: displayName.lastName || '-'
  });

  return await user.update({
    createdBy: user.id,
    updatedBy: user.id
  });
};

const getAuthenticatedUser = async (token) => {
  const decodedToken = await firebaseAuth.verifyIdToken(token);
  const user = await findOrCreateFirebaseUser(decodedToken);

  return {
    id: user.id,
    role: decodedToken.role,
    email: user.email,
    authenticationId: decodedToken.uid,
    authProvider: 'firebase',
    firebase: {
      uid: decodedToken.uid,
      emailVerified: decodedToken.email_verified,
      signInProvider: decodedToken.firebase?.sign_in_provider
    }
  };
};

// Middleware para proteger rutas
const protect = catchAsync(async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    logger.warn('Acceso denegado - Sin token', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });

    return next(
      new AppError('No estas autenticado! Envia un Firebase ID token para obtener acceso.', 401)
    );
  }

  try {
    const user = await getAuthenticatedUser(token);

    req.user = user;
    res.locals.user = req.user;

    logger.info('Acceso autorizado', {
      userId: user.id,
      authProvider: user.authProvider,
      url: req.originalUrl
    });

    next();
  } catch (error) {
    logger.warn('Token de Firebase invalido', {
      token: token.substring(0, 20) + '...',
      error: error.message,
      ip: req.ip
    });

    return next(new AppError('Token invalido! Por favor inicia sesion de nuevo.', 401));
  }
});

// Middleware para restriccion de roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn('Acceso denegado - Rol insuficiente', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: roles,
        url: req.originalUrl
      });

      return next(
        new AppError('No tienes permisos para realizar esta accion', 403)
      );
    }
    next();
  };
};

// Middleware para verificar si esta logueado (no obligatorio)
const isLoggedIn = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (token) {
    try {
      res.locals.user = await getAuthenticatedUser(token);
      return next();
    } catch (err) {
      return next(err);
    }
  }
  next();
};

module.exports = {
  protect,
  restrictTo,
  isLoggedIn
};
