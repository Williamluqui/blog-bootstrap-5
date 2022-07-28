function rolesAuth(req,res,next){
    const userRoles = req.session.user.roles ;
    
    if (userRoles.includes('admin')){
       next();
    }else{
        res.redirect("/login");
    }
} 
module.exports = rolesAuth; 