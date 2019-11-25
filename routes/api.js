const express = require("express");
const router = express.Router();
const server = require("../index");
const config = require('../config/index');
const mysql = require('mysql');
const jwt = require('jsonwebtoken')
const preparedStmt = require("./preparedStatements");
var nodemailer = require('nodemailer');
const argon2 = require('argon2');
var validator = require("email-validator");
var sha3_512  = require("js-sha3").sha3_512;



const con = mysql.createConnection(config.dbConnection);

router.post("/register", async (req, res) =>  {
    con.query("USE bankdb");
    var login = req.body.login;
    var password = req.body.password;
    var email = req.body.email;
    var account_number = randomAccountNumber();

    if(login==="" || password==="" || email==="" || !validator.validate(email)) {
        res.json({
            status: 400,
            message: 'Nieprawidłowe dane',
        });
    }

    var hashedpassword = await sha3_512(password + email);
    con.query( {
        sql: preparedStmt.registerSTMT,
        values: [login, hashedpassword, email, account_number]
    },   function (err, result) {
        if (err) {
            if (err.sqlState==='50000'){
                res.json({
                    status: 500,
                    message: 'Spróbuj jeszcze raz!',
                });
            } else if (err.sqlState==='45000') {
                res.json({
                    status: 400,
                    message: err.sqlMessage,
                });
            } else  {
                throw err;
            }
        }
        else {
            res.json({
                status: 201,
           message: 'Rejestracja powiodła się!',
       });
        }
       
    });
});

router.post('/login',  (req, res) => {
    if(req.body.login==="" || req.body.password===""){
        res.json({
            status: 400,
            message: 'Nieprawidłowe dane',
        });
    }
    con.query("USE bankdb");
    con.query( {
        sql: preparedStmt.emailSTMT,
        values: [req.body.login]
    }, async  function (err, result,fields) {
        if (!result) {
            res.json({
                status: 500,
                message: "Nieprawidłowy login lub hasło",
            })

        } else if(!result[0]) {
            res.json({
                status: 500,
                message: "Nieprawidłowy login lub hasło",
            })
        } else  {
            var hashedpassword = await sha3_512(req.body.password + result[0].email);
            con.query( {
                sql: preparedStmt.loginSTMT,
                values: [req.body.login, hashedpassword],
            },   function (err, result) {
                if(!result[0]) {
            res.json({
                status: 500,
                message: "Nieprawidłowy login lub hasło",
            })
                } else {
                    console.log(result[0].id);
                    var token = jwt.sign({ id: result[0].id}, config.secret, {
                        expiresIn: 900, // expires in 15 minutes
                      });
                    res.json({
                        status: 200,
                        message: "Udało się zalogować!",
                        id: result[0].id,
                        auth: true,
                        token: token,
                    })
                }
            });
        }
       
    });
})


router.post('/remind/password', (req, res) => {
    var email = req.body.email;
    var new_pass = randomPassword(10);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bankapppwr@gmail.com',
          pass: 'b4nkapp_gm4il'
        }
      });
      
      var mailOptions = {
        from: 'bankapppwr@gmail.com',
        to: 'myfriend@yahoo.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
});

router.get('/history', verifyToken, (req, res) => {
    console.log(req.userId);
    con.query("USE bankdb");
    con.query( {
        sql: preparedStmt.myTransfersSTMT,
        values: [req.userId]
    },   function (err, result) {
        if (err) {
                throw err;
        }
        else {
            res.json({
                status: 201,
          transfers: result,

       });
        }
       
    });
})


router.get('/', (req, res) => {
    res.json({
        message: 'Behold The MEVN Stack!'
    });
});

function verifyToken(req, res, next) {
    console.log(req.headers['x-access-token']);
    var token = req.headers['x-access-token'];
    if (!token)
      return res.status(403).send({ auth: false, message: 'No token provided.' });
      
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
      // if everything good, save to request for use in other routes
      req.userId = decoded.id;
      next();
    });
  }
  

function randomPassword(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 function randomAccountNumber() {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 26; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

module.exports = router