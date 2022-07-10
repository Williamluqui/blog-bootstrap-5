const express = require("express");
const router = express.Router();
const slugify  = require("slugify");
const Category = require("./Category");

const flash = require("connect-flash")
const session = require('express-session');
const Article = require("../articles/Article");
const adminAuth = require("../../middlewares/adminAuth");

router.use(flash())
router.use(session({
  secret:'secret',
  cookie:{maxAge:60000},
  resave: false,
  saveUninitialized:false
}));


router.get("/admin/categories/new",adminAuth,(req, res)=>{
  res.render("./admin/categories/new")
});

router.post("/categories/save",adminAuth,(req, res) =>{
  let {title} = req.body;

// SAVE CATEGORY BD //
   if(title){
    Category.create({
      title: title,
      slug: slugify(title)
    }).then(()=>{
      res.redirect("/admin/categories/");
    })
  }else{
    res.redirect("/admin/categories/new")
  }
});

router.get("/admin/categories",adminAuth, (req,res) => { // adicionar adminAuth
  Category.findAll().then(categories =>{
     res.render("admin/categories/index",{categories:categories});
  })
})

router.post("/categories/delete", adminAuth,(req,res)=>{
  let {id} = req.body;

if(id != undefined){
    if(!isNaN(id)){
        Category.destroy({
          where:{
            id:id
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
router.get("/admin/categories/edit/:id",adminAuth,(req, res)=>{
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

router.post("/categories/update",adminAuth,(req, res)=>{
let {id, title}= req.body;

  Category.update({title: title,slug:slugify(title)},{
    where: {
    id:id
  }
}).then(()=>{
  res.redirect("/admin/categories")
})
})

// router.get("/category/:slug",(req,res)=>{
// // SEARCH 
//  let {slug} = req.params;
//  const {user} = req.session;
//  Category.findOne({
//   where:{
//     slug:slug
//   },include: [{model:Article}]
//   }).then(category =>{
//     if(category){
//       Category.findAll().then(category=>{
//         Article.findAll().then(article =>{
//           console.log(slug)
//         res.render("homepage",{articles:article,category:category, user:user})
        
//         })
//       })
//     }else{
//       res.redirect("/s")
//     }
//  })
// })



router.get("/category/:slug",(req, res) => {
  let {slug} = req.params;
  const {user} = req.session;
  Category.findOne({
      where: {
          slug: slug
      },
      include: [{model: Article}]
  }).then( category => {
      if(category != undefined){
          Category.findAll().then(categories => {
              res.render("homepage",{articles: category.articles,category: categories, user:user});
          });
      }else{
          res.redirect("/");
      }
  }).catch( err => {
      res.redirect("/");
  })
})
module.exports = router;
