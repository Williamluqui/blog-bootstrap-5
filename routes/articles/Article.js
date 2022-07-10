const Sequelize = require("sequelize");
const Category = require("../categories/Category")
const connection = require("../../database/database");

const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{
        type:Sequelize.STRING,
        allowNull: false
    },
    body:{
        type:Sequelize.TEXT,
        allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      },
    
})
Category.hasMany(Article); // uma categoria tem muitos artigos 1-m
Article.belongsTo(Category); // relacionamento com a categoria 1-1 sequelize

// Article.sync({force: true}) // sincronism table 


module.exports = Article;