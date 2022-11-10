const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const httpStatus = require("http-status");
const Billing = require("../models/Billing");
const Book = require("../models/Book");
const { handleResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/ApiError");

/**
 * Create a user
 * @param {any} body
 * @returns {Promise<{data, message: *, status: *}|{data, message: *, status: *}>}
 */
const saveInvoice = async (body) => {
  const invoiceId = uuidv4();

  const { billParticulars } = body;
  const bookIds = billParticulars.map((book) => book.id);
  const where = { class: body.stdClass };
  const booksByClass = await Book.findAll({ attributes: ["id", "quantity", "name"], where, raw: true });

  const checkBooksResponse = await Book.findAll({ where: { id: bookIds } });
  const dbCount = {};

  booksByClass.forEach((item) => {
    if (item.quantity === 0 || item.quantity < 0) {
      throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, "Book stock not available");
    }
    dbCount[item.id] = item.quantity;
  });

  if (bookIds.length !== checkBooksResponse.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Book ids entries doesnt exists or invalid");
  } else {
    billParticulars.forEach((item) => {
      if (dbCount[item.id]) {
        const updatedCount = dbCount[item.id] - item.quantity;
        if (updatedCount < 0) {
          throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, "Not enough book stock to process the request");
        }
        dbCount[item.id] = updatedCount;
      }
    });
  }
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

  Object.entries(dbCount).forEach(([key, value]) => {
    return Book.update({ quantity: value }, { where: { id: key } });
  });

  // loop over the inputs and return an array of promises, one for each update
  // const promises = billParticulars.map((item) => {
  //   return Book.update({ quantity: item.quantity }, { where: { id: item.id } });
  // });
  // resolve all the db calls at once
  //  await Promise.all(promises);

  if (data) {
    data = data.dataValues.invoice_id;
  }
  return handleResponse("success", [data], "Invoice saved Successfully", "invoice");
};

/**
 * Get Invoice by id
 * @param {ObjectId} id
 * @returns {Promise<{data, message: *, status: *}|{data, message: string, status: *}>}
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
 * @returns {Promise<{data, message: *, status: *}|{data, message: string, status: *}>}
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
  let sumOfTotal = 0.0;
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
    sumOfTotal += parseFloat(invoice.total_amount);
    return { ...invoice.dataValues, id: invoiceNum };
  });

  const response = {
    invoice: invoiceList,
    sum_of_totals: sumOfTotal.toFixed(2),
  };
  if (invoiceList.length) {
    return handleResponse("success", response, "Data Fetched Successfully", "fetchedInvoice");
  }
  return handleResponse("error", response, "No Data found", "fetchedInvoice");
};

const grandTotalReport = async (fromDate, toDate) => {
  let sumOfTotal = 0.0;
  const list = await Billing.findAll(
    {
      attributes: [
        [sequelize.fn("sum", sequelize.col("total_amount")), "total_amount"],
        [sequelize.fn("date_format", sequelize.col("date"), "%d-%m-%Y"), "date"],
        [sequelize.fn("count", sequelize.col("date")), "no_of_bills"],
      ],
      where: {
        [Op.and]: [
          sequelize.where(sequelize.fn("date", sequelize.col("date")), ">=", fromDate),
          sequelize.where(sequelize.fn("date", sequelize.col("date")), "<=", toDate),
        ],
      },
      group: ["date"],
    },
    { raw: true }
  );

  list.forEach((data) => {
    sumOfTotal += parseFloat(data.total_amount);
  });
  const response = {
    invoice: list,
    sum_of_totals: sumOfTotal.toFixed(2),
  };

  if (list.length) {
    return handleResponse("success", response, "Data Fetched Successfully", "fetchedGrandTotal");
  }
  return handleResponse("error", response, "No Data found", "errorGrandTotal");
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
    throw new ApiError(httpStatus.NOT_FOUND, "Invoice not found");
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

  // Reduce or Increase the count based on the book Id:
  // Old data and new data is needed to calculate.

  return handleResponse("success", [], "Invoice Updated Successfully", "invoiceUpdated");
};

module.exports = {
  saveInvoice,
  fetchInvoiceById,
  grandTotalReport,
  deleteInvoice,
  findInvoiceByDate,
  findInvoiceByNumber,
  updateInvoiceDetails,
  fetchBillNumber,
};
