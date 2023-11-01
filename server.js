const express = require("express");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const sessions = require("express-session");
var cookie = require("cookie-parser");
var utils = require("util");
const { decode } = require("punycode");
let bodyParser = require("body-parser");
const mysql = require("mysql2");
const flash = require("connect-flash");
var nodemailer = require("nodemailer");
const app = express();
const ejs = require("ejs");
const { signedCookie } = require("cookie-parser");
const { Console } = require("console");
const path = require("path");
require("dotenv").config({ path: "./.env" });
const PORT = process.env.PORT||3000;

//set engines
app.set("views", path.join(__dirname, "/src/views"));
app.set("view engine", "ejs");

app.use(express.static("./public"));

const exam = require("./src/routes/examRoute");
const user = require("./src/routes/userRoute");
const myroute = require("./src/routes/myRoute");

//kevin
app.use(cookie());
app.use(flash());
app.use(express.json({limit : "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true ,parameterLimit:50000}));


// const oneDay = 1000  60  60 * 24;
app.use(
    sessions({
        secret: "bhimanikevin",
        saveUninitialized: true,
        resave: false,
    })
);

//app.use("/", exam);
//app.use("/", user);
app.use("/", myroute);

app.listen(PORT, () => {
    console.log("Server running on port", PORT, "http://localhost:" + PORT);
});