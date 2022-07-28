function auth(req,res,next){
   
    const {user} = req.session ;
    if (user != undefined){
        next();
    }else{
        res.redirect("/login");
    }
}



module.exports = auth;