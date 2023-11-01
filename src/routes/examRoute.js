const express = require("express");
const router = express.Router();
const bod = require("body-parser");
const path = require("path");

const examControllers = require("../controllers/examController");
// const verifyToken = require("../middlaware/AuthMiddleware");
const middle = require("../middlaware/AuthMiddleware");

//viren and Naresh Routes
router.get("/form1", examControllers.form1);
router.get("/checkCode", examControllers.validate_code);
router.get("/examGet", examControllers.examGet);
router.post("/examPost", examControllers.examPost);
router.get("/categoryGet", examControllers.categoryGet);
router.get("/pagingGet", examControllers.pagingGet);
router.get("/nextGet", examControllers.nextGet);
router.get("/prevGet", examControllers.prevGet);
router.post("/answerPost", examControllers.answerPost);
router.post("/getAns", examControllers.getAns);
router.get("/endExam", examControllers.endExam);
router.get("/getCategoryName", examControllers.getCategoryName);
router.get("/getAllAns", examControllers.getAllAns);
router.get("/allAnswerGet", examControllers.allAnswerGet);

module.exports = router;