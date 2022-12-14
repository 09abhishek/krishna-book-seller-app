const httpStatus = require("http-status");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const { billingService, bookService, publicationService } = require("../services");

const submitInvoice = catchAsync(async (req, res) => {
  const body = pick(req.body, [
    "name",
    "stdClass",
    "fatherName",
    "billParticulars",
    "totalAmount",
    "totalNetAmount",
    "address",
    "mobileNum",
    "year",
    "date",
  ]);
  const response = await billingService.saveInvoice(body);
  return res.status(httpStatus.OK).send(response);
});

const getInvoiceById = catchAsync(async (req, res) => {
  const invoice = pick(req.params, ["id"]);
  const response = await billingService.fetchInvoiceById(invoice.id);
  return res.status(httpStatus.OK).send(response);
});

const deleteInvoice = catchAsync(async (req, res) => {
  const invoice = pick(req.body, ["invoiceId"]);
  const response = await billingService.deleteInvoice(invoice.invoiceId);
  return res.status(httpStatus.OK).send(response);
});

const searchInvoice = catchAsync(async (req, res) => {
  const date = pick(req.query, ["from", "to"]);
  const response = await billingService.findInvoiceByDate(date.from, date.to, "date");
  return res.status(httpStatus.OK).send(response);
});

const getGrandTotalReport = catchAsync(async (req, res) => {
  const date = pick(req.query, ["from", "to"]);
  const response = await billingService.grandTotalReport(date.from, date.to, "date");
  return res.status(httpStatus.OK).send(response);
});

const searchInvoiceByNum = catchAsync(async (req, res) => {
  const bill = pick(req.params, ["billNum"]);
  const response = await billingService.findInvoice(bill.billNum, "num");
  return res.status(httpStatus.OK).send(response);
});

const searchInvoiceByName = catchAsync(async (req, res) => {
  const bill = pick(req.params, ["name"]);
  const response = await billingService.findInvoice(bill.name, "name");
  return res.status(httpStatus.OK).send(response);
});

const billCounts = catchAsync(async (req, res) => {
  const response = await billingService.getCountByClass();
  return res.status(httpStatus.OK).send(response);
});

const updateInvoice = catchAsync(async (req, res) => {
  const bill = pick(req.params, ["invoiceId"]);
  const response = await billingService.updateInvoiceDetails(bill.invoiceId, req.body);
  return res.status(httpStatus.OK).send(response);
});

const getLastBillNumber = catchAsync(async (req, res) => {
  const response = await billingService.fetchBillNumber();
  return res.status(httpStatus.OK).send(response);
});

const getLatestInvoice = catchAsync(async (req, res) => {
  const response = await billingService.fetchLatestInvoices();
  return res.status(httpStatus.OK).send(response);
});

const exportData = catchAsync(async (req, res) => {
  const query = pick(req.query, ["type"]);
  let response = [];
  switch (query.type) {
    case "daily-collection":
      response = await billingService.findInvoiceByDate("", "", "all");
      break;
    case "grand-collection":
      response = await billingService.grandTotalReport("", "", "all");
      break;
    case "book":
      response = await bookService.getAllBooks();
      break;
    case "publication":
      response = await publicationService.getAllPublications();
      break;
    default:
      response = [];
      break;
  }
  return res.status(httpStatus.OK).send(response);
});

module.exports = {
  submitInvoice,
  getInvoiceById,
  deleteInvoice,
  searchInvoice,
  getGrandTotalReport,
  searchInvoiceByNum,
  searchInvoiceByName,
  getLatestInvoice,
  billCounts,
  updateInvoice,
  getLastBillNumber,
  exportData,
};
