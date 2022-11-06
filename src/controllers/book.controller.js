const httpStatus = require("http-status");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const { bookService } = require("../services");

const getAllBooks = catchAsync(async (req, res) => {
  const className = pick(req.params, ["id"]);
  const response = await bookService.getAllBooks(className);
  return res.status(httpStatus.OK).send(response);
});

const getBooks = catchAsync(async (req, res) => {
  const className = pick(req.params, ["id"]);
  const response = await bookService.getBooksByClass(className);
  return res.status(httpStatus.OK).send(response);
});

const addBook = catchAsync(async (req, res) => {
  const response = await bookService.saveBook(req.body);
  return res.status(httpStatus.OK).send(response);
});

const deleteBook = catchAsync(async (req, res) => {
  const response = await bookService.deleteBookById(req.body.bookId);
  return res.status(httpStatus.OK).send(response);
});

const updateBook = catchAsync(async (req, res) => {
  const response = await bookService.updateBookDetails(req.body);
  return res.status(httpStatus.OK).send(response);
});
module.exports = {
  getAllBooks,
  getBooks,
  addBook,
  deleteBook,
  updateBook,
};
