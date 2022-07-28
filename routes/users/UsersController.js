const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const session = require("express-session");
const secret = process.env.COOKIE_SECRET;
const cookieParse = require("cookie-parser");
const bodyParser = require("body-parser");
const auth = require("../../middlewares/auth");
const rolesAuth = require("../../middlewares/rolesAuth")

router.use(bodyParser.json());
router.use(cookieParse("hsluyrnf"));

router.use(
  session({
    secret: secret,
    cookie: { maxAge: 3600000 }, // 1 HR
    resave: true,
    saveUninitialized: true,
  })
);
router.use(flash());

// LISTAGEM DE USUARIOS //
router.get("/admin/users",auth,rolesAuth, (req, res) => {
  const session = req.session.user;
  const sessionId = JSON.stringify(session.id);
  const msgErro = "";
  User.findAll().then((user) => {
    res.render("admin/users/users", {
      user: user,
      sessionId: sessionId,
      msg: msgErro,
      roles:session.roles
    });
  });
});

// CADASTRAR USUARIO NO BD //
router.get("/users/new/", (req, res) => {
  res.render("admin/users/new");
});

router.post("/users/create", (req, res) => { // fechar rota
  const { email, password, passwordRepeat } = req.body;

  const regex_validation =
    /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;

    if (!regex_validation.test(email)) {
      return res.status(400).json({mensagem:"email inválido"});
    }
  if (password == passwordRepeat ) {
    User.findOne({ where: { email: email } }).then((user) => {
      if (user == undefined) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        User.create({
          email: email.toLowerCase(),
          password: hash,
          roles: "moderator"
        })
          .then(() => {
            res.redirect("/");
          })
          .catch((err) => {
            res.status(401).json({ erro: true, mensagem: "Erro" });
            res.redirect("admin/users/create");
          });
      } else {
        res.status(202)
          .json({ error: true, mensagem: "Usuário já cadastrado" });
          
      }
    });
  } else {
    res.status(401).send({ error: true, mensagem: "Insira um email valido!" });
  }
});

// LOGIN E AUTENTICACAO //
router.get("/login", (req, res) => { 
  const { user } = req.session;
  let message = req.flash("message", "");
  if (user == undefined) {
    res.render("admin/users/login", { message });
  } else {
    res.redirect("/");
  }
});


router.post("/authenticate", (req, res) => { // fechar rota
  let { email, password } = req.body;

  User.findOne({ where: { email } }).then((user) => {
    if (user != undefined) {
      // se existe um usuario cadastrado
      // valida senha
      let correct = bcrypt.compareSync(password, user.password);
      if (correct) {
        req.flash("message", "Login Successfully");
        req.session.user = {
          id: user.id,
          email: user.email,
          roles:user.roles
        };
        setTimeout(() => {
          res.redirect("/");
        }, 1000);
      } else {
        req.flash("message", " ");
       res.redirect("/login")
      }
    } else {
      req.flash("message", "Usuario ou senha invalidos");
      res.redirect("/login");
      // res.status(401).json({ error:true, msg: "Usuario ou senha nao encontrado"});
    }
  });
});

router.post("/users/delete", auth,rolesAuth, (req, res) => {
  const { id } = req.body;
  const session = req.session.user;
  let sessionId = JSON.stringify(session.id);

  if (id != sessionId) {
    if (!isNaN(sessionId)) {
      User.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect("/admin/users");
      });
    } else {
      console.log("login igual");
    }
  } else {
    res.redirect("/admin/users");
  }
});

router.get("/logout", auth,(req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

module.exports = router;
