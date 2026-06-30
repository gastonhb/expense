const { Debtor } = require('../models');
const BaseService = require('./BaseService');
const { ServiceError } = require('./errors');
const { Op } = require('sequelize');

class DebtorService extends BaseService {
  constructor() {
    super(Debtor, 'Debtor');
    this.defaultSort = '-createdAt';
    this.textSearchFields = ['name', 'lastName'];
  }

  get findIncludes() {
    return [
      { model: require('../models').User, as: 'user' },
      { model: require('../models').User, as: 'owner' }
    ];
  }

  async create(data, reqUser, options = {}) {
    data.ownerUserId = reqUser.id;
    return await super.create(data, reqUser, options);
  }

  async update(id, data, reqUser, options = {}) {
    data.ownerUserId = reqUser.id;
    return await super.update(id, data, reqUser, options);
  }

  async getBalance(debtorId, reqUser) {
    const { Debt, DebtPayment, InstallmentDebtDetail } = require('../models');

    const debtor = await this.findById(debtorId, reqUser);
    if (!debtor) throw new ServiceError('Debtor not found');

    const today = new Date().toISOString().split('T')[0];
    const scope = { debtorId, ownerUserId: reqUser.id };

    const [debtSum, paymentSum, unpaidInstallmentsSum] = await Promise.all([
      Debt.sum('amount', { where: scope }),
      DebtPayment.sum('amount', { where: scope }),
      InstallmentDebtDetail.sum('amount', {
        where: {
          ...scope,
          debtPaymentId: null,
          date: { [Op.lte]: today }
        }
      })
    ]);

    const debts = parseFloat(debtSum) || 0;
    const payments = parseFloat(paymentSum) || 0;
    const unpaidInstallments = parseFloat(unpaidInstallmentsSum) || 0;
    const balance = debts - payments + unpaidInstallments;

    return { debtor, debts, payments, unpaidInstallments, balance };
  }
}

module.exports = new DebtorService();
