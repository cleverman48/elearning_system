var ischeckemail = true;
var ischeckname1 = true,
    ischeckname2 = true;
var isContact = true;
var isaddress = true;
var savebutton = document.getElementById('savebutton');
var saveall = document.getElementById('totalSave');
var readonly = true;
var inputs = document.querySelectorAll('input');
var firstname = document.getElementById('first_name').value;
var email = document.getElementById('email').value;


var contact = document.getElementById('contact');
var address = document.getElementById('address').value;
async function checkNameValid1(ele) {
    let input_val = ele.value;
    let err_mes = document.getElementById('err_name');
    var regex = /^[a-zA-Z ]*$/;
    if (input_val == "" || !regex.test(input_val)) {
        err_mes.innerHTML = "Not a Valid Name";
        ischeckname1 = false;
    } else {
        firstname = input_val;
        err_mes.innerHTML = "";
        ischeckname1 = true;
    }
    checksubmit();
}

async function checkEmail(ele) {
    const inputtxt = ele.value;

    const email_id = document.getElementById('email_id');
    const regExEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regExEmail.test(inputtxt.trim())) {
        email = inputtxt;
        email_id.innerHTML = '';
        ischeckemail = true;
    } else {
        email_id.innerHTML = 'Not a Valid Email';
        ischeckemail = false;
    }
    checksubmit();
}

function validatePhoneNumber(input_str) {
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

    return re.test(input_str);
}
async function checkContact(ele) {
    const contact_val = ele.value;
    const contact_id = document.getElementById('contact_id');



    if (validatePhoneNumber(contact_val)) {
        contact.value = contact_val;
        contact_id.innerHTML = '';
        isContact = true;
    } else {
        contact.value = contact_val;
        contact_id.innerHTML = 'Not Valid Number';
        isContact = false;
    }

    checksubmit();
}

async function checkAddress(ele) {

    let input_address = ele.value;
    const addre_err = document.getElementById('addre_err');
    if (input_address == "") {
        address = input_address;
        addre_err.innerHTML = 'Address field is empty';
        isaddress = false;
    } else {
        address = input_address;
        addre_err.innerHTML = '';
        isaddress = true;
    }
    checksubmit();
}

var isCheckgender = true;
var ansgen;
var gender1 = document.getElementsByName("gender");
gender1.forEach(ele => {
    if (ele.checked) {
        ansgen = ele.value;
    }
})

function checkgender(ele) {
    ansgen = ele.value
    checksubmit();
}
async function checksubmit() {
    if (ischeckemail && ischeckname1 && isContact && isaddress && isCheckgender) {

        saveall.disabled = false;
        saveall.style.cursor = 'pointer';
        const ans = await fetch('/profile_update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstname,
                email,
                contact: contact.value,
                address,
                gender: ansgen
            })
        });
    } else {
        saveall.disabled = true;
    }
}





// ///////////////////////////////////////////
function popupClick() {
    var divParent = document.getElementById("addPop");
    // var popupProfile = document.getElementById("profilePopup");
    var spanC = document.createElement("span");
    spanC.classList.add("popuptext")
    spanC.classList.toggle("show");
    spanC.innerHTML = "Profile Update Complete!"
    document.getElementById("addPop").appendChild(spanC)
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