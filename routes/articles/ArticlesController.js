const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../../middlewares/adminAuth");




router.get("/admin/articles", adminAuth,(req, res) => {
  Article.findAll({
    include: [{ model: Category }],
  }).then((articles) => {
    res.render("admin/articles/index", {
      articles: articles.filter((a) => a.category != undefined),
    });
  });
});
// NOVO ARTIGO
router.get("/admin/articles/new", adminAuth,(req, res) => {
  Category.findAll()
    .then((categories) => {
      res.render("admin/articles/new", { categories: categories });
    })
    .catch(() => {
      res.redirect("404")
    });
});
router.get("/post/:slug", (req, res) => {
  let slug = req.params.slug;
  let user = req.session.user;

  Article.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Category }],
  }).then((article) => {
    Category.findAll().then((category)=>{
      if (article != undefined) {
          res.render("posts", { article: article,category:category,user:user });
        }
    })
  });
});

router.get("/admin/articles/edit/:slug",adminAuth, (req, res) => {
  // EDITAR ARTIGO
  let slug = req.params.slug;
  
  Article.findOne({ where: { slug: slug } }).then((article) => {
    Category.findAll().then((category) => {
      if (article != undefined) {
        res.render("admin/articles/edit", {
        article: article,
        category: category,
      });
      }else{
        res.render('admin/articles/')
      }
      
    });
  });
});

router.post("/article/update",adminAuth, (req, res) => {
  //ATUALIZAR O BD APOS EDITAR O ARQUIVO
  let id = req.body.id;
  let title = req.body.title;
  let body = req.body.body;
  let category = req.body.category;

  Article.update(
    { title: title, slug: slugify(title), body: body, categoryId: category },
    {
      where: {
        id: id,
      },
    }
  )
    .then(() => {
      res.redirect("/admin/articles") // inserir msg de sucesso
    })
    .catch((err) => {
      res.redirect("404");
    });
});

router.post("/articles/save", adminAuth,(req, res) => {
  //  SAlVAR ARTIGO
  let title = req.body.title;
  let body = req.body.body;
  let category = req.body.category;

  Article.create({
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: category,
  }).then(() => {
    res.redirect("/admin/articles");
  });
});

router.post("/articles/delete", adminAuth,(req, res) => {
  // DELETAR ARTIGO
  let id = req.body.id;

  if (id != undefined) {
    if (!isNaN(id)) {
      Article.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect("/admin/articles");
      });
    } else {
      res.redirect("/admin/articles");
    }
  } else {
    res.redirect("/admin/articles");
  }
});

router.get("/articles/page/:num", (req, res, next) => {
  // PAGINACAO DE PAGINA
  let page = req.params.num;
  let user = req.session.id;
  let offset = 0;

  if (isNaN(page) || page <= 1) {
    offset = 0;
  } else {
    offset = (parseInt(page) - 1) * 4;
  }
  Article.findAndCountAll({
    limit: 4,
    offset: offset,
    order: [["id", "DESC"]],
  }).then((articles) => {
    let next;
    if (offset + 4 >= articles.count) {
      next = false;
    } else {
      next = true;
    }
    let result = {
      page:parseInt(page),
      next: next,
      articles: articles,
    };
    Category.findAll().then((category) => {
      res.render("admin/articles/page", { category: category, result: result,user:user });
    });
  });
});

module.exports = router;
