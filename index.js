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
const User = require("./routes/users/User")



// SECRET KEY // 
app.use(session({
  secret: secret,
  cookie:{maxAge: 3600000},// 1 HR
  resave: true,
  saveUninitialized: true

}))

 
// VIEW ENGINE
app.set("view engine", "ejs");

// STATIC CCS
app.use(express.static("public"));

// BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.json())
//ROUTES
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", UsersController);



app.get("/", (req, res) => {
  // PAGINA HOME //

  Article.findAll({
    order: [["id", "DESC"]],
    limit: 4,
  }).then((articles) => {
    Category.findAll().then((category) => {
      res.render("homepage", { articles: articles, category: category });
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
    console.log("Banco de dados ok");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(port, () => {
  console.log("**Servidor On**");
});
