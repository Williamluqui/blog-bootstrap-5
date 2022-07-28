const express = require("express");
const router = express.Router();
const slugify  = require("slugify");
const Category = require("./Category");

const flash = require("connect-flash")
const session = require('express-session');
const Article = require("../articles/Article");
const auth = require("../../middlewares/auth");

router.use(flash())
router.use(session({
  secret:'secret',
  cookie:{maxAge:60000},
  resave: false,
  saveUninitialized:false
}));


router.get("/admin/categories/new",auth,(req, res)=>{
  res.render("./admin/categories/new")
});

router.post("/categories/save",auth,(req, res) =>{
  let {title} = req.body;

// SAVE CATEGORY BD //
   if(title){
    Category.create({
      title,
      slug: slugify(title)
    }).then(()=>{
      res.redirect("/admin/categories/");
    })
  }else{
    res.redirect("/admin/categories/new")
  }
});

router.get("/admin/categories",auth, (req,res) => { // adicionar adminAuth
  Category.findAll().then(categories =>{
     res.render("admin/categories/index",{categories:categories});
  })
})

router.post("/categories/delete", auth,(req,res)=>{
  let {id} = req.body;

if(id != undefined){
    if(!isNaN(id)){
        Category.destroy({
          where:{
            id
          }
         }).then(()=>{
        res.redirect("/admin/categories");
      })
       
     
  }else{
      res.redirect("/admin/categories");
    } 
}else{
  res.redirect("/admin/categories");
}
});

//EDIT CATEGORY
router.get("/admin/categories/edit/:id",auth,(req, res)=>{
  let {id} = req.params;
  // Corrigir erro ao digitar id e letras no html
  if (isNaN(id)) { 
    res.redirect("/admin/categories")
  }else{
    // verificando se uma categoria corresponde ao id
  Category.findByPk(id).then(category =>{
    if (category != undefined) {
      res.render("admin/categories/edit",{ category:category})
    }else{
      res.redirect("/admin/categories");
    }
  }).catch(erro =>{
    res.redirect("/admin/categories");
    req.status(401)
  })
  }
})

router.post("/categories/update",auth,(req, res)=>{
let {id, title}= req.body;

  Category.update({title: title,slug:slugify(title)},{
    where: {
    id
  }
}).then(()=>{
  res.redirect("/admin/categories")
})
})



router.get("/category/:slug",(req, res) => {
  let {slug} = req.params;
  const {user} = req.session;
  let message = [];
  Category.findOne({
      where: {
          slug
      },
      include: [{model: Article}]
  }).then( category => {
      if(category != undefined){
          Category.findAll().then(categories => {
              res.render("homepage",{articles: category.articles,category: categories, user:user,message});
          });
      }else{
          res.redirect("/");
      }
  }).catch( err => {
      res.redirect("/");
  })
})
module.exports = router;
