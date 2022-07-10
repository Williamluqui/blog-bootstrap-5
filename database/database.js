const Sequelize = require("sequelize");

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;


  


const connection = new Sequelize(dbName,dbUser,dbPassword,{
    host:dbHost,
    dialect:'mysql',
    logging: false,
    timezone: '-03:00',
        dialectOptions: {
            timezone: "local",
        }
});


module.exports = connection;
