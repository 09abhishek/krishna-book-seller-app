const httpStatus = require("http-status");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const { publicationService } = require("../services");

const getAllPublication = catchAsync(async (req, res) => {
  const className = pick(req.params, ["id"]);
  const response = await publicationService.getAllPublications(className);
  return res.status(httpStatus.OK).send(response);
});

const getPublication = catchAsync(async (req, res) => {
  const publication = pick(req.params, ["id"]);
  const response = await publicationService.getPublication(publication);
  return res.status(httpStatus.OK).send(response);
});

const addPublication = catchAsync(async (req, res) => {
  const response = await publicationService.savePublication(req.body);
  return res.status(httpStatus.OK).send(response);
});

const deletePublication = catchAsync(async (req, res) => {
  const response = await publicationService.deletePublication(req.body.publicationId);
  return res.status(httpStatus.OK).send(response);
});

const updatePublication = catchAsync(async (req, res) => {
  const response = await publicationService.updatePublication(req.body);
  return res.status(httpStatus.OK).send(response);
});
module.exports = {
  getAllPublication,
  getPublication,
  addPublication,
  deletePublication,
  updatePublication,
};
