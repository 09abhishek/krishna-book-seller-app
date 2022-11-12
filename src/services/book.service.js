const moment = require("moment");
const httpStatus = require("http-status");
const Book = require("../models/Book");
const Publication = require("../models/Publication");
const { handleResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/ApiError");

const saveBook = async (body) => {
  if (!body.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Body must contain minimum one structured object");
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
  Publication.hasMany(Book, { foreignKey: "publication_id", onDelete: "NO ACTION", onUpdate: "NO ACTION" });
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
  const bookIds = body.map((book) => book.id);
  const response = await Book.findAll({
    where: {
      id: bookIds,
    },
  });

  if (body.length !== response.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Book Ids entries doesnt exists or invalid");
  }

  const fields = {
    id: "id",
    name: "name",
    stdClass: "class",
    publicationId: "publication_id",
    mrp: "mrp",
    netPrice: "net_price",
    quantity: "quantity",
  };

  const bookList = body.map((book) => {
    const obj = {};
    for (const item in book) {
      obj[fields[item]] = book[item];
    }
    return obj;
  });

  const promises = bookList.map((book) => {
    console.log("update Payload : ", book);
    return Book.update(book, { where: { id: book.id } });
  });
  // resolve all the db calls at once
  await Promise.all(promises);

  if (!promises || !promises.length) {
    return handleResponse("error", null, "Something went wrong", "updateBook");
  }
  return handleResponse("success", [], "Data Updated successfully", "updateBookSuccess");
};

module.exports = {
  getAllBooks,
  saveBook,
  getBooksByClass,
  deleteBookById,
  updateBookDetails,
};
