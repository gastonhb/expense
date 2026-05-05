const catchAsync = require('./catchAsync');

/**
 * Helper para aplicar catchAsync automáticamente a métodos de una clase
 * @param {Object} target - Instancia de la clase
 * @param {Array} methods - Array de nombres de métodos para wrap
 */
function wrapAsyncMethods(target, methods) {
  methods.forEach(methodName => {
    if (typeof target[methodName] === 'function') {
      target[methodName] = catchAsync(target[methodName].bind(target));
    }
  });
}

/**
 * Decorador para clases que auto-wrap todos los métodos async
 * @param {Array} excludeMethods - Métodos a excluir del wrapping
 */
function autoWrapAsync(excludeMethods = []) {
  return function(target) {
    const originalConstructor = target;

    function wrappedConstructor(...args) {
      const instance = new originalConstructor(...args);

      // Obtener todos los métodos de la instancia
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
        .filter(name => {
          return name !== 'constructor' &&
                 !excludeMethods.includes(name) &&
                 typeof instance[name] === 'function' &&
                 instance[name].constructor.name === 'AsyncFunction';
        });

      // Wrap automático
      wrapAsyncMethods(instance, methods);

      return instance;
    }

    // Mantener el prototipo
    wrappedConstructor.prototype = originalConstructor.prototype;

    return wrappedConstructor;
  };
}

module.exports = {
  wrapAsyncMethods,
  autoWrapAsync
};
