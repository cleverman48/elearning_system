var dddd = document.getElementById("id");
dddd.style.display = "none";
//alert(dddd.innerHTML);
const themeData = JSON.parse(dddd.innerHTML);
console.log(themeData);
var test_data = JSON.parse(themeData.test_data);
var bt_update = document.getElementById("bt_update");
bt_update.disabled = true;
bt_update.style.backgroundColor = "gray";
var animation = bt_update.animate(
  [
    { transform: "scale(1)" },
    { transform: "scale(1.2)" },
    { transform: "scale(1)" },
  ],
  {
    duration: 1000,
    easing: "ease-in-out",
    fill: "both",
    iterations: Infinity,
  }
);
animation.pause();
var test_pan_flag = false;
var editable_row;
webix.ui({
  container: "webix_toolbar",
  cols: [
    {
      label: "戻る",
      view: "button",
      height: 40,
      align: "left",
      inputWidth: 100,
      width: 130,
      id: "bt_back",
      click: function () {
        window.location.replace("/home");
      },
    },
    {
      label: "変更する",
      view: "button",
      inputWidth: 100,
      id: "bt_save",
      click: function () {
        var sendData = {
          theme_id: "",
          theme_name: "",
          start_date: "",
          end_date: "",
          possible_number: "",
          marks: "",
          check_answer: "",
          check_suffle: "",
          check_unuse_make: "",
          check_moretime: "",
          check_limit_time: "",
          limit_time: "",
          test_data: test_data,
          image: "",
        };
        sendData.theme_id = themeData.theme_id;
        sendData.theme_name = $$("theme_name").getValue();
        const sd = $$("start_date").getValue();
        const sm = sd.getMonth()+1;
        sendData.start_date = sd.getFullYear()+"-"+sm+"-"+sd.getDate();
        const ed = $$("end_date").getValue();
        const em = ed.getMonth()+1;
        sendData.end_date = ed.getFullYear()+"-"+em+"-"+ed.getDate();
        sendData.possible_number = $$("possible_number").getValue();
        sendData.marks = $$("marks").getValue();
        sendData.check_answer = $$("check_answer").getValue();
        sendData.check_suffle = $$("check_suffle").getValue();
        sendData.check_unuse_make = $$("check_unuse_make").getValue();
        sendData.check_moretime = $$("check_moretime").getValue();
        sendData.check_limit_time = $$("check_limit_time").getValue();
        sendData.limit_time = $$("limit_time").getValue();
        sendData.image = image.src;
        if (
          sendData.theme_name == "" ||
          sendData.start_date == "" ||
          sendData.end_date == "" ||
          sendData.marks == ""
        ) {
          webix.message({ type: "error", text: "Please fill all the fields" });
          return;
        }        
        if (test_data.length == 0) {
          webix.message({
            type: "error",
            text: "Please add at least one question",
          });
        }
        webix.confirm({
          title: "new theme",
          text: "Are you sure you want to update this theme?",
          callback: function (result) {
            if (result === true) {
              for(var i=0;i<test_data.length;i++)
              {
                test_data[i].theme_id = sendData.theme_id;
              } 
              sendData.test_data = test_data;
              webix
                .ajax().headers({
                  "Content-Type":"application/x-www-form-urlencoded"
                })
                .post("/update_theme", sendData, function (text, xml, xhr) {
                  if (text == "success") {
                    webix.message({
                      type: "success",
                      text: "updated successfully",
                    });
                    window.location.replace("/home");
                  }
                });
            } else {
              return;
            }
          },
        });
      },
    },
  ],
});
webix.ui({
  container: "webix_theme_name",
  label: "テーマ",
  view: "text",
  align: "lest",
  labelWidth: 120,
  inputWidth: 600,
  placeholder: "write the theme name",
  inputAlign: "right",
  name: "theme_name",
  type: "text",
  required: true,
  id: "theme_name",
  height: 50,
  css: "row_100",
  id: "theme_name",
  value: themeData.theme_name,
});
webix.ui({
  container: "webix_period",
  css: "webix_period",
  align: "center",
  cols: [
    {
      label: "開始日",
      view: "datepicker",
      inputAlign: "left",
      //"icons": true,
      timepicker: false,
      editable: true,
      align: "left",
      labelAlign: "left",
      name: "start_date",
      required: true,
      height: 50,
      id: "start_date",
      gravity: 0.5,
      labelWidth: 100,
      padding: 10,
      value: themeData.start_date,
    },
    {
      label: "終了日",
      value: "",
      view: "datepicker",
      align: "left",
      editable: true,
      labelAlign: "right",
      //"icons": true,
      inputAlign: "right",
      name: "end_date",
      invalidMessage: "only datae",
      required: true,
      height: 50,
      id: "end_date",
      gravity: 0.5,
      labelWidth: 100,
      padding: 10,
      value: themeData.end_date,
    },
  ],
});
webix.ui({
  container: "webix_phone_marks",
  cols: [
    {
      label: "可能な回数",
      view: "text",
      align: "left",
      type: "number",
      labelAlign: "left",
      placeholder: "5",
      inputAlign: "right",
      invalidMessage: "should only number ",
      required: true,
      height: 50,
      name: "possible_number",
      id: "possible_number",
      gravity: 0.5,
      labelWidth: 150,
      padding: 10,
      value: themeData.possible_number,
    },
    {
      label: "スコア",
      view: "text",
      align: "lest",
      type: "number",
      labelAlign: "right",
      placeholder: "100",
      inputAlign: "right",
      required: true,
      invalidMessage: "only number",
      height: 50,
      name: "marks",
      id: "marks",
      gravity: 0.5,
      labelWidth: 100,
      padding: 10,
      value: themeData.marks,
    },
  ],
});
webix.ui({
  container: "webix_answer_suffle",
  cols: [
    {
      label: "受講者に正解を表示",
      view: "checkbox",
      height: 50,
      align: "right",
      labelAlign: "right",
      customCheckbox: true,
      inputAlign: "right",
      name: "check_show_answer",
      id: "check_answer",
      gravity: 0.5,
      labelWidth: 200,
      padding: 10,
      value: themeData.check_answer,
    },
    {
      label: "答えのシャッフル",
      view: "checkbox",
      height: 50,
      align: "left",
      labelAlign: "right",
      customCheckbox: true,
      inputAlign: "left",
      name: "answer_shuffle",
      id: "check_suffle",
      gravity: 0.5,
      labelWidth: 200,
      padding: 10,
      value: themeData.check_suffle,
    },
  ],
});
webix.ui({
  container: "webix_unuse_moretime",
  cols: [
    {
      label: "自動提出を無効にする",
      view: "checkbox",
      height: 50,
      align: "left",
      labelAlign: "right",
      customCheckbox: true,
      inputAlign: "left",
      name: "unuse_auto_issue",
      id: "check_unuse_make",
      gravity: 0.5,
      labelWidth: 200,
      padding: 10,
      value: themeData.check_unuse_make,
    },
    {
      label: "複数回の試行を許可",
      view: "checkbox",
      height: 50,
      align: "left",
      labelAlign: "right",
      customCheckbox: true,
      inputAlign: "left",
      name: "limit_time",
      id: "check_moretime",
      gravity: 0.5,
      labelWidth: 200,
      padding: 10,
      value: themeData.check_moretime,
    },
  ],
});
webix.ui({
  container: "webix_limit",
  cols: [
    {
      label: "制限時間",
      view: "checkbox",
      height: 50,
      align: "left",
      labelAlign: "right",
      customCheckbox: true,
      inputAlign: "left",
      name: "ck_limit_time",
      id: "check_limit_time",
      gravity: 0.5,
      labelWidth: 200,
      padding: 10,
      value: themeData.check_limit_time,
    },
    {
      view: "text",
      height: 50,
      align: "center",
      type: "number",
      labelAlign: "right",
      placeholder: "10",
      inputAlign: "right",
      name: "limite_time_value",
      invalidMessage: "only number!",
      id: "limit_time",
      gravity: 0.3,
      padding: 10,
      value: themeData.limit_time,
    },
    {
      label: "分",
      view: "label",
      height: 50,
      align: "left",
      borderless: true,
      gravity: 0.2,
      labelWidth: 200,
      padding: 10,
    },
  ],
});
webix.ui({
  container: "webix_table",
  gravity: 1,
  view: "datatable",
  id: "tb_problems",
  resizeColumn: true,
  data:test_data,
  columns: [
    {
      id: "checkbox",
      header: { content: "masterCheckbox" },
      template: "{common.checkbox()}",
      checkValue: "on",
      uncheckValue: "off",
      width: 50,
    },
    { id: "no", header: "No", width: 50 },
    { id: "query", header: "質問", fillspace: true },
    { id: "type", header: "問題形式" },
    { id: "marks", header: "スコア" },
    { id: "query_sentences", header: "Query Sentences", hidden: true },
    { id: "answer_sentences", header: "Answer Sentences", hidden: true },
    { id: "true_answer_comment", header: "True Answer Comment", hidden: true },
    {
      id: "false_answer_comment",
      header: "False Answer Comment",
      hidden: true,
    },
    { id: "possible_answers", header: "Possible Answers", hidden: true },
    { id: "true_answers", header: "True Answers", hidden: true },
    { id: "test_id", header: "Test ID", hidden: true },
    { id: "theme_id", header: "Theme ID", hidden: true },
    { id: "edit", header: "修正", template: "{common.editIcon()}" },
    { id: "del", header: "削除", template: "{common.trashIcon()}" },
  ],
  autoheight: true,
  select: "cell",
  on: {
    onAfterRender: function () {
      // update the "no" field of each row
      this.eachRow(function (row) {
        var data = $$("tb_problems").data;
        data.each(function (obj, i) {
          obj.no = i + 1;
        });
      });
    },
    onItemClick: function (id, e, node) {
      var item = this.getItem(id.row);
      if (id.column == "edit") {
        document.getElementById("bt_update").disabled = false;
        document.getElementById("bt_update").style.backgroundColor =
          "dodgerblue";
        editable_row = item;
        clearData();
        setUpdateData();
        window.location = "#bt_update";
      } else if (id.column == "del") {
        webix.confirm({
          title: "Delete",
          text: "Are you sure you want to delete this item?",
          callback: function (result) {
            if (result === true) {
              var row = item;
              var index = test_data.findIndex(
                (iii) => iii.test_id === row.test_id
              );
              test_data.splice(index, 1);
              console.log(test_data);
              console.log(id);
              $$("tb_problems").remove(id.row);
            }
          },
        });
      }
    },
  },
});
webix.ui({
  container: "first_editor",
  type: "space",
  cols: [
    {
      rows: [
        { template: "問題文章入力", type: "header" },
        {
          id: "problem_editor",
          view: "nic-editor",
          height: 250,
          config: { fullPanel: true },
        },
      ],
    },
    {
      rows: [
        { template: "解答の入力", type: "header" },
        {
          id: "answer_editer",
          config: { fullPanel: true },
          view: "nic-editor",
          height: 250,
        },
      ],
    },
  ],
});
webix.ui({
  container: "second_editor",
  type: "space",
  cols: [
    {
      rows: [
        { template: "正解コメント", type: "header" },
        {
          id: "true_answer_comment",
          view: "nic-editor",
          height: 250,
          config: { fullPanel: true },
        },
      ],
    },
    {
      rows: [
        { template: "不正解、解答についてのコメント", type: "header" },
        {
          id: "false_answer_comment",
          config: { fullPanel: true },
          view: "nic-editor",
          height: 250,
        },
      ],
    },
  ],
});

