const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const billingValidation = require("../../validations/billing.validation");
const billingController = require("../../controllers/billing.controller");

const router = express.Router();

router.post("/invoice", auth("submitInvoice"), validate(billingValidation.addInvoice), billingController.submitInvoice);
router.get("/invoice/:id", auth("getInvoiceById"), validate(billingValidation.getInvoice), billingController.getInvoiceById);
router.delete(
  "/delete-invoice",
  auth("deleteInvoice"),
  validate(billingValidation.deleteInvoice),
  billingController.deleteInvoice
);
router.get("/search", auth("searchInvoice"), validate(billingValidation.searchInvoice), billingController.searchInvoice);
router.get(
  "/grand-total",
  auth("searchInvoice"),
  validate(billingValidation.getBillNum),
  billingController.getGrandTotalReport
);
router.get(
  "/search/bill-num/:billNum",
  auth("searchInvoiceByNum"),
  validate(billingValidation.searchInvoiceByNum),
  billingController.searchInvoiceByNum
);
router.get(
  "/search/name/:name",
  auth("searchInvoiceByName"),
  validate(billingValidation.searchInvoiceByName),
  billingController.searchInvoiceByName
);

router.get("/count", billingController.billCounts);
router.get("/latest-invoices", billingController.getLatestInvoice);

router.put(
  "/invoice/:invoiceId",
  auth("updateInvoice"),
  validate(billingValidation.updateInvoice),
  billingController.updateInvoice
);

router.get("/bill-num", auth("getBillNum"), validate(billingValidation.getBillNum), billingController.getLastBillNumber);
router.get("/export", auth("exportData"), validate(billingValidation.exportData), billingController.exportData);
module.exports = router;
