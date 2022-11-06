const express = require("express");
const validate = require("../../middlewares/validate");
const publicationValidation = require("../../validations/publication.validation");
const publicationController = require("../../controllers/publication.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.get(
  "/",
  auth("getPublications"),
  validate(publicationValidation.getPublications),
  publicationController.getAllPublication
);
router.get(
  "/:id",
  auth("getPublication"),
  validate(publicationValidation.getPublication),
  publicationController.getPublication
);
router.post(
  "/",
  auth("addPublications"),
  validate(publicationValidation.addPublications),
  publicationController.addPublication
);
router.delete(
  "/",
  auth("deletePublications"),
  validate(publicationValidation.deletePublications),
  publicationController.deletePublication
);
router.put(
  "/",
  auth("updatePublication"),
  validate(publicationValidation.updatePublication),
  publicationController.updatePublication
);

module.exports = router;