webix.ready(function () {});
document.getElementById("edit_test_pan").style.display = "none";
$$("tb_problems").parse(test_data);
function addPossibleAnswer(event) {
  if (event.keyCode === 13 || event.key === "Enter") {
    // Enter key pressed
    var componentName = document.getElementById(
      "webix_input_possible_answers"
    ).value;
    if (componentName) {
      let pa = document.getElementById("possible_answers");
      pa.innerHTML +=
        "<div class='component'  id = '" +
        componentName +
        "'>" +
        componentName +
        "     <span class='delete' onclick = 'deletePossibleAnswer(event)'> x </span></div>";
      document.getElementById("webix_input_possible_answers").value = "";
    }
  }
}
function deletePossibleAnswer(event) {
  let element = event.target;
  element.parentNode.parentNode.removeChild(element.parentNode);
}
function addTrueAnswer(event) {
  if (event.keyCode === 13 || event.key === "Enter") {
    // Enter key pressed
    var componentName = document.getElementById(
      "webix_input_true_answers"
    ).value;
    if (componentName) {
      let pa = document.getElementById("true_answers");
      pa.innerHTML +=
        "<div class='component' id = '" +
        componentName +
        "'>" +
        componentName +
        "     <span class='delete' onclick = 'deletePossibleAnswer(event)'> x </span></div>";
      document.getElementById("webix_input_true_answers").value = "";
    }
  }
}
function showMakeTest(event) {
  var ele = document.getElementById("edit_test_pan");
  if (!test_pan_flag) {
    ele.style.display = "flex";
    event.target.innerHTML = "テスト作成キャンセル";
  } else {
    ele.style.display = "none";
    event.target.innerHTML = "テストの作成";
  }
  test_pan_flag = !test_pan_flag;
}
function addTest() {
  let query = document.getElementById("query").value;
  let query_type = document.getElementById("query_type").value;
  let query_marks = document.getElementById("query_marks").value;
  let query_sentences = $$("problem_editor").getValue();
  let answer_sentences = $$("answer_editer").getValue();
  let true_answer_comment = $$("true_answer_comment").getValue();
  let false_answer_comment = $$("false_answer_comment").getValue();

  let possible_answers = []; //possible answers
  let possibleDiv = document.getElementById("possible_answers");
  let possiblechildren = possibleDiv.childNodes;
  for (let i = 0; i < possiblechildren.length; i++) {
    if (possiblechildren[i].nodeType === 1) {
      possible_answers.push(possiblechildren[i].id);
    }
  }

  let true_answers = []; //true answers
  let trueDiv = document.getElementById("true_answers");
  let truechildren = trueDiv.childNodes;
  for (let i = 0; i < truechildren.length; i++) {
    if (truechildren[i].nodeType === 1) {
      true_answers.push(truechildren[i].id);
    }
  }
  let date = new Date();
  let nowTime = date.getTime();
  let test_item = {
    query: query,
    type: query_type,
    marks: query_marks,
    query_sentences: query_sentences,
    answer_sentences: answer_sentences,
    true_answer_comment: true_answer_comment,
    false_answer_comment: false_answer_comment,
    possible_answers: possible_answers,
    true_answers: true_answers,
    test_id: "test" + nowTime,
    theme_id: "dddd",
    checkbox: "off",
    no: test_data.length + 1,
  };
  webix.confirm({
    title: "insert",
    text: "Are you sure you want to insert this item?",
    callback: function (result) {
      if (result === true) {
        //test_data = JSON.parse(test_data);
        test_data.push(test_item);
        $$("tb_problems").clearAll();
        $$("tb_problems").parse(test_data);
        clearData();
        window.location = "#webix_table";
      } else {
        return;
      }
    },
  });
}
function clearData() {
  document.getElementById("query").value = "";
  document.getElementById("query_type").value = "複数選択";
  document.getElementById("query_marks").value = "";
  $$("problem_editor").setValue("");
  $$("answer_editer").setValue("");
  $$("true_answer_comment").setValue("");
  $$("false_answer_comment").setValue("");
  document.getElementById("possible_answers").innerHTML = "";
  document.getElementById("true_answers").innerHTML = "";
}
function setUpdateData() {
  animation.play();
  document.getElementById("query").value = editable_row.query;
  document.getElementById("query_type").value = editable_row.type;
  document.getElementById("query_marks").value = editable_row.marks;
  $$("problem_editor").setValue(editable_row.query_sentences);
  $$("answer_editer").setValue(editable_row.answer_sentences);
  $$("true_answer_comment").setValue(editable_row.true_answer_comment);
  $$("false_answer_comment").setValue(editable_row.false_answer_comment);

  editable_row.possible_answers.forEach((ts) => {
    let pa = document.getElementById("possible_answers");
    pa.innerHTML +=
      "<div class='component'  id = '" +
      ts +
      "'>" +
      ts +
      "     <span class='delete' onclick = 'deletePossibleAnswer(event)'> x </span></div>";
  });
  editable_row.true_answers.forEach((ts) => {
    let pa = document.getElementById("true_answers");
    pa.innerHTML +=
      "<div class='component'  id = '" +
      ts +
      "'>" +
      ts +
      "     <span class='delete' onclick = 'deletePossibleAnswer(event)'> x </span></div>";
  });
}
function updateTest() {
  webix.confirm({
    title: "update",
    text: "Are you sure you want to update this item?",
    callback: function (result) {
      if (result === true) {
        //test_data = JSON.parse(test_data);
        var index = test_data.findIndex(     
          (item) => {
            return item.test_id == editable_row.test_id;
          }
        );       
        if (index != -1) {
          let query = document.getElementById("query").value;
          let query_type = document.getElementById("query_type").value;
          let query_marks = document.getElementById("query_marks").value;
          let query_sentences = $$("problem_editor").getValue();
          let answer_sentences = $$("answer_editer").getValue();
          let true_answer_comment = $$("true_answer_comment").getValue();
          let false_answer_comment = $$("false_answer_comment").getValue();

          let possible_answers = []; //possible answers
          let possibleDiv = document.getElementById("possible_answers");
          let possiblechildren = possibleDiv.childNodes;
          for (let i = 0; i < possiblechildren.length; i++) {
            if (possiblechildren[i].nodeType === 1) {
              possible_answers.push(possiblechildren[i].id);
            }
          }

          let true_answers = []; //true answers
          let trueDiv = document.getElementById("true_answers");
          let truechildren = trueDiv.childNodes;
          for (let i = 0; i < truechildren.length; i++) {
            if (truechildren[i].nodeType === 1) {
              true_answers.push(truechildren[i].id);
            }
          }

          test_data[index].query = query;
          test_data[index].type = query_type;
          test_data[index].marks = query_marks;
          test_data[index].query_sentences = query_sentences;
          test_data[index].answer_sentences = answer_sentences;
          test_data[index].true_answer_comment = true_answer_comment;
          test_data[index].false_answer_comment = false_answer_comment;
          test_data[index].possible_answers = possible_answers;
          test_data[index].true_answers = true_answers;

          document.getElementById("bt_update").disabled = true;
          document.getElementById("bt_update").style.backgroundColor = "gray";
          $$("tb_problems").clearAll();
          $$("tb_problems").parse(test_data);
          clearData();
          animation.pause();
          window.location = "#webix_table";
        }
      } else {
        return;
      }
    },
  });
}
var fileInput = document.getElementById("myFileInput");
var image = document.getElementById("myImage");
fileInput.addEventListener("change",()=>{
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
      image.src = reader.result;     
    }
});