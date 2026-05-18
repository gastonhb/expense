const express = require('express');
const router = express.Router();
const methodNotAllowed = require('../middlewares/methodNotAllowed');
const validate = require('../middlewares/validate');
const { apiLimiter, createLimiter } = require('../middlewares/rateLimiter');

const { userController: controller } = require('../controllers');
const { userValidation: validation } = require('../validations');

router.use(apiLimiter);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operaciones CRUD para usuarios
 */

router.route('/')
  .get(validate(validation.find), controller.find)
  .post(createLimiter, validate(validation.create), controller.create)
  .all(methodNotAllowed);

router.route('/:id')
  .get(validate(validation.findById), controller.findById)
  .patch(validate(validation.update), controller.update)
  .delete(validate(validation.destroy), controller.delete)
  .all(methodNotAllowed);

module.exports = router;
