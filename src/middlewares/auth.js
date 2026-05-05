const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const config = require('../config/environment');
const { AppError } = require('./errorHandler');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');

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

// Middleware para proteger rutas
const protect = catchAsync(async (req, res, next) => {
  // 1) Obtener token y verificar si existe
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

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
    const decoded = await promisify(jwt.verify)(token, config.jwt.secret);

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
    req.user = { id: decoded.id }; // currentUser;
    res.locals.user = req.user;

    logger.info('Acceso autorizado', {
      userId: decoded.id,
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
  if (req.cookies.jwt) {
    try {
      // 1) verify the token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        config.jwt.secret
      );

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
      res.locals.user = { id: decoded.id }; // currentUser;
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
