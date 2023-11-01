var utils = require("util");
const { decode } = require("punycode");
const flash = require("connect-flash");
var nodemailer = require("nodemailer");
const { signedCookie } = require("cookie-parser");
const { Console } = require("console");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { mycon, query } = require("../connections/myconnection");

//dhruv
const logoutpageGet = async (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
const homepageGet = async (req, res) => {
  /*const [result] = await con.execute(
    `select student_id,name,email,role from  student where email='${req.session.email}'`
  );
  res.render("homestart", { editdata: result });
 */ 
  var role = "student";
  if (role == "teacher") {
    res.render("myView/teacher_home",{});
  } 
  else {
    const sql = `CREATE TABLE IF NOT EXISTS theme_table (
      id INT NOT NULL AUTO_INCREMENT,
      theme_id VARCHAR(255) NOT NULL,
      theme_name VARCHAR(255) NOT NULL,
      start_date VARCHAR(255) NOT NULL,
      end_date VARCHAR(255) NOT NULL,
      possible_number INT,
      marks INT NOT NULL,
      check_answer INT,
      check_suffle INT,
      check_unuse_make INT,
      check_moretime INT,
      check_limit_time INT,
      limit_time INT,
      user VARCHAR(255),
      first_date VARCHAR(255) ,
      last_update_date VARCHAR(255) ,
      test_data TEXT,
      image TEXT,   
      PRIMARY KEY (id)
    )`;
    //console.log(sql);
    query(sql);
    const sql1 =
      "select * from theme_table";
    mycon.query(sql1, (err, results) => {
      if (err) {
        console.log("error in themepostpage", err);
        res.json("error");
      }
      res.render("myView/student_home", {
        test_list: results,
      });
    });
  }
};
const resultpageGet = async (req, res) => {
  res.render("result");
};
//login get user
const logingetpage = async (req, res) => {
  res.render("login", { msg: "" });
};

//login post user
const loginpostpage = async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var check = req.body.check;

  req.session.email = email;
  req.session.stdId = email;
  req.session.userId = email;
  res.redirect("/home");
};
const forgetGet = async (req, res, next) => {
  res.render("validEmail");
};

