const express = require('express');
const app = express();
const bcrypt = require('bcrypt')
const sqlconnection = require('../server/sql')
const router = express.Router()



app.use(express.urlencoded({ extended: false }))
router.use(express.urlencoded({ extended: false }))





router.get('/', (req, res) => {
    res.render('landing')
})
router.get('/login', (req, res) => {
    console.log(req.sessionID);
    if(!req.session.usermail){
        res.render('login.pug')
    }
    else{
        res.redirect('/home');
    }
})
router.post('/login', (req, res) => {
const {email , password} = req.body;
    
const fetch_query = `SELECT * FROM users WHERE email = '${email}'`;
    sqlconnection.query(fetch_query, async (err, rows, feilds) => {
        if (await rows.length == 0) {
            res.render('login.pug', { usererr: "this email Dosent exist" })
        }
        else {
            const passMatch =await bcrypt.compare(password,rows[0].password);
            if(!passMatch){
                res.render('login.pug',{passerr:"password doesn't matched"})
            }
            else{
                const usermail = {
                    u_mail:email
                }
                req.session.usermail = usermail
                req.session.save()
                res.redirect('/home')
            }
        }
})
})

router.get('/register', (req, res) => {
    res.render('register.pug')
})


router.post('/register', async (req, res) => {
const {name,email ,password} = req.body
    const fetch_query = `SELECT * FROM users WHERE email = '${email}'`;
    sqlconnection.query(fetch_query, async (err, rows, feilds) => {
        if (await rows.length == 0) {
            try {
                const hashedPassword = await bcrypt.hash(password, 10)
                const insert_query = `INSERT INTO users(id, name, email, password) VALUES ('null','${name}','${email}','${hashedPassword}')`;
                sqlconnection.query(insert_query, (err, rows, feilds) => {
                    if (err) throw err;
                })
                res.redirect('/login')
            } catch {
                res.redirect('/register')
            }
        }
        else {
            res.render('register.pug', { error: "this email is already taken" })
        }

    })

})


router.get('/home', (req, res) => {
    if (req.session.usermail) {
        console.log(req.session.usermail);
        res.render('home.pug',{user:req.session.usermail})
    }
    else{
        res.redirect('/login');
    }
})
router.post('/logout', (req, res) => {
    if (req.session.usermail) {
        res.redirect('/login')
    }
    req.session.destroy((err)=>{
        if(err) throw err
    })
})
module.exports = router