class Form {
  constructor(name, cpf, email, type) {
    this.name = name;
    this.cpf = cpf;
    this.email = email;
    this.type = type;
  }

  validateForm() {
    if (
      (this.name == null || this.name == "",
      this.cpf == null || this.cpf == "",
      this.email == null || this.email == "")
    ) {
      return false;
    }
  }

  validateEmail(email) {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email.match(validRegex)) return true;

    return false;
  }

  validateCPF(cpf) {
    let add, rev, i;
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf == "") return false;
    // Elimina CPFs invalidos conhecidos
    if (
      cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999"
    )
      return false;
    // Valida 1o digito
    add = 0;
    for (i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(9))) return false;
    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(10))) return false;
    return true;
  }
}

function loadHTML(tipo) {
  switch (tipo) {
    case "Error":
      fetch("./alerts/error.html")
        .then((response) => response.text())
        .then(
          (text) =>
            (document.getElementById("alert-container").innerHTML = text)
        );
      break;

    case "Sucess":
      fetch("./alerts/sucess.html")
        .then((response) => response.text())
        .then(
          (text) =>
            (document.getElementById("alert-container").innerHTML = text)
        );
      break;

    case "Loading":
      return fetch("./alerts/loading.html")
        .then((response) => response.text())
        .then(
          (text) =>
            (document.getElementById("alert-container").innerHTML = text)
        );
  }
}

function sendForm() {
  let form_container = document.getElementById("form-container");
  form_container.style.display = "none";

  if (document.getElementById("alert-container")) {
    document.getElementById("alert-container").style.display = "flex";
  }

  let htmlLoading = loadHTML("Loading");
  htmlLoading.then((value) => {
    let loading = document.getElementsByClassName("loading")[0];
    console.log(loading);
    let form = new Form(
      document.forms["form-holder-portal"]["name"].value,
      document.forms["form-holder-portal"]["cpf"].value,
      document.forms["form-holder-portal"]["email"].value,
      document.forms["form-holder-portal"]["request_type"].value
    );

    let validateCPF = form.validateCPF(form.cpf);
    let validateEmail = form.validateEmail(form.email);
    if (!form.name || !validateCPF || !validateEmail) return;

    fetch("http://localhost:3333/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        cpf: form.cpf,
        email: form.email,
        type: form.type,
      }),
    })
      .then((res) => {
        loading.style.display = "none";
        loadHTML("Sucess");
        console.log("Request complete! response:", res);
      })
      .catch((err) => {
        loading.style.display = "none";
        loadHTML("Error");
        console.log(err);
      });
  });
}

function closeModal() {
  let form_container = document.getElementById("form-container");
  let alert_container = document.getElementById("alert-container");
  form_container.style.display = "flex";
  alert_container.style.display = "none";
}

function maskCPF(i) {
  var v = i.value;

  if (isNaN(v[v.length - 1])) {
    // impede entrar outro caractere que não seja número
    i.value = v.substring(0, v.length - 1);
    return;
  }

  i.setAttribute("maxlength", "14");
  if (v.length == 3 || v.length == 7) i.value += ".";
  if (v.length == 11) i.value += "-";
}

function maskEmail(i) {
  let v = i.value;
  let messageEmail = document.getElementsByClassName("validate-email")[0];

  if (i.value.length === 0) {
    messageEmail.style.display = "none";
  }

  let re = v.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  if (re) {
    i.setAttribute(
      "style",
      "background-color: white;border: 2px solid green;outline: 0;"
    );
    messageEmail.style.display = "none";
  } else {
    i.setAttribute(
      "style",
      "background-color: white;border: 2px solid red;outline: 0;  "
    );
    if (i.value.length !== 0) {
      messageEmail.style.display = "block";
    }
  }
}
