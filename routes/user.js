const express = require('express');
const router = express.Router();

// npm i bcrypt
const bcrypt = require('bcrypt');

//npm i pg
const pool = require('../db');


const getIndex = (req, res) => {
    res.render('index');
};

const getLogin = (req, res) => {
    res.render('login');
};

const getRegister = (req, res) => {
    res.render('register');
};

const getDashboard = (req, res) => {
    res.render('dashboard', { user: req.user.name });
};

const getLogout = (req, res) => {
    req.logOut();
    req.flash("success_msg", "You have logged out");
    res.redirect('login');
};

const postRegister = async (req, res) => {
    let { name, email, password, password2 } = req.body;

    console.log({ name, email, password, password2 });

    // check validation form
    
    let errors = [];

    if (!name || !email || !password || !password2){
        errors.push({ message : "Please enter all the fields"});
    }
    if(password.length < 6){
        errors.push({ message : "password should be at least 6 characters"});
    }

    if(password != password2){
        errors.push({ message : "passwords do not match"});
    }

    if(errors.length > 0){
        console.log(errors);
        res.render('register', { errors });
    } else {

        // Form validation has passed

        // cripto la password
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        
        pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email],
            (error, results) => {
                if (error){
                    throw error;
                }
                console.log(results.rows);

                // se c'è almeno un risultato vuol dire che l'email è già stata registrata
                if (results.rows.length > 0){
                    errors.push({ message: "Email already registered"});
                    console.log(errors);
                    res.render('register', { errors });
                } else {
                    pool.query(
                        `INSERT INTO users (name, email, password)
                        VALUES ($1, $2, $3)
                        RETURNING id, password`,
                        [name, email, hashedPassword],
                        (error, results) => {
                            if(error) {
                                throw error;
                            }
                            console.log(results.rows);
                            req.flash('success_msg', "You are now registered. Please log in");
                            res.redirect('login');
                        }
                    )
                }

            }
        )

    }


};



module.exports = {
    getIndex,
    getLogin,
    getRegister,
    getDashboard,
    getLogout,
    postRegister
}