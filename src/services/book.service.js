const moment = require("moment");
const Book = require("../models/Book");
const Publication = require("../models/Publication");
const { handleResponse } = require("../utils/responseHandler");

const saveBook = async (body) => {
  if (!body.length) {
    return handleResponse("error", null, "Body must contain minimum one structured object", "addBookMinimumLimit");
  }
  const bookList = body.map((book) => {
    return {
      name: book.name,
      class: book.stdClass,
      publication_id: book.publicationId,
      mrp: book.mrp,
      year: moment().year(),
      net_price: book.net_price,
      quantity: book.quantity,
    };
  });
  const response = await Book.bulkCreate(bookList);
  if (response && response.length) {
    return handleResponse("success", [response.length], "Books Added Successfully", "addBook");
  }
  return handleResponse("error", null, "Something went wrong", "addBookError");
};

const getAllBooks = async () => {
  Publication.hasMany(Book, { foreignKey: "publication_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
  Book.belongsTo(Publication, { foreignKey: "publication_id", onDelete: "NO ACTION", onUpdate: "NO ACTION" });

  const bookList = await Book.findAll({ attributes: { exclude: ["created_at", "updated_at"] }, include: Publication });
  if (!bookList || !bookList.length) {
    return handleResponse("error", [], "Books not found", "bookNotFound");
  }
  return handleResponse("success", bookList, "Data Fetched Successfully");
};

const getBooksByClass = async (className) => {
  const where = {
    year: moment().year(),
    class: className.id,
  };
  Publication.hasMany(Book, { foreignKey: "publication_id" });
  Book.belongsTo(Publication, { foreignKey: "publication_id" });

  const bookList = await Book.findAll({
    attributes: { exclude: ["created_at", "updated_at"] },
    include: Publication,
    where,
  });
  if (!bookList || !bookList.length) {
    return handleResponse("error", [], "Books not found", "bookNotFound");
  }
  return handleResponse("success", bookList, "Data Fetched Successfully");
};

/**
 * Delete books by ids
 * @returns {Promise<{data, message: *, status: *}|{data, message: string, status: *}>}
 * @param bookIds
 */
const deleteBookById = async (bookIds) => {
  const result = await Book.destroy({
    where: {
      id: bookIds,
    },
  });
  const message = result ? "Books deleted successfully" : "Books Ids not found or invalid";
  const status = result ? "success" : "error";
  if (result) {
    return handleResponse(status, [result], message, "delete");
  }
  return handleResponse(status, null, message, "delete");
};

const updateBookDetails = async (body) => {
  const result = [];
  const bookIds = body.map((book) => book.id);
  const response = await Book.findAll({
    where: {
      id: bookIds,
    },
  });

  if (body.length !== response.length) {
    return handleResponse("error", result, "Book Ids entries doesnt exists or invalid", "updateBook");
  }

  const bookList = body.map((book) => {
    return {
      id: book.id,
      name: book.name,
      class: book.stdClass,
      publication_id: book.publicationId,
      mrp: book.mrp,
      year: moment().year(),
      net_price: book.netPrice,
      quantity: book.quantity,
    };
  });
  // eslint-disable-next-line no-restricted-syntax
  for await (const book of bookList) {
    const res = await Book.update(book, { where: { id: book.id } });
    result.push(res[0]);
  }
  if (!result || !result.length) {
    return handleResponse("error", result, "Something went wrong", "updateBook");
  }
  return handleResponse("success", [result], "Data Updated successfully", "updateBookSuccess");
};

module.exports = {
  getAllBooks,
  saveBook,
  getBooksByClass,
  deleteBookById,
  updateBookDetails,
};
