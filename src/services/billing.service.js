const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const Billing = require("../models/Billing");
const { handleResponse } = require("../utils/responseHandler");

/**
 * Create a user
 * @param {any} body
 * @returns {Promise<User>}
 */
const saveInvoice = async (body) => {
  const invoiceId = uuidv4();
  let data = await Billing.create({
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
  if (data && data.length) {
    data = data.dataValues.invoice_id;
  }
  return handleResponse("success", data, "Invoice saved Successfully", "invoice");
};

/**
 * Get Invoice by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const fetchInvoiceById = async (id) => {
  let invoice = await Billing.findOne({ where: { invoice_id: id } });
  if (!invoice) {
    return handleResponse("error", null, "Invoice not found", "invoiceNotFound");
  }
  const invoiceNum = String(invoice.id).padStart(6, "0");
  invoice = { ...invoice.dataValues, id: invoiceNum };
  return handleResponse("success", [invoice], "Data Fetched Successfully");
};

/**
 * Delete invoice by ids
 * @returns {Promise<User>}
 * @param invoiceIds
 */
const deleteInvoice = async (invoiceIds) => {
  const data = await Billing.destroy({
    where: {
      invoice_id: invoiceIds,
    },
  });
  const message = data ? "Invoice deleted successfully" : "Invoice Ids are not valid";
  const status = data ? "success" : "error";
  return handleResponse(status, [], message, "delete");
};

const findInvoiceByDate = async (fromDate, toDate) => {
  const list = await Billing.findAll(
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

  const invoiceList = list.map((invoice) => {
    const invoiceNum = String(invoice.id).padStart(6, "0");
    return { ...invoice.dataValues, id: invoiceNum };
  });
  return handleResponse("success", invoiceList, "Data Fetched Successfully");
};

const findInvoiceByNumber = async (billNum) => {
  const data = await Billing.findAll(
    {
      where: {
        id: { [Op.like]: `%${billNum}%` },
      },
    },
    { raw: true }
  );

  const invoiceList = data.map((invoice) => {
    const invoiceNum = String(invoice.id).padStart(6, "0");
    return { ...invoice.dataValues, id: invoiceNum };
  });
  return handleResponse("success", invoiceList, "Result Fetched Successfully");
};

const fetchBillNumber = async () => {
  let data = await Billing.findAll({
    attributes: ["id"],
    order: [["id", "DESC"]],
    limit: 1,
  });
  if (data && data.length) {
    data = String(parseInt([data[0].id], 10) + 1).padStart(6, "0");
  } else {
    data = String(1).padStart(6, "0");
  }
  return handleResponse("success", [data], "Result Fetched Successfully");
};

const updateInvoiceDetails = async (invoiceId, billingData) => {
  const foundItem = await Billing.findOne({ where: { invoice_id: invoiceId } });
  if (!foundItem) {
    return handleResponse("error", null, "Invoice not found", "invoiceNotFound");
  }
  await Billing.update(
    {
      name: billingData.name,
      class: billingData.stdClass,
      father_name: billingData.fatherName,
      address: billingData.address,
      mobile_num: billingData.mobileNum,
      bill_data: billingData.billParticulars,
      total_amount: billingData.totalAmount,
    },
    { where: { invoice_id: invoiceId } }
  );
  return handleResponse("success", [], "Invoice Updated Successfully", "invoiceUpdated");
};

module.exports = {
  saveInvoice,
  fetchInvoiceById,
  deleteInvoice,
  findInvoiceByDate,
  findInvoiceByNumber,
  updateInvoiceDetails,
  fetchBillNumber,
};
