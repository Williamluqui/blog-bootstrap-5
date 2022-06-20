const express = require("express");
const router = express.Router();
const Category = require("../categories/Category")
const Article = require("./Article");
const slugify = require("slugify");

const flash = require("connect-flash")
const session = require('express-session');

router.use(flash())
router.use(session({
  secret:'secret',
  cookie:{maxAge:60000},
  resave: false,
  saveUninitialized:false
}));


router.get("/admin/articles",(req, res) =>{
  Article.findAll({
    include: [{model:Category}]
  }).then(articles => {
    res.render("admin/articles/index",{ articles: articles.filter(a => a.category != undefined) });
  })
});
// NOVO ARTIGO
router.get("/admin/articles/new",(req, res) => {
  Category.findAll().then(categories =>{
    res.render("admin/articles/new",{categories:categories})
    
  }).catch(()=>{
    res.status(401).send({error:true ,msg: "Não encontrado"})
  })
  
})
router.get("/post/:slug",(req,res)=>{
  let slug = req.params.slug
 


  Article.findOne({
    where:{
      slug:slug,
      
    },
    include:[{model:Category}]
  })
  .then(article=>{
    if(article != undefined){
      res.render("posts",{article:article});
    }
    
    // console.log(article.title)
  })
 
})




router.get("/admin/articles/edit/:slug",(req, res)=>{
  // EDITAR ARTIGO
  let slug = req.params.slug;
  let categories = req.params.title
  

  Article.findOne({where:{slug:slug}})
  .then(article=>{
    Category.findAll().then(category=>{
      res.render("admin/articles/edit",{article: article, category:category})
      
  })
})
})




router.post("/article/update",(req, res)=>{
  //ATUALIZAR O BD APOS EDITAR O ARQUIVO
  let id = req.body.id
  let title= req.body.title;
  let body = req.body.body
  let category = req.body.category
    
      Article.update({title:title, slug:slugify(title),body:body,categoryId:category },{
         where: {
         id:id
         
    }
  }).then(()=>{
    res.redirect("/admin/articles")
    console.log(slugify(title) , title, body,category)
    
  }).catch((err)=>{
    res.redirect('/').status(401)
  })
  });





router.post("/articles/save",(req, res)=>{
//  SAVAR ARTIGO

  let title = req.body.title;
  let body = req.body.body;
  let category = req.body.category;

  Article.create({
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: category
  }).then(()=>{
    res.redirect("/admin/articles")
  })

})

router.post("/articles/delete", (req,res)=>{
  let id = req.body.id;
  
if(id != undefined){
    if(!isNaN(id)){

      Article.destroy({
        where:{
          id:id
        }
      }).then(()=>{
        res.redirect("/admin/articles");
      })
    }else{
      res.redirect("/admin/articles");
    } 
}else{
  res.redirect("/admin/articles");
}
});


module.exports = router;
