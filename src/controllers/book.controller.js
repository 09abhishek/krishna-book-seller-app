const httpStatus = require("http-status");
const moment = require("moment");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const { bookService } = require("../services");
const Book = require("../models/Book");

const getBooks = catchAsync(async (req, res) => {
  const className = pick(req.params, ["id"]);
  const where = {
    year: moment().year(),
    class: className.id,
  };
  const books = await Book.findAll({ where });
  res.status(httpStatus.OK).send({
    year: moment().year(),
    class: className.id,
    book: books,
  });
});

const addBook = catchAsync(async (req, res) => {
  res.send("addBook");
});

const deleteBook = catchAsync(async (req, res) => {
  await bookService.deleteUserById(req.params.userId);
  res.send("deleteBook");
});

module.exports = {
  getBooks,
  addBook,
  deleteBook,
};
