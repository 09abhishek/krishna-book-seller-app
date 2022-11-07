const moment = require("moment");
const Publication = require("../models/Publication");
const { handleResponse } = require("../utils/responseHandler");

const savePublication = async (body) => {
  if (!body.length) {
    return handleResponse(
      "error",
      null,
      "Body must contain minimum one structured object",
      "addPublicationListMinimumLimit"
    );
  }
  const bookList = body.map((publication) => {
    return {
      name: publication.name,
      year: moment().year(),
    };
  });
  const response = await Publication.bulkCreate(bookList);
  if (response && response.length) {
    return handleResponse("success", [response.length], "Publications Added Successfully", "addPublication");
  }
  return handleResponse("error", null, "Something went wrong", "addBookError");
};

const getAllPublications = async () => {
  const publicationList = await Publication.findAll();
  if (!publicationList || !publicationList.length) {
    return handleResponse("error", [], "Publication not found", "publicationNotFound");
  }
  return handleResponse("success", publicationList, "Data Fetched Successfully");
};

const getPublication = async (publication) => {
  const where = {
    year: moment().year(),
    id: publication.id,
  };
  const publicationRes = await Publication.findAll({ where });
  if (!publicationRes || !publicationRes.length) {
    return handleResponse("error", [], "Publication not found", "publicationListNotFound");
  }
  const response = publicationRes[0].dataValues;
  return handleResponse("success", [response], "Data Fetched Successfully");
};

const deletePublication = async (pubIds) => {
  const result = await Publication.destroy({
    where: {
      id: pubIds,
    },
  });
  const message = result ? "Publication deleted successfully" : "Publication Ids not found or invalid";
  const status = result ? "success" : "error";
  if (result) {
    return handleResponse(status, [result], message, "delete");
  }
  return handleResponse(status, null, message, "delete");
};

const updatePublication = async (body) => {
  const result = [];
  const pubIds = body.map((pub) => pub.id);
  const response = await Publication.findAll({
    where: {
      id: pubIds,
    },
  });

  if (body.length !== response.length) {
    return handleResponse("error", result, "Publication Ids entries doesnt exists or invalid", "updatePublication");
  }

  const publicationList = body.map((book) => {
    return {
      id: book.id,
      name: book.name,
      year: moment().year(),
    };
  });
  // eslint-disable-next-line no-restricted-syntax
  for await (const pub of publicationList) {
    const res = await Publication.update(pub, { where: { id: pub.id } });
    result.push(res[0]);
  }
  if (!result || !result.length) {
    return handleResponse("error", result, "Something went wrong", "updateBook");
  }
  return handleResponse("success", [result], "Data Updated successfully", "updatePublication");
};

module.exports = {
  getAllPublications,
  getPublication,
  savePublication,
  updatePublication,
  deletePublication,
};