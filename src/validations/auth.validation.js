const Joi = require("joi");
const { password } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    email: Joi.string().optional().email(),
    password: Joi.string().required().custom(password),
    username: Joi.string().min(3).max(10).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().optional(),
    userType: Joi.string().required(),
    mobileNum: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const getBook = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const addBook = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    class: Joi.string().valid(
      "infant",
      "nursery",
      "prep",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve"
    ),
    publication_id: Joi.number().required(),
    price: Joi.number().required(),
    year: Joi.string().required(),
  }),
};

const deleteBook = {
  body: Joi.object().keys({
    book_id: Joi.array().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getBook,
  addBook,
  deleteBook,
};
