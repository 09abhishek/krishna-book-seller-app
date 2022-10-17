const httpStatus = require("http-status");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const { billingService } = require("../services");

const submitInvoice = catchAsync(async (req, res) => {
  const body = pick(req.body, [
    "name",
    "stdClass",
    "fatherName",
    "billParticulars",
    "totalAmount",
    "address",
    "mobileNum",
    "year",
    "date",
  ]);
  const invoice = await billingService.saveInvoice(body);
  if (invoice) {
    const id = invoice.dataValues.invoice_id;
    res.status(httpStatus.CREATED).send({
      invoiceId: id,
      message: "Invoice submitted Successfully",
    });
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Something went wrong!",
    });
  }
});

const getInvoice = catchAsync(async (req, res) => {
  res.send("result");
});

const getInvoiceById = catchAsync(async (req, res) => {
  const invoice = pick(req.params, ["id"]);
  const result = await billingService.fetchInvoiceById(invoice.id, { raw: true });
  if (!result) {
    return res.send({ data: [] });
  }
  res.send({ data: [result] || [] });
});

// https://gist.github.com/igorjs/407ffc3126f6ef2a6fe8f918a0673b59

// {
//   "status": "success",
//   "data": {
//     /* Application-specific data would go here. */
//   },
//   "message": null /* Or optional success message */
// }
// Failed request:
//
// {
//   "status": "error",
//   "data": null, /* or optional error payload */
//   "message": "Error xyz has occurred"
// }

const deleteInvoice = catchAsync(async (req, res) => {
  const invoice = pick(req.body, ["invoiceId"]);
  const result = await billingService.deleteInvoice(invoice.invoiceId, { raw: true });
  if (!result) {
    return res.status(httpStatus.NOT_FOUND).send({ message: "Invoice Ids are not valid" });
  }
  res.send({ message: "Invoice deleted successfully" });
});

const searchInvoice = catchAsync(async (req, res) => {
  const date = pick(req.query, ["from", "to"]);
  const result = await billingService.findInvoiceByDate(date.from, date.to);
  if (!result) {
    return res.status(httpStatus.OK).send({ data: [] });
  }
  res.send({ data: result });
});

module.exports = {
  submitInvoice,
  getInvoice,
  getInvoiceById,
  deleteInvoice,
  searchInvoice,
};
