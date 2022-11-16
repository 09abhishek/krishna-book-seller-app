const Joi = require("joi");

const getInvoice = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const addInvoice = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    stdClass: Joi.string().valid(
      "infant",
      "nursery",
      "prep",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve"
    ),
    fatherName: Joi.string(),
    billParticulars: Joi.array().required(),
    totalAmount: Joi.number(),
    address: Joi.string().optional(),
    mobileNum: Joi.number().optional(),
  }),
};

const deleteInvoice = {
  body: Joi.object().keys({
    invoiceId: Joi.array().required(),
  }),
};

const searchInvoice = {
  query: Joi.object().keys({
    from: Joi.date().required(),
    to: Joi.date().required(),
  }),
};

const searchInvoiceByNum = {
  params: Joi.object().keys({
    billNum: Joi.string().required(),
  }),
};
const searchInvoiceByName = {
  params: Joi.object().keys({
    name: Joi.string().required().min(3),
  }),
};

const getBillNum = {};

const updateInvoice = {
  params: Joi.object().keys({
    invoiceId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    stdClass: Joi.string()
      .required()
      .valid(
        "infant",
        "nursery",
        "prep",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve"
      ),
    fatherName: Joi.string(),
    billParticulars: Joi.array().required(),
    previousBillParticulars: Joi.array().optional(),
    totalAmount: Joi.number(),
    address: Joi.string().optional(),
    mobileNum: Joi.number().optional(),
  }),
};

module.exports = {
  getInvoice,
  addInvoice,
  deleteInvoice,
  searchInvoice,
  searchInvoiceByNum,
  searchInvoiceByName,
  updateInvoice,
  getBillNum,
};
