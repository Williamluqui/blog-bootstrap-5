/// MODELO DE APRENDIZADO *--- ARMAZENANDO NO LOCALSTORAGE

let nome = document.getElementById("nome");
let validaNome = false;

let sobrenome = document.getElementById("sobrenome");
let validaSobrenome = false;

let email = document.getElementById("email");
validaEmail = false;

let password = document.getElementById("password");
let validaPass = false;

let confirmPassword = document.getElementById("confirmPassword");
let validaConfimPass = false;

let msgErro = document.getElementById("msgErro");

//cadastrar usuarios //


// TRATAMENTO DE ERROS



email.addEventListener("keyup", () => {
  let regex_validation = /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;
  console.log(
    "É email válido? Resposta: " + regex_validation.test(email.value)
  );
  if (regex_validation.test(email.value) === false) {
    validaEmail = false;
  } else {
    validaEmail = true;
  }

  console.log(email.value);
})

password.addEventListener("keyup", () => {
  if (password.value.length <= 5) {
    password.setAttribute("style", "border-color: red");
    msgErro.innerText = " Senha * insira no minimo 6 caracteres";
    msgErro.style.color = "red";
    validaPass = false;
  } else {
    msgErro.innerHTML = " ";
    password.setAttribute("style", "color: black");
    msgErro.style.color = "green";
    validaPass = true;
  }
});
//AS SENHAS PRECISAM SER IDENTICAS
confirmPassword.addEventListener("keyup", () => {
  if (password.value != confirmPassword.value) {
    confirmPassword.setAttribute("style", "border-color: red");
    msgErro.innerText = " As senhas não conferem!";
    msgErro.style.color = "red";
    validaConfimPass = false;
  } else {
    msgErro.innerText = " ";
    confirmPassword.setAttribute("style", "color:green");
    password.setAttribute("style", "color: black");
    validaConfimPass = true;
  }
});
