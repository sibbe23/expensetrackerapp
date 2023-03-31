const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(process.env.SCHEMA_NAME,process.env.ROOT_USER,process.env.SCHEMA_PASS,{
    dialect: 'mysql',
    host: process.env.LOCALHOST
});
module.exports = sequelize;