const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    // send email & password value on api
    const resultRegister = await registerAdmin(email.value, password.value);
    console.log(resultRegister);

    // check if email & password match
    if (checkEmail(email) && checkPassword(password)) {
        // if userId exist
        if (resultRegister.userId) {
            window.location.href = "admin.html";
        } else {
            console.log("Erreur.");
        }
    }

    const token = resultRegister.token;
    // store token identification on localStorage
    localStorage.setItem("authToken", token);
    console.log(token);
})

function checkEmail(email) {
    // if email value doesn't match string chain
    if (email.value !== "sophie.bluel@test.tld") {
        errorMessage();
        return false;
    } else {
        return true;
    }
}

function checkPassword(password) {
    // if password value doesn't match string chain
    if (password.value !== "S0phie") {
        errorMessage();
        return false;
    } else {
        return true;
    }
}

function errorMessage() {
    let response = document.querySelector(".response");

    // if response doesn't exist
    if (!response) {
        response = document.createElement("div");
        response.classList.add("response");
        form.appendChild(response);
    }
    response.innerText = "Erreur dans l'identifiant ou le mot de passe";
}



// function to register admin data
async function registerAdmin(email, password) {
    // URL API
    const adminUrl = "http://localhost:5678/api/users/login";
    // Data for admin
    const adminData = {
        email: email,
        password: password
    }

    // Post admin data
    const postAdmin = await fetch(adminUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminData)
    })

    const resultRegister = await postAdmin.json();
    return resultRegister;
}




