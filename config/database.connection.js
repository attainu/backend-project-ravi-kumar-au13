const Sequelize = require('sequelize'); 

const khatadata = new Sequelize(
     "fczymiuh",
     "fczymiuh",
     "DRYuNQ1f3hBvFHkN8kiMyf0tcccs8nI5",
     {
     host:'kashin.db.elephantsql.com',
     dialect:'postgres'
     }
);

//It will create the table if it not exists
khatadata.sync({
    force:false
})

module.exports = khatadata
