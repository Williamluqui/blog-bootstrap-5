require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");

const categoriesController = require("./routes/categories/CategoriesController");
const articlesController = require("./routes/articles/ArticlesController");
const connection = require("./database/database");
const port = process.env.PORT;
const secret = process.env.COOKIE_SECRET;

const Article = require("./routes/articles/Article");
const Category = require("./routes/categories/Category");
const UsersController = require("./routes/users/UsersController");

const flash = require("connect-flash")
const auth = require("./middlewares/auth");
const rolesAuth = require("./middlewares/rolesAuth")
const moment = require('moment');
moment().format();


// SECRET KEY // 
app.use(session({
  secret: secret,
  cookie:{maxAge: 3600000},// 1 HR
  resave: true,
  saveUninitialized: true
}));


// VIEW ENGINE
app.set("view engine", "ejs");

// STATIC CCS
app.use(express.static("public"));

// BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.json());
//ROUTES
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", UsersController);


 
 
app.get("/",(req, res) => {
  //HOME PAGE //
const {user} = req.session;
Article.findAll({
    order: [["id", "DESC"]],
    limit: 4,
}).then((articles) => { 
   Category.findAll().then((category) => {
   if ( articles != undefined){
      res.render("homepage", { articles: articles, category: category,user:user,message: req.flash('message')});   
    }      
  });
 });
});


app.use((req, res) => {
  res.render("404");
});

//DATABASE
connection
  .authenticate()
  .then(() => {
    console.log("Conexão com BD foi estabelecida com sucesso");
  })
  .catch(() => {
    console.log('Não foi possível se conectar com o banco de dados!');
  });



app.listen(port, () => {
  console.log("**Servidor On**");
});
