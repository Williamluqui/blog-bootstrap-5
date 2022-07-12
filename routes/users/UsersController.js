const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../../middlewares/adminAuth");
const flash = require("connect-flash");

router.use(flash());



// LISTAGEM DE USUARIOS //
router.get("/admin/users", adminAuth, (req, res) => {
  const session = req.session.user;
  const sessionId = JSON.stringify(session.id);
  const msgErro = "";

  User.findAll().then((user) => {
    res.render("admin/users/users", { user: user,sessionId:sessionId,msg:msgErro });
  });
});

// CADASTRAR USUARIO NO BD //
router.get("/users/new/",adminAuth, (req, res) => {
  res.render("admin/users/new");
});

router.post("/users/create", adminAuth,(req, res) => {
  const {email, password, passwordRepeat} = req.body;

  const regex_validation =
  /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;
  
  if (password == passwordRepeat && regex_validation.test(email) == true ) {
    User.findOne({ where: { email: email } }).then((user) => {

      if (user == undefined) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        User.create({
          email: email.toLowerCase(),
          password: hash,
        })
          .then(() => {
            res.redirect("/");
          })
          .catch((err) => {
            res.status(401).json({ erro: true, mensagem: "Erro" });
            res.redirect("admin/users/create");
          });
      } else {
        res.status(202).json({ error: true, mensagem: "Usuário já cadastrado" });
      }
    });
  } else {
    res.status(401).send({error: true, msg: "email invalido!" });
  }
});

// LOGIN E AUTENTICACAO //
router.get("/login", (req, res) => {
  const {user} = req.session;
 
  if (user == undefined) {
    res.render("admin/users/login");
  } else {
      res.redirect("/");
  }
});

router.post("/authenticate", (req, res) => {
  let {email, password} = req.body;

  User.findOne({ where: { email } }).then((user) => {
    if (user != undefined) {
      // se existe um usuario cadastrado
      // valida senha
      let correct = bcrypt.compareSync(password, user.password);
      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email,
        };
        res.redirect("/");
      } else {
        res.status(401).send({ error:true, msg: "Usuario ou Senha invalida!"});
      }
    } else {
      res.status(401).send({ error:true, msg: "Usuario nao encontrado"});
    }
  });
});

router.post('/users/delete',adminAuth,(req,res)=>{
const {id} = req.body;
const session = req.session.user;
let sessionId = JSON.stringify(session.id);


if (id != sessionId) {  
 if (!isNaN(sessionId)) {
  
    User.destroy({
      where:{
        id:id
      }
}).then(()=>{
  res.redirect('/admin/users');
})
}else{ 
  console.log('login igual');
}
}else{
  res.redirect('/admin/users');
}

})

router.get("/logout", adminAuth,(req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

module.exports = router;
