const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const httpStatus = require("http-status");
const Billing = require("../models/Billing");
const Book = require("../models/Book");
const { handleResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/ApiError");

const manageStockQuantity = async (billParticulars, stdClass, operation) => {
  const finalCalculatedQty = [];
  const bookIds = billParticulars.map((book) => book.id);
  const where = operation === "REDUCE" ? { class: stdClass, id: { [Op.in]: bookIds } } : { id: { [Op.in]: bookIds } };

  console.log("where condition :", where);

  const originalCountFromDB = await Book.findAll({ attributes: ["id", "quantity"], where, raw: true });

  if (bookIds.length !== originalCountFromDB.length) {
    if (operation === "REDUCE") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Class and book's class not matching or Book ids in new bill particulars invalid for : ${operation} Operation`
      );
    } else {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `One or more Book ids in old bill particulars are invalid or doesn't exist in db for : ${operation} Operation`
      );
    }
  }
  const modifyingBookQtyList = billParticulars.map((book) => {
    return {
      id: book.id,
      quantity: book.quantity,
    };
  });

  console.log(`Books List count to ${operation} in db  : `, modifyingBookQtyList);
  console.log(`Books Original count in db  :  `, originalCountFromDB);

  for (let i = 0; i < modifyingBookQtyList.length; i++) {
    if (operation === "REDUCE" || operation === "ROLL_BACK") {
      // minus
      finalCalculatedQty.push({
        id: modifyingBookQtyList[i].id,
        quantity: originalCountFromDB[i].quantity - modifyingBookQtyList[i].quantity,
      });
      if (originalCountFromDB[i].quantity - modifyingBookQtyList[i].quantity < 0) {
        throw new ApiError(
          httpStatus.UNPROCESSABLE_ENTITY,
          "Not enough books quantity in stock. Please check/update the books qty for the given class."
        );
      }
    } else {
      // plus
      finalCalculatedQty.push({
        id: modifyingBookQtyList[i].id,
        quantity: originalCountFromDB[i].quantity + modifyingBookQtyList[i].quantity,
      });
    }
  }
  console.log("final Calculated Qty : ", finalCalculatedQty);

  const promises = finalCalculatedQty.map((item) => {
    return Book.update({ quantity: item.quantity }, { where: { id: item.id } });
  });
  // resolve all the db calls at once
  await Promise.all(promises);
};

const saveInvoice = async (body) => {
  const invoiceId = uuidv4();
  const { billParticulars } = body;
  await manageStockQuantity(billParticulars, body.stdClass, "REDUCE");

  let data = await Billing.create({
    invoice_id: invoiceId,
    name: body.name,
    class: body.stdClass,
    father_name: body.fatherName ? body.fatherName : null,
    address: body.address ? body.address : null,
    mobile_num: body.mobileNum ? body.mobileNum : null,
    bill_data: body.billParticulars,
    total_amount: body.totalAmount,
    total_net_amount: body.totalNetAmount,
    year: moment().year(),
    date: moment().toISOString(),
  });

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
  let sumOfTotalMrp = 0.0;
  let sumOfNetAmt = 0.0;
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
    sumOfTotalMrp += parseFloat(invoice.total_amount);
    sumOfNetAmt += parseFloat(invoice.total_net_amount);
    return { ...invoice.dataValues, id: invoiceNum };
  });

  const response = {
    invoice: invoiceList,
    sum_of_totals: sumOfTotalMrp.toFixed(2),
    sum_of_net_amount: sumOfNetAmt.toFixed(2),
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

const findInvoice = async (searchParam, searchBy) => {
  let condition = {
    id: { [Op.like]: `%${searchParam}%` },
    year: moment().year(),
  };

  if (searchBy === "name") {
    condition = {
      name: sequelize.where(sequelize.fn("LOWER", sequelize.col("name")), "LIKE", `%${searchParam}%`),
      year: moment().year(),
    };
  }
  const data = await Billing.findAll(
    {
      where: condition,
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

const fetchLatestInvoices = async () => {
  console.log('here');
  const data = await Billing.findAll({
    attributes: ["id", "name", "total_amount"],
    order: [["id", "DESC"]],
    limit: 10,
  });

  if (data.length) {
    const invoiceList = data.map((invoice) => {
      const invoiceNum = String(invoice.id).padStart(6, "0");
      return { ...invoice.dataValues, id: invoiceNum };
    });
    return handleResponse("success", invoiceList, "Result Fetched Successfully");
  } else {
    return handleResponse("error", [], "No Data found", "fetchedInvoice");
  }
};

const getCountByClass = async () => {
  let totalInvoice = 0;
  const list = await Billing.findAll(
    {
      attributes: [[sequelize.fn("count", sequelize.col("id")), "no_of_bills"], "class"],
      where: {
        year: moment().year(),
      },
      group: ["class"],
    },
    { raw: true }
  );

  if (list.length) {
    list.forEach((data) => {
      totalInvoice += data.dataValues.no_of_bills;
    });
    const response = {
      invoice: list,
      sum_of_totals: totalInvoice,
    };
    return handleResponse("success", response, "Data Fetched Successfully", "fetchedInvoice");
  }
  return handleResponse("error", [], "No Data found", "fetchedInvoice");
};

const updateInvoiceDetails = async (invoiceId, billingData) => {
  const foundItem = await Billing.findOne({ where: { invoice_id: invoiceId } });
  if (!foundItem) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invoice not found");
  }
  if (billingData.hasOwnProperty("previousBillParticulars")) {
    console.log("-------- Adding books in DB --------");
    await manageStockQuantity(billingData.previousBillParticulars, billingData.stdClass, "ADD");
    console.log("--------Done Adding books in DB --------");
  }
  try {
    console.log("-------- Reducing books from DB -------");
    await manageStockQuantity(billingData.billParticulars, billingData.stdClass, "REDUCE");
    console.log("-------- Done Reducing books in DB -------");
    await Billing.update(
      {
        name: billingData.name,
        class: billingData.stdClass,
        father_name: billingData.fatherName,
        address: billingData.address,
        mobile_num: billingData.mobileNum,
        bill_data: billingData.billParticulars,
        total_amount: billingData.totalAmount,
        total_net_amount: billingData.totalNetAmount,
      },
      { where: { invoice_id: invoiceId } }
    );
    return handleResponse("success", [], "Invoice Updated Successfully", "invoiceUpdated");
  } catch (err) {
    console.log("-------- Error occurred in invoice -------");
    console.log("--------Rolling back Data -------");
    await manageStockQuantity(billingData.previousBillParticulars, billingData.stdClass, "ROLL_BACK");
    console.log("--------Done Rolling back Data -------");
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Not enough books quantity in stock. Please check/update the books qty for the given class."
    );
  }
};

module.exports = {
  saveInvoice,
  fetchInvoiceById,
  grandTotalReport,
  deleteInvoice,
  findInvoiceByDate,
  fetchLatestInvoices,
  findInvoice,
  getCountByClass,
  updateInvoiceDetails,
  fetchBillNumber,
};
