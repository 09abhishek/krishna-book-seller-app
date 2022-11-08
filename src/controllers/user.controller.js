const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ["name", "role"]);
  // const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers();
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const response = await userService.getUserById(req.params.id);
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return res.status(httpStatus.OK).send(response);
});

const getAllUsers = catchAsync(async (req, res) => {
  const response = await userService.getUsersList();
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return res.status(httpStatus.OK).send(response);
});

const updateUser = catchAsync(async (req, res) => {
  const response = await userService.updateUserById(req.params.id, req.body);
  return res.status(httpStatus.OK).send(response);
});

const deleteUser = catchAsync(async (req, res) => {
  const response = await userService.deleteUser(req.body.userId);
  return res.status(httpStatus.OK).send(response);
});

module.exports = {
  createUser,
  getUsers,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
