const express = require("express");
const multer = require("multer");
const validate = require("../../middlewares/validate");
const bookValidation = require("../../validations/book.validation");
const bookController = require("../../controllers/book.controller");
const auth = require("../../middlewares/auth");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/class/:id", auth("getBooks"), validate(bookValidation.getBookByClass), bookController.getBooks);
router.get("/", auth("getAllBooks"), validate(bookValidation.getAllBooks), bookController.getAllBooks);
router.post("/", auth("addBooks"), validate(bookValidation.addBook), bookController.addBook);
router.delete("/", auth("deleteBooks"), validate(bookValidation.deleteBook), bookController.deleteBook);
router.put("/", auth("updateBooks"), validate(bookValidation.updateBooks), bookController.updateBook);
router.post("/upload-file", upload.single("file"), bookController.fileUpload);

module.exports = router;
