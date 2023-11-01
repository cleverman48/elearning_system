
var exid_val;
function sendfoo(x) {
    exid_val = x.id;
    // return false;

}


function clearf() {

    document.getElementById("access").value = null;
    document.getElementById("err1_access").innerHTML = "";
    document.getElementById("submit1").disabled = true;
    return false;
}


async function validateCode() {
    var email = document.getElementById('email').value;
    let code = document.getElementById("access").value;
    var valid_code = await (await fetch(`/checkCode?email=${email}&exam_id=${exid_val}`)).json();
    let check_code = valid_code[0][0].exam_access_code;

    if (check_code != code) {

        document.getElementById("err1_access").style.color = "red";
        document.getElementById("err1_access").innerHTML = "Access code is invalid";
        document.getElementById("submit1").disabled = true;

        return false;
    }
    else {
        document.getElementById("err1_access").innerHTML = "";
        document.getElementById("submit1").disabled = false;

        return true;
    }
}
function foo() {
    // let flag=0
    let c1 = document.getElementById("check1").checked;
    let c2 = document.getElementById("check2").checked;


    if (c1 && c2) {
        document.getElementById("submit").disabled = false;
        return true;
    }
    else {
        document.getElementById("submit").disabled = true;
        return false;
    }
}


// //////////////////////////////////////////////////

function popupClick() {
    var divParent = document.getElementById("addPop");
    var popupProfile = document.getElementById("profilePopup");
    var spanC = document.createElement("span");
    spanC.classList.add("popuptext")
    spanC.classList.toggle("show");
    spanC.innerHTML = "Profile Update Complete!"
    divParent.appendChild(spanC)
    const myTimeout = setTimeout(callLogin, 1000);
    function callLogin() {
        spanC.remove()
    }
}
async function validateProfilePaw() {
    var old_pass = document.getElementById("old_pass").value;
    var save_pass = document.getElementById("save_pass").value;
    var save_confirm = document.getElementById("save_confirm").value;
    var err_old = document.getElementById("err_old");
    var err_new = document.getElementById("err_new");
    var err_confirm = document.getElementById("err_confirm");
    var profileFetch = await fetch('/profilePassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            old_pass,
            save_pass,
            save_confirm
        })
    }).then(res => res.json())
        .then(data => {
            if (data.text == "wrong") {
                err_old.innerHTML = 'Password Does Not Match'
                err_new.innerHTML = ""
                err_confirm.innerHTML = ""
            }
            if (data.text == "blank") {
                err_new.innerHTML = "Plese Fill the data"
                err_old.innerHTML = ''
                err_confirm.innerHTML = ""
            }
            if (data.text == "empty") {
                err_confirm.innerHTML = "Plese Fill the data"
                err_old.innerHTML = ''
                err_new.innerHTML = ""
            }
            if (data.text == "notMatch") {
                err_confirm.innerHTML = "Enter Same Password"
                err_old.innerHTML = ''
                err_new.innerHTML = ""
            }
            if (data.text == "success") {
                // location.assign("/login")
                // alert("password changed successfully")
                var popup = document.getElementById("myPopup");
                popup.classList.toggle("show");
                const myTimeout = setTimeout(callLogin, 1000);
                function callLogin() {
                    location.assign("/login")
                }
            }
        })
}