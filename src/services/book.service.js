const moment = require("moment");
const httpStatus = require("http-status");
const fs = require("fs-extra");
const xlsx = require("xlsx");
const path = require("path");
const Book = require("../models/Book");
const Publication = require("../models/Publication");
const { handleResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/ApiError");

// eslint-disable-next-line import/no-dynamic-require,security/detect-non-literal-require
const publicationService = require(path.resolve(__dirname, "publication.service.js"));

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
      net_price: book.netPrice,
      quantity: book.quantity,
    };
  });
  console.log("book list for DB", bookList);
  const response = await Book.bulkCreate(bookList);
  if (response && response.length) {
    return handleResponse("success", [response.length], "Books Added Successfully", "addBook");
  }
  return handleResponse("error", null, "Something went wrong", "addBookError");
};

const uploadFromFile = async (req) => {

  let response = [];

  if (!req.file && req.file === "undefined") {
    throw new ApiError(httpStatus.BAD_REQUEST, "No file provided");
  } else {
    console.log(req.file);
    const filePath = `uploads/${req.file.filename}`;

    const wb = xlsx.readFile(filePath);

    const sheetName = wb.SheetNames[0];
    const sheetValue = wb.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheetValue);

    //  const excelData = excelToJson({
    //   sourceFile: filePath,
    //   header: {
    //     row: 2
    //   },
    //   columnToKey : {
    //     "*" : "{{columnHeader}}",
    //   },
    //   sheets: ['Sheet1']
    // });
    // console.log(excelData);

    const publicationHashmap = {};
    let bookList = [];
    let publicationListFromDB = [];

    let publicationList = jsonData.map((data) => {
      return data.publicationId;
    });

    console.log("Before duplicates removal", publicationList);
    console.log("----------After Removing duplicates--------------");
    publicationList = [...new Set(publicationList)];
    console.log(publicationList);
    console.log("-------------------------------------------------");
    const publicationListForDb = publicationList.map((data) => {
      return { name: data, year: moment().year() };
    });

    const publicationResponse = await publicationService.savePublication(publicationListForDb);
    console.log(publicationResponse);
    if (publicationResponse.status === "success") {
      publicationListFromDB = await Publication.findAll({ raw: true });
      publicationListFromDB.forEach((pub) => {
        publicationHashmap[pub.name] = pub.id;
      });
      // console.log(publicationHashmap);
      bookList = jsonData.map((data) => {
        return { ...data, publicationId: publicationHashmap[data.publicationId] };
      });

      response = await saveBook(bookList);
      fs.remove(filePath);
    }
  }
  return handleResponse("success", response, "File Uploaded Successfully");
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
    netPrice: "netPrice",
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
  uploadFromFile,
};
