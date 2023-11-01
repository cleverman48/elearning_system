const express = require("express");
const router = express.Router();
const bod = require("body-parser");
const path = require("path");

const userControllers = require("../controllers/userController");
const middle = require("../middlaware/AuthMiddleware");


// Dhruv and kevin routes
router.get("/home", middle.verifyToken, userControllers.homepageGet);
router.get("/exam_home", userControllers.exam_homepageGet);
router.get("/result", userControllers.resultpageGet);
router.get("/logout", userControllers.logoutpageGet);
router.post("/profile_update", userControllers.profile_updatepagePOST);
router.get("/", userControllers.logingetpage);
router.get("/register", userControllers.registerpage);
router.post("/register", userControllers.registerpost);

router.get("/login", userControllers.logingetpage);

router.post("/login", userControllers.loginpostpage);
router.get("/city", userControllers.city);
router.get("/forget", userControllers.forgetGet);
router.get("/setPassword", middle.verifyToken, userControllers.setPasswordGet);
router.post("/setPassword", userControllers.setPasswordPost);
router.post("/fetch_api", userControllers.sendOtp);
router.get("/updatePassword", userControllers.updatePasswordGet);
router.post("/updatePassword", userControllers.updatePasswordPost);
router.post("/active/:resultRandom", userControllers.activePost);
router.post("/valid1", userControllers.validPost);
router.post("/changePassword", userControllers.changePasswordPost);
router.post("/validPassword", userControllers.validPassword);
router.post("/profilePassword", userControllers.updateProfilePassword);


module.exports = router;