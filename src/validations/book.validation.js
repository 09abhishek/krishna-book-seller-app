const Joi = require("joi");

const getAllBooks = {};

const getBookByClass = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const addBook = {
  body: Joi.array()
    .required()
    .items({
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
      publicationId: Joi.number().required(),
      netPrice: Joi.number().required(),
      mrp: Joi.number().required(),
      quantity: Joi.number().required(),
      year: Joi.number().optional(),
    }),
};

const updateBooks = {
  body: Joi.array()
    .required()
    .items({
      id: Joi.number().required(),
      name: Joi.string().optional(),
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
      publicationId: Joi.number().optional(),
      netPrice: Joi.number().optional(),
      mrp: Joi.number().optional(),
      quantity: Joi.number().optional(),
      year: Joi.number().optional(),
    })
    .min(1),
};

const deleteBook = {
  body: Joi.object().keys({
    bookId: Joi.array().required().items(Joi.number()),
  }),
};

module.exports = {
  getAllBooks,
  getBookByClass,
  addBook,
  deleteBook,
  updateBooks,
};
