const catchAsync = require('../utils/catchAsync');

/**
 * Mixin que agrega auto-wrapping de métodos async
 * @param {Class} BaseClass - Clase base
 * @returns {Class} Clase con auto-wrapping
 */
function withAsyncHandling(BaseClass) {
  return class extends BaseClass {
    constructor(...args) {
      super(...args);
      this._wrapAsyncMethods();
    }

    /**
     * Encuentra y wrap automáticamente todos los métodos async
     */
    _wrapAsyncMethods() {
      // Lista de métodos que sabemos que son async en nuestros controllers base
      const knownAsyncMethods = ['find', 'findById', 'create', 'update', 'delete'];

      // Buscar en toda la cadena de prototipos
      let prototype = Object.getPrototypeOf(this);

      while (prototype && prototype !== Object.prototype) {
        const methods = Object.getOwnPropertyNames(prototype);

        methods.forEach(methodName => {
          if (methodName !== 'constructor' &&
              methodName !== '_wrapAsyncMethods' &&
              !methodName.startsWith('_') &&
              typeof this[methodName] === 'function') {

            const method = this[methodName];

            // Verificar si es un método async (múltiples formas de detectarlo)
            const isAsync = method.constructor.name === 'AsyncFunction' ||
                           method.toString().includes('async') ||
                           knownAsyncMethods.includes(methodName);

            // No wrappear si ya está wrapeado
            if (isAsync && method.name !== 'catchAsyncWrapper') {
              this[methodName] = catchAsync(method.bind(this));
            }
          }
        });

        // Subir en la cadena de prototipos
        prototype = Object.getPrototypeOf(prototype);
      }
    }
  };
}

module.exports = withAsyncHandling;
