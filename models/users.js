const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define("user",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    ispremiumuser:Sequelize.BOOLEAN,
    totalExpenses:{
        type:Sequelize.STRING,
        defaultValue:0
    },
    totalIncome:{
        type:Sequelize.STRING,
        defaultValue:0
    },
    totalSavings:{
        type:Sequelize.STRING,
        defaultValue:0
    },
    Time:{
        type:Sequelize.STRING,
        defaultValue:0
    }
});

module.exports=User;