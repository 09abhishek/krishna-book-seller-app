const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { handleResponse } = require("../utils/responseHandler");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  return User.create(userBody);
};

const queryUsers = async () => {
  const response = await User.findAll({ raw: true });
  return handleResponse("success", [response], "Data Fetched Successfully");
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, { raw: true });
  if (user) {
    delete user.password;
    return handleResponse("success", [user], "Data Fetched Successfully");
  }
  return handleResponse("error", [], "");
};

const getUsersList = async () => {
  const users = await User.findAll({ raw: true });
  if (users) {
    const response = users.map((user) => {
      // eslint-disable-next-line no-param-reassign
      delete user.password;
      return user;
    });
    return handleResponse("success", response, "Data Fetched Successfully");
  }
  return handleResponse("error", [], "");
};

/**
 * Get user by email/username
 * @returns {Promise<User>}
 * @param username
 */
const getUserByUserName = async (username) => {
  return User.findOne({ where: { username }, raw: true });
};

/**
 * Update user by id
 * @param userId
 * @param {Object} body
 * @returns {Promise<{data, message: *, status: *}|{data, message: *, status: *}>}
 */

// if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
//   throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
// }

const updateUserById = async (userId, body) => {
  if (body.password !== body.confirmPassword) {
    throw new ApiError(httpStatus.NOT_FOUND, "Password and ConfirmPassword doesnt match");
  } else {
    const user = await User.findByPk(userId, { raw: true });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(body.password, salt);
    const payload = {};
    payload.password = hashedPass;
    if (body.userType) {
      payload.user_type = body.userType;
    }
    await User.update(payload, { where: { id: userId } });
    return handleResponse("success", [], "User Info Updated Successfully", "passwordUpdated");
  }
};

/**
 * Delete user by id
 * @returns {Promise<{data, message: *, status: *}|{data, message: *, status: *}>}
 * @param userId
 */
const deleteUser = async (userId) => {
  const result = await User.destroy({
    where: {
      id: userId,
    },
  });
  const message = result ? "User deleted successfully" : "User Ids not found or invalid";
  const status = result ? "success" : "error";
  if (result) {
    return handleResponse(status, [result], message, "delete");
  }
  return handleResponse(status, null, message, "delete");
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUsersList,
  getUserByUserName,
  updateUserById,
  deleteUser,
};
