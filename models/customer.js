const Sequelize = require('sequelize')
const khatadata = require('../config/database.connection')

//Model of table named 'customers'.Here, user_id is the foreign key

const customerSchema = khatadata.define('customers',{
    customer_id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        require: true
    },
    name:{
        type:Sequelize.STRING,
        require:true
    },
    phone_number:{
        type:Sequelize.CHAR(10),
        require:true
    },    
    total_amount:{
        type:Sequelize.INTEGER
    },    
    amount_paid:{
        type:Sequelize.INTEGER
    },    
    amount_due:{
        type:Sequelize.INTEGER
    },  
    date_of_transaction:{
        type:Sequelize.DATEONLY
    },
    due_date_of_payment:{
        type:Sequelize.DATEONLY
    },
    user_id:{
        type:Sequelize.UUID,
        allowNull:false,
        references:{
            model:'users',
            key:'uuid'
        }
    }
    
},
{
    timestamps: false
});  

customerSchema.associate=(models)=>{
    customerSchema.belongsTo(models.signup)
}

module.exports = customerSchema
