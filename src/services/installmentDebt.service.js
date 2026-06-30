const { InstallmentDebt, InstallmentDebtDetail } = require('../models');
const BaseService = require('./BaseService');
const sequelize = require('../config/database').getSequelize();

class InstallmentDebtService extends BaseService {
  constructor() {
    super(InstallmentDebt, 'InstallmentDebt');
    this.defaultSort = '-date';
    this.dateRangeFields = ['date', 'dueDate'];
  }

  get findIncludes() {
    return [{
      model: InstallmentDebtDetail,
      as: 'installments',
      attributes: ['id', 'date', 'amount', 'number']
    }];
  }

  calculateInstallmentDate(baseDate, installmentNumber) {
    const date = new Date(baseDate);
    date.setUTCMonth(date.getUTCMonth() + (installmentNumber - 1));
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async create(data, reqUser, { transaction } = {}) {
    if (!transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.create(data, reqUser, { transaction });
      });
    }

    data.ownerUserId = reqUser.id;

    // Crear el InstallmentDebt
    const installmentDebt = await super.create(data, reqUser, { transaction });

    // Generar cuotas automáticamente
    const amountPerInstallment = (parseFloat(data.totalAmount) / data.quotasCount).toFixed(2);
    const installmentsData = [];

    for (let i = 1; i <= data.quotasCount; i++) {
      const installmentDate = this.calculateInstallmentDate(data.dueDate, i);
      installmentsData.push({
        date: installmentDate,
        amount: parseFloat(amountPerInstallment),
        number: String(i),
        installmentDebtId: installmentDebt.id,
        debtorId: data.debtorId,
        ownerUserId: reqUser.id,
        createdBy: reqUser.id,
        updatedBy: reqUser.id
      });
    }

    await InstallmentDebtDetail.bulkCreate(installmentsData, { transaction });

    return await InstallmentDebt.findByPk(installmentDebt.id, {
      include: this.findIncludes,
      transaction
    });
  }
}

module.exports = new InstallmentDebtService();
