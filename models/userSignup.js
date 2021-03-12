const Sequelize = require('sequelize')
const khatadata = require('../config/database.connection')

//Model of 'users' table

const UserSignup = khatadata.define('users',{
    uuid:{
        type:Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        message:"Please enter your name"
    },
    firm_name:{
        type:Sequelize.STRING,
        message:"Please enter your firm name"
    },
    email:{
        type:Sequelize.STRING,
        unique:true,
        message:"Please enter your email"
    },
    password:{
        type:Sequelize.STRING,
        message:"Please enter the password"
    }
},
    {
        timestamps:true
    }
)


UserSignup.associate = (models)=>{
    UserSignup.hasMany(models.user)
}


module.exports = UserSignup
