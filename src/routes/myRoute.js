const express = require("express");
const router = express.Router();
const bod = require("body-parser");
const path = require("path");

const myControllers = require("../controllers/myController");
const middle = require("../middlaware/AuthMiddleware");


// Dhruv and kevin routes
router.get("/", myControllers.logingetpage);
router.get("/mylogin", myControllers.logingetpage);
router.post("/mylogin", myControllers.loginpostpage);
router.get("/forget", myControllers.forgetGet);
router.get("/home", middle.verifyToken, myControllers.homepageGet);
router.get("/logout", myControllers.logoutpageGet);
router.post("/theme", middle.verifyToken, myControllers.themepostpage);
router.get("/newtheme", middle.verifyToken, myControllers.newthemegetpage);
router.post("/deletetheme", middle.verifyToken, myControllers.deletethemepostpage);
router.get("/edittheme", middle.verifyToken, myControllers.edithemegetpage);
router.post("/update_theme", middle.verifyToken, myControllers.updatetheme);
router.get("/enterexam", middle.verifyToken, myControllers.enterexam);


router.get("/result", myControllers.resultpageGet);

router.post('/upload-image', myControllers.uploadImage);
router.post('/insert_theme',middle.verifyToken, myControllers.insertTheme);


module.exports = router;
