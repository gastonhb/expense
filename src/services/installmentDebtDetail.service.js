const { InstallmentDebtDetail } = require('../models');
const BaseService = require('./BaseService');
const { ServiceError } = require('./errors');
const sequelize = require('../config/database').getSequelize();

class InstallmentDebtDetailService extends BaseService {
  constructor() {
    super(InstallmentDebtDetail, 'InstallmentDebtDetail');
    this.defaultSort = '-createdAt';
    this.textSearchFields = ['number'];
    this.dateRangeFields = ['date'];
  }

  get findIncludes() {
    return [
      { model: require('../models').InstallmentDebt, as: 'installmentDebt' },
      { model: require('../models').DebtPayment, as: 'payment' }
    ];
  }

  async payInstallment(installmentId, data, reqUser, { transaction } = {}) {
    if (!transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.payInstallment(installmentId, data, reqUser, { transaction });
      });
    }

    const installment = await this.findById(installmentId, { transaction });

    if (!installment) throw new ServiceError('InstallmentDebtDetail not found');
    if (installment.ownerUserId !== reqUser.id) throw new ServiceError('Unauthorized');
    if (installment.debtPaymentId) throw new ServiceError('Installment already paid');

    // Crear el DebtPayment
    const debtPaymentService = require('./debtPayment.service');
    const paymentData = {
      date: data.date || new Date().toISOString().split('T')[0],
      amount: data.amount ? parseFloat(data.amount) : parseFloat(installment.amount),
      description: data.description || `Cuota ${installment.number}`,
      debtorId: installment.debtorId,
      ownerUserId: reqUser.id
    };
    const payment = await debtPaymentService.create(paymentData, reqUser, { transaction });

    // Actualizar la cuota
    const updateData = { debtPaymentId: payment.id, updatedBy: reqUser.id };
    if (data.amount) updateData.amount = parseFloat(data.amount);
    return await installment.update(updateData, { transaction });

  }
}

module.exports = new InstallmentDebtDetailService();
