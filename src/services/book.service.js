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
      class: book.class,
      publication_id: book.publicationId,
      mrp: book.mrp,
      year: book.year ? book.year : moment().year(),
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
  const response = [];
  const publicationHashmap = {};
  let bookList = [];
  let publicationListFromDB = [];
  const requiredKeys = ["class", "name", "publication", "quantity", "netPrice", "mrp", "year"];
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No file provided");
  } else {
    const filePath = `uploads/${req.file.filename}`;

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const wb = xlsx.readFile(filePath);

    const sheetName = wb.SheetNames[0];
    const sheetValue = wb.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheetValue);

    console.log("data extracted from xls file", jsonData);

    console.log("checking the first record if the file is valid : ", jsonData[0]);
    if (!jsonData[0]) {
      throw new ApiError(httpStatus.BAD_REQUEST, "The file is empty or does not have valid data. Please check sample file and try again");
    } else {
      const checkAllKeys = requiredKeys.every((i) => jsonData[0].hasOwnProperty(i));
      if (!checkAllKeys) {
        throw new ApiError(httpStatus.BAD_REQUEST, "The file does not have all the required column fields. Please check sample file and try again");
      }
    }

    let publicationList = jsonData.map((data) => {
      return data.publication;
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

      bookList = jsonData.map((data) => {
        return { ...data, publicationId: publicationHashmap[data.publication] };
      });

      const bookResponse = await saveBook(bookList);

      if (bookResponse.status === "error") {
        await Publication.truncate({ cascade: true, restartIdentity: true });
      } else {
        response.push({ publicationUploaded: publicationResponse.data, booksUploaded: bookResponse.data });
      }
      fs.remove(filePath);
    } else {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      await Publication.truncate({ cascade: true, restartIdentity: true });
      return handleResponse("error", null, "Failed to upload Data - Invalid file");
    }
    return handleResponse("success", response, "File Uploaded Successfully", "fileUploadSuccess");
  }
};

const getAllBooks = async () => {
  Book.belongsTo(Publication, { foreignKey: "publication_id", onDelete: "NO ACTION", onUpdate: "NO ACTION" });
  Publication.hasMany(Book, { foreignKey: "publication_id", onDelete: "NO ACTION", onUpdate: "NO ACTION" });

  const bookList = await Book.findAll({ attributes: { exclude: ["created_at", "updated_at"] }, include: Publication });
  if (!bookList || !bookList.length) {
    return handleResponse("error", [], "Books not found", "bookNotFound");
  }
  return handleResponse("success", bookList, "Data Fetched Successfully");
};

const getBooksByClass = async (className) => {
  const where = {
    // year: moment().year(),
    class: className.id,
  };
  Book.belongsTo(Publication, { foreignKey: "publication_id" });
  Publication.hasMany(Book, { foreignKey: "publication_id" });

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
    class: "class",
    publicationId: "publication_id",
    mrp: "mrp",
    netPrice: "net_price",
    quantity: "quantity",
  };

  const bookList = body.map((book) => {
    const obj = {};
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
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
