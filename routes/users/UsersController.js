const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

const flash = require("connect-flash");


// LISTAGEM DE USUARIOS // 
router.get("/admin/users",(req, res)=>{
  User.findAll().then(user=>{
    res.render("admin/users/users",{user:user})
  })
  
});



router.post("/users/create",(req, res)=>{
  // CADASTRAR USUARIO NO BD //
  let email = req.body.email;
  let password = req.body.password;
  
  User.findOne({where:{email:email}}).then(user=>{
    if(user == undefined){
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(password, salt);
      
    User.create ({
       email:email,
       password: hash
    }).then(()=>{
      
      res.redirect("/");
    }).catch((err)=>{
      res.status(201).json({erro:false, mensagem: 'Usuário cadastrado'})
      res.redirect("admin/users/create");
    })
    }else{
      res.status(202).json({erro:true, mensagem: 'Usuário já cadastrado'})
     
  }
  })
  });



 // LOGIN E AUTENTICACAO // 

router.get("/admin/users/new/", (req, res)=>{    
  res.render("admin/users/new")

});

router.get("/login",(req, res)=>{
  res.render("admin/users/login")
})

router.post("/authenticate",(req, res)=>{
  let email = req.body.email
  let password = req.body.password
  User.findOne({where:{email:email}}).then(user =>{
    if (user != undefined) { // se existe um usuario cadastrado
      // valida senha
      let correct = bcrypt.compareSync(password, user.password)
      if(correct){
        req.session.user = {
          id : user.id,
          email: user.email
        }
        res.status(201).json(req.session.user)
      }else{
        res.status(401).json({msg:'nao logado'})
      }
    }else{
      res.status(401).json({msg:'nao logado'})
    }
  })
  
})





module.exports = router;