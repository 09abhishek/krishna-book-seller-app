const Joi = require("joi");

const getPublication = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const getPublications = {};

const addPublications = {
  body: Joi.array().required().items({
    name: Joi.string().required(),
  }),
};

const updatePublication = {
  body: Joi.array().required().items({
    id: Joi.number().required(),
    name: Joi.string().required(),
  }),
};

const deletePublications = {
  body: Joi.object().keys({
    publicationId: Joi.array().required().items(Joi.number()),
  }),
};

module.exports = {
  getPublication,
  getPublications,
  addPublications,
  updatePublication,
  deletePublications,
};
