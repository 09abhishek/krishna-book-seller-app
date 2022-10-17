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

module.exports = {
  getInvoice,
  addInvoice,
  deleteInvoice,
  searchInvoice,
};
