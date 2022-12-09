require('dotenv').config()
const express = require('express');
const session = require('express-session');

const path = require('path');
const app = express();
const port = process.env.PORT || 8000;
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, "../public/views"))
app.use('/static',express.static('../public'))
app.use('/',require(path.join(__dirname,"../routes/loginroutes.js")))
app.use(express.urlencoded({ extended: false }))
app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
}) 

