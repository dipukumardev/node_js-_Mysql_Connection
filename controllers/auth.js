const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.register = (req, res) => {
    console.log(req.body);

    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordconfirm = req.body.passwordconfirm;


    const { name, email, password, passwordconfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        }

        else if (password !== passwordconfirm) {
            return res.render('register', {
                message: 'Password do not match'
            });
        }

        let heshedPassword = await bcrypt.hash(password, 8);
        console.log(heshedPassword);

        db.query('INSERT INTO users SET ?', { name: name, email: email, password: heshedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'User Registerd'
                })
            }
        })
    });






}