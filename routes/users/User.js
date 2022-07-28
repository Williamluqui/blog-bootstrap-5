const Sequelize = require("sequelize");
const connection = require("../../database/database");

const User = connection.define('users',{
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            isEmail:true
        }
    },password:{
        type:Sequelize.STRING, 
        allowNull: false
    },roles:{
        type:Sequelize.ENUM,
        allowNull:false,
        values:['admin','moderator'],
        defaultValue: 'moderator' 
    }
})

// User.sync({force:false}) // Sincornizar com o BD
module.exports = User;