//? generate otp function random function
function generateOTP() {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

//?-----------sendopt function---------------------

const sendOtp = async (req, res, next) => {
  var email = req.body.email;
  // console.log("Send email in post method", email);
  var otp = generateOTP();
  // console.log("otp", otp);
  // let testAccount = nodemailer.createTestAccount();
  // const transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     host: "smtp.gmail.com",
  //     port: 587,
  //     auth: {
  //         type: "OAUTH2",
  //         user: "patelnokano000@gmail.com",
  //         clientId: "67052588834-mk4nh286olopiqjo696603gb0pfkpicm.apps.googleusercontent.com",
  //         clientSecret: "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",
  //         refreshToken: "1//04us9E3b_ARjICgYIARAAGAQSNwF-L9IrPSpdH05Mzzl8BuxFOyRDE0lsDzRRfMdEg2jQA_uFDp7G4que8m713t_5q1CjRlSK8qY",
  //         accessToken: "ya29.a0AVvZVspJqb2vWNPWa55TrdhaULzKmGSJOEsiZF-ctCG4GxpqNzI7cHKiG1CAJr1CkWbpm-EytloslaQfHQLpoZJJyR0wFJYzqwD4F65wZwaYVHvNx3SIznPvddsuorAivrditj4xvnxLip4KYy_-14DYlANRaCgYKARYSARISFQGbdwaIV0_DBqtSOLdypveodSvlrA0163",
  //     },
  // });

  // let info = transporter.sendMail({
  //     from: "hello <patelnokano000@gmail.com>", // sender address
  //     to: email, // list of receivers
  //     subject: "OTP Validation ✔", // Subject line
  //     text: "OTP", // plain text body
  //     html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  //     <div style="margin:50px auto;width:70%;padding:20px 0">
  //       <div style="border-bottom:1px solid #eee">
  //         <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a>
  //       </div>
  //       <p style="font-size:1.1em">Hi,</p>
  //       <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
  //       <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
  //       <p style="font-size:0.9em;">Regards,<br />EsparkBiz</p>
  //       <hr style="border:none;border-top:1px solid #eee" />
  //     </div>
  //   </div>`,
  // });
  req.session.email = email;
  res.json({
    otp,
  });
};

var themepostpage = async (req, res) => {
  const sql = `CREATE TABLE IF NOT EXISTS theme_table (
    id INT NOT NULL AUTO_INCREMENT,
    theme_id VARCHAR(255) NOT NULL,
    theme_name VARCHAR(255) NOT NULL,
    start_date VARCHAR(255) NOT NULL,
    end_date VARCHAR(255) NOT NULL,
    possible_number INT,
    marks INT NOT NULL,
    check_answer INT,
    check_suffle INT,
    check_unuse_make INT,
    check_moretime INT,
    check_limit_time INT,
    limit_time INT,
    user VARCHAR(255),
    first_date VARCHAR(255) ,
    last_update_date VARCHAR(255) ,
    test_data TEXT,
    image TEXT,   
    PRIMARY KEY (id)
  )`;
  //console.log(sql);
  query(sql);
  const sql1 =
    "select theme_id,theme_name,image,user,first_date,last_update_date from theme_table";
  mycon.query(sql1, (err, results) => {
    if (err) {
      console.log("error in themepostpage", err);
      res.json("error");
    }
    res.json({ data: results });
  });
};
var deletethemepostpage = async (req, res) => {
  data = req.body;
  query("delete from theme_table where theme_id ='"+data.theme_id+"'");
  const sql1 =
    "select theme_id,theme_name,image,user,first_date,last_update_date from theme_table";
  mycon.query(sql1, (err, results) => {
    if (err) {
      console.log("error in themepostpage", err);
      res.json("error");
    }
    res.json({ data: results });
  });
}
var newthemegetpage = async (req, res) => {
  res.render("myView/teacher_newtheme");
};
var uploadImage = async (req, res) => {
  const imageData = req.body.image;
  const data = imageData.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(data, "base64");
  fs.writeFile("./public/exam_icons/image.png", buffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error uploading image");
    } else {
      console.log("Image uploaded successfully");
      res.send("success");
    }
  });
};
var insertTheme = async (req, res) => {
  var receive_data = req.body;
  var user = req.session.userId;
  var cd = new Date();
  var first_date =
    cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();
  const imageData = receive_data.image;
  receive_data.possible_number == null  ? (receive_data.possible_number = 0) : receive_data.possible_number;
  receive_data.limit_time == null ? (receive_data.limit_time = 0): receive_data.limit_time;
  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
  const query = `INSERT INTO theme_table
   (theme_id,theme_name,start_date,end_date,possible_number,marks,check_answer,check_suffle,check_unuse_make,check_moretime,check_limit_time,limit_time,user,first_date,test_data,image) 
   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFile('./public/exam_icons/'+receive_data.theme_id, buffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error uploading image');
    } else {
      mycon.query(
        query,
        [
          receive_data.theme_id,
          receive_data.theme_name,
          receive_data.start_date,
          receive_data.end_date,
          receive_data.possible_number,
          receive_data.marks,
          receive_data.check_answer,
          receive_data.check_suffle,
          receive_data.check_unuse_make,
          receive_data.check_moretime,
          receive_data.check_limit_time,
          receive_data.limit_time,
          user,
          first_date,
          JSON.stringify(receive_data.test_data),
          "./exam_icons/"+receive_data.theme_id,
        ],
        (error, results) => {
          if (error) {
            console.error(error);
            res.status(500).send("Error saving image to database");
          } else {
            res.send("success");
          }
        }
      );
    }
  });
};
var edithemegetpage = async (req, res) => {
  var id = req.query.id;
  const sql1 ="select * from theme_table where theme_id = '" + id + "'";
    mycon.query(sql1, (err, results) => {
      if (err) {
        console.log("error in themepostpage", err);
        res.json("error");
      }
      console.log(results);
      res.render("myView/teacher_edittheme", {
        theme: results[0],
      });
    });
};
var updatetheme = async (req, res) => {
  var receive_data = req.body;
  var user = req.session.userId;
  var cd = new Date();
  var last_update_date =
    cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();
  if(receive_data.possible_number == null) receive_data.possible_number = 0;
  if(receive_data.limit_time == null ||receive_data.limit_time == "") receive_data.limit_time = 0;
  const sql = "UPDATE theme_table SET theme_name = '"+receive_data.theme_name+
  "', start_date='"+receive_data.start_date+"' "+
  ", end_date='"+receive_data.end_date+"' "+
  ", possible_number="+receive_data.possible_number+" "+
  ", marks="+receive_data.marks+" "+
  ", check_answer="+receive_data.check_answer+" "+
  ", check_suffle="+receive_data.check_suffle+" "+
  ", check_unuse_make="+receive_data.check_unuse_make+" "+
  ", check_moretime="+receive_data.check_moretime+" "+
  ", check_limit_time="+receive_data.check_limit_time+" "+
  ", limit_time="+receive_data.limit_time+" "+
  ", user='"+user+"' "+
  ", last_update_date='"+last_update_date+"' "+
  ", test_data='"+receive_data.test_data+"' "+
  ", image='./exam_icons/"+receive_data.theme_id +
  "' WHERE theme_id='"+receive_data.theme_id+"'";
  const base64Data = receive_data.image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFile('./public/exam_icons/'+receive_data.theme_id, buffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error uploading image');
    } else {
      mycon.query(
        sql,
        (error, results) => {
          if (error) {
            console.error(error);
            res.status(500).send("Error saving image to database");
          } else {
            res.send("success");
          }
        }
      );
    }
  }); 
}
var enterexam = async (req, res) => {
  var theme_id  = req.query.id;
  const sql1 =
      "select * from theme_table where theme_id = '"+theme_id+"'";
    mycon.query(sql1, (err, results) => {
      if (err) {
        console.log("error in themepostpage", err);
        res.json("error");
      }
      res.render("myView/enterexam", {
        theme_info: results[0],
      });
    });
}
module.exports = {
  logingetpage,
  loginpostpage,
  forgetGet,
  sendOtp,
  homepageGet,
  resultpageGet,
  logoutpageGet,
  themepostpage,
  newthemegetpage,
  uploadImage,
  insertTheme,
  deletethemepostpage,
  edithemegetpage,
  updatetheme,
  enterexam
};
