const { Quota, Shopping } = require('../models');
const BaseService = require('./BaseService');
const expenseService = require('./expense.service');
const { ServiceError } = require('./errors');
const sequelize = require('../config/database').getSequelize();

class QuotaService extends BaseService {
  constructor() {
    super(Quota, 'Quota');
    this.defaultSort = '-createdAt';
    this.textSearchFields = ['number'];
    this.dateRangeFields = ['date'];
  }

  async payQuota(quotaId, data, reqUser, { transaction } = {}) {
    if (!transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.payQuota(quotaId, data, reqUser, { transaction });
      });
    }

    // Obtener la quota con la shopping incluida
    const quota = await this.findById(quotaId, {
      include: [{
        model: Shopping,
        as: 'shopping',
        attributes: ['id', 'description', 'typeId', 'subtypeId']
      }],
      transaction
    });

    if (!quota) {
      throw new ServiceError('Quota not found');
    }

    if (quota.userId !== reqUser.id) {
      throw new ServiceError('Unauthorized - Quota does not belong to user');
    }

    if (quota.expenseId) {
      throw new ServiceError('Quota already paid');
    }

    // Preparar datos del expense
    const expenseAmount = data.amount ? parseFloat(data.amount) : parseFloat(quota.amount);
    const expenseData = {
      date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      amount: expenseAmount,
      typeId: quota.shopping?.typeId || null,
      subtypeId: quota.shopping?.subtypeId || null,
      paymentMethodId: data.paymentMethodId || null,
      description: data.description || `Pago cuota ${quota.number} - ${quota.shopping?.description || ''}`,
      userId: reqUser.id
    };

    // Crear el expense
    const expense = await expenseService.create(expenseData, reqUser, { transaction });

    // Actualizar la quota con el expenseId y el monto si cambió
    const updateData = {
      expenseId: expense.id,
      updatedBy: reqUser.id
    };
    if (data.amount) {
      updateData.amount = expenseAmount;
    }

    return quota.update(updateData, { transaction });
  }
}

module.exports = new QuotaService();
