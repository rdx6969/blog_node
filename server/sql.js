
const mysql = require('mysql');
const sqlconnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database: 'stp' 

})
sqlconnection.connect((err)=>{
    if(!err)
    console.log('Data base connected');
    else
    console.log('Err is'+err);

})

module.exports = sqlconnection