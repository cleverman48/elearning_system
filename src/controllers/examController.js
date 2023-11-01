const con = require("../connections/dbconnect");
var utils = require("util");
const { decode } = require("punycode");
const flash = require("connect-flash");
var nodemailer = require("nodemailer");
const { signedCookie } = require("cookie-parser");
const { Console } = require("console");
const bcrypt = require("bcryptjs");

async function queryExecuter(query) {
    return new Promise((resolve, rejects) => {
        con.query(query, (err, result) => {
            if (err) {
                rejects(err);
            }
            resolve(result);
        });
    });
}

//Routes
const form1 = async(req, res) => {
    try {
        if (!req.session.email) {
            res.render("login", { msg: "" });
        } else {
            let flag;
            // console.log("Sesion :- ", req.session.email);
            // console.log(`select student_id,name,address,email,contact,city,gender from  student where email='${req.session.email}'`);

            let user_email = req.session.email;
            const [result12] = await con.execute(
                `select student_id,name,address,email,contact,city,gender from  student where email='${req.session.email}'`
            );

            let [sql1] = await con.execute(
                `select exam_id,exam_name,exam_access_code,total_questions,exam_time,user_id,exam_status from exam where exam_status=1`
            );
            //   console.log("hello nareshjbffh", sql1[0].exam_id);

            let [sql2] = await con.execute(
                `select exam.exam_id,exam_name,user_answers.user_id from exam,user_answers where  user_answers.exam_id=exam.exam_id and exam_status=1 and user_answers.user_id=${req.session.userId}`
            );
            //   console.log("sql 2", sql2, req.session.userId);
            let flag1 = 0;
            let attempted;

            let data1 = sql1;

            for (let i = 0; i < sql1.length; i++) {
                flag1 = 0;
                for (let j = 0; j < sql2.length; j++) {
                    if (sql1[i].exam_id == sql2[j].exam_id) {
                        data1[i].attempted = true;
                        flag1 = 1;
                    }
                }
                if (flag1 == 0) {
                    // attempted = false;
                    data1[i].attempted = false;
                }
            }
            let userEmail = req.session.email;
            //   console.log("Session E - mail -: ", req.session.email);

            let sql = `select name,email,contact,gender,city,college_name from student INNER JOIN colleges on colleges.college_id=student.college_id where email='${user_email}'`;
            let [data] = await con.execute(sql);
            // console.log(data[0]);
            let result = data[0];
            // console.log("ye falg hai", flag);
            //  console.log(data1)

            res.render("examlist", { sql: data1, result, editdata: result12 });
            // res.render("form",{result})
        }
    } catch (exception) {
        console.log("Error: ", exception);
    }
};

const validate_code = async(req, res) => {
    let email = req.query.email;
    let examId = req.query.exam_id;
    req.session.exam_id = examId;
    let sql11 = `select exam_access_code from exam where exam_id=${examId};`;
    // console.log(sql11);
    let verify = await con.execute(sql11);
    res.json(verify);
};

// !------------------------------VIREN------------------------------
const examGet = async(req, res) => {
    try {
        // Get the requested page number, default to 1 if not provided
        const question_per_page = 1; //* Limit || Number of questions to display per page
        let exam_id = req.session.exam_id;
        let [exam] = await con.execute(
            `SELECT exam_name,total_questions,exam_time,exam_access_code FROM exam WHERE exam_id = '${exam_id}' and exam_status = 1`
        );

        let [category] = await con.execute(
            `select a.category_name,a.category_id from category a,exam_category b where a.category_id=b.category_id and exam_id=${exam_id}`
        );

        let [ques] =
        await con.execute(`select question_id,question_text from exam a, exam_category b, questions c 
    where a.exam_id=b.exam_id and b.category_id=c.category_id and b.exam_id=${exam_id}`);
        let qids = new Array();

        for (const x of ques) {
            qids.push(x.question_id);
        }
        const question_no = qids[0];
        let category_id = category[0].category_id;

        let [data] = await con.execute(
            `SELECT question_text,question_id,option_a,option_b,option_c,option_d,a.category_id FROM questions as a left join category as b on a.category_id=b.category_id where a.question_id=${qids[0]}`
        );

        let [total_questions_of_category] = await con.execute(
            `select count(*) as total from questions where category_id = ${category_id} `
        );
        if (data.length) {
            res.render("exam_question", {
                e: data[0],
                exam: exam,
                qids: qids,
                category: category,
                question_no,
                question_per_page,
                total_questions_of_category,
            });
        } else res.send("Data not found");
    } catch (err) {
        console.log(err);
    }
};

const examPost = async(req, res) => {
    res.redirect("examGet");
};

const categoryGet = async(req, res) => {
    let category_id = req.query.id;
    let question_no = 1;
    const question_per_page = 1; //* Limit || Number of questions to display per page
    let offset = (question_no - 1) * question_per_page;
    let exam_id = 1;

    let [category] = await con.execute(
        `SELECT category_name,a.category_id,count(a.category_id) as no_of_question FROM category a, questions b WHERE a.category_id=b.category_id and a.category_id = '${category_id}'`
    );

    let [data] = await con.execute(
        `SELECT question_text,question_id,option_a,option_b,option_c,option_d,a.category_id FROM questions as a left join category as b on a.category_id=b.category_id where a.category_id=${category_id} LIMIT ${question_per_page} OFFSET ${offset}`
    );
    // console.log("category :- ", category);
    res.json({ data, category, question_no });
};

const pagingGet = async(req, res) => {
    const category_id = req.query.category_id || 1,
        question_no = req.query.question_no + 1;
    // console.log(category_id,question_no);
    const question_per_page = 1; //* Limit || Number of questions to display per page
    const offset = (question_no - 1) * question_per_page;
    let no_of_question;
    let exam_id = 1;
    let [exam] = await con.execute(
        `SELECT exam_name,total_questions,exam_time,exam_access_code FROM exam WHERE exam_id = '${exam_id}'`
    );

    let [category] = await con.execute(
        `SELECT category_name,a.category_id,count(a.category_id) as no_of_question FROM category a, questions b WHERE a.category_id=b.category_id and a.category_id = '${category_id}'`
    );

    let [data] = await con.execute(
        `SELECT question_text,question_id,option_a,option_b,option_c,option_d,a.category_id FROM questions as a left join category as b on a.category_id=b.category_id where a.category_id=${category_id} AND a.question_id=${req.query.question_no}`
    );
    // console.log('Data :- ',data);
    res.json(data, category[0].no_of_question, question_no);
};

const nextGet = async(req, res) => {
    let id = parseInt(req.query.id);
    // console.log(id);
    let [question] = await con.execute(
        `SELECT * FROM questions WHERE question_id = ${id}`
    );
    // console.log(question);
    res.json(question);
};

const prevGet = async(req, res) => {
    // console.log(req.query.id);
    let id = parseInt(req.query.id);
    let [question] = await con.execute(
        `SELECT * FROM questions WHERE question_id = ${id}`
    );
    // console.log(question);
    res.json(question);
};

const answerPost = async(req, res) => {
    let b = req.body;
    // console.log(`SELECT user_answers FROM user_answers WHERE question_id=${b.id} and user_id=${req.session.userId || 15} and exam_id=${req.session.exam_id}`);
    if (b.id) {
        let [check] = await con.execute(
            `SELECT user_answers FROM user_answers WHERE question_id=${b.id} and user_id=${req.session.userId || 15} and exam_id=${req.session.exam_id||2}`
        );
        if (check.length == 0) {
            let query = `INSERT INTO user_answers (user_id,exam_id, question_id,user_answers,marks) VALUES (${req.session.userId||15},${req.session.exam_id||2},${b.id},'${b.selectedAns}',1)`;
            // console.log(query);
            let [data] = await con.execute(query);
            res.json(data);
        } else {
            let query = `UPDATE user_answers SET user_answers='${b.selectedAns}' WHERE question_id=${b.id} and user_id=${req.session.userId||15}`;
            let [data] = await con.execute(query);
            res.json(data);
        }
    } else {
        res.json("");
    }
};

const getAns = async(req, res) => {
    let id = req.body;
    // console.log(id);
    let [q] = await con.execute(

        `SELECT user_answers FROM user_answers WHERE question_id = ${id[0].question_id} and user_id = ${req.session.userId} and exam_id=${req.session.exam_id}`
    );
    // console.log(`SELECT user_answers FROM user_answers WHERE question_id = ${id[0].question_id}`,id);
    res.json(q);
};

const getAllAns = async(req, res) => {
    let [q] = await con.execute(`SELECT user_answers FROM user_answers`);
    // console.log("Ans :- ",q);
    res.json(q);
};

const endExam = async(req, res) => {
    let b = req.body;
    res.render("result");
};

const allAnswerGet = async(req, res) => {
    let b = req.query;
    // console.log("B", b, req.session.exam_id, req.session.userId);
    if (b.id) {
        let [check] = await con.execute(
            `SELECT user_answers FROM user_answers WHERE question_id=${parseInt(
        b.id
      )} and user_id=${req.session.userId} and exam_id=${req.session.exam_id}`
        );
        if (check.length == 0) {
            let query = `INSERT INTO user_answers (user_id,exam_id, question_id,user_answers,marks) VALUES (${
        req.session.userId
      },${req.session.exam_id},${parseInt(b.id)},'',1)`;
            let [data] = await con.execute(query);
            res.json(data);
        } else {
            let query = `update user_answers set user_answers = '' WHERE question_id=${b.id} and user_id=${req.session.userId}`;
            let [data] = await con.execute(query);
            res.json(data);
        }
    }
};

const getCategoryName = async(req, res) => {
    if (req.query.btn == "next" || req.query.btn == "prev") {
        let [c_name] = await con.execute(
            `select b.category_name, b.category_id from questions a,category b where a.category_id=b.category_id and a.question_id= ${
        req.query.btn == "next"
          ? parseInt(req.query.id)
          : parseInt(req.query.id)
      }`
        );
        // console.log(c_name);
        res.json(c_name);
    } else {
        // console.log("ifhihfi",req.query);
        let [c_name] = await con.execute(
            `select b.category_name, b.category_id from questions a,category b where a.category_id=b.category_id and a.question_id= ${parseInt(
        req.query.id
      )}`
        );
        res.json(c_name);
    }
};

module.exports = {
    form1,
    validate_code,
    examGet,
    answerPost,
    prevGet,
    nextGet,
    pagingGet,
    categoryGet,
    getAns,
    endExam,
    getCategoryName,
    examPost,
    getAllAns,
    allAnswerGet,
};