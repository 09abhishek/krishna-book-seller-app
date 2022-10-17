const httpStatus = require("http-status");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const Billing = require("../models/Billing");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

/**
 * Create a user
 * @param {any} body
 * @returns {Promise<User>}
 */
const saveInvoice = async (body) => {
  const invoiceId = uuidv4();
  return Billing.create({
    invoice_id: invoiceId,
    name: body.name,
    class: body.stdClass,
    father_name: body.fatherName ? body.fatherName : null,
    address: body.address ? body.address : null,
    mobile_num: body.mobileNum ? body.mobileNum : null,
    bill_data: body.billParticulars,
    total_amount: body.totalAmount,
    year: moment().year(),
    date: moment().toISOString(),
  });
};

/**
 * Get Invoice by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const fetchInvoiceById = async (id) => {
  return Billing.findOne({ where: { invoice_id: id } });
};

/**
 * Delete invoice by ids
 * @returns {Promise<User>}
 * @param invoiceIds
 */
const deleteInvoice = async (invoiceIds) => {
  return Billing.destroy({
    where: {
      invoice_id: invoiceIds,
    },
  });
};

const findInvoiceByDate = async (fromDate, toDate) => {
  return Billing.findAll(
    {
      where: {
        [Op.and]: [
          sequelize.where(sequelize.fn("date", sequelize.col("date")), ">=", fromDate),
          sequelize.where(sequelize.fn("date", sequelize.col("date")), "<=", toDate),
        ],
      },
    },
    { raw: true }
  );
};

module.exports = {
  saveInvoice,
  fetchInvoiceById,
  deleteInvoice,
  findInvoiceByDate,
};
