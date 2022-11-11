const Joi = require("joi");

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    role: Joi.string().required().valid("admin", "super_admin", "accountant"),
  }),
};

const getUser = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};
const getUsers = {};

const updateUser = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().optional().min(5),
    userType: Joi.string().optional().valid("admin", "super_admin", "accountant"),
  }),
};

const deleteUser = {
  body: Joi.object().keys({
    userId: Joi.array().required().items(Joi.number()),
  }),
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};
