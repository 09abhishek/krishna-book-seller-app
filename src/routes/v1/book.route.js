const express = require("express");
const validate = require("../../middlewares/validate");
const bookValidation = require("../../validations/book.validation");
const bookController = require("../../controllers/book.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.get("/class/:id", auth("getBooks"), validate(bookValidation.getBookByClass), bookController.getBooks);
router.get("/", auth("getAllBooks"), validate(bookValidation.getAllBooks), bookController.getAllBooks);
router.post("/", auth("addBooks"), validate(bookValidation.addBook), bookController.addBook);
router.delete("/", auth("deleteBooks"), validate(bookValidation.deleteBook), bookController.deleteBook);
router.put("/", auth("updateBooks"), validate(bookValidation.updateBooks), bookController.updateBook);

module.exports = router;
