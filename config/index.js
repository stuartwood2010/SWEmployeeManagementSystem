const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    // Name of Database we want to connect to.
    process.env.DB_NAME,
    // Which user do we want to connect as
    process.env.DB_USER,
    // What is the password of the user we want to connect as?
    process.env.DB_PASSWORD,
    // Configuration Object for the datatbase we want to connect to.
    {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306,
    }
);
module.exports = sequelize;