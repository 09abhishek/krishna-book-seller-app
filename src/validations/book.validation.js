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
      net_price: Joi.number().required(),
      mrp: Joi.number().required(),
      quantity: Joi.number().required(),
    }),
};

const updateBooks = {
  body: Joi.array()
    .required()
    .items({
      id: Joi.number().required(),
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
      net_price: Joi.number().required(),
      mrp: Joi.number().required(),
      quantity: Joi.number().required(),
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
