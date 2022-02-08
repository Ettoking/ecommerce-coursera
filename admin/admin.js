const express = require('express');
const router = express.Router();

// npm i bcrypt
const bcrypt = require('bcrypt');
const req = require('express/lib/request');

// npm i dotenv
require("dotenv").config();

const isAdmin = false;

const getAdminLogin = (req, res) => {
    res.render('adminlogin');
};


let adminlogged = false;

const getadmindashboard = (req, res) => {
    if (adminlogged){
        res.render('admindashboard')
    } else {
        res.status(500).send("not logged");
    }
}



const postAdminLogin = (req, res) => {
    let { name, password } = req.body;
    const nameEnv = process.env.ADMIN;
    const passwordEnv = process.env.ADMIN_PASSWORD;
    console.log({ name, password });
    console.log(nameEnv, passwordEnv)
    adminlogged = true;
    if (name === nameEnv && password === passwordEnv){
        res.redirect('admindashboard')
    } else {
        res.status(500);
    }
};



module.exports = {
    getAdminLogin, 
    getadmindashboard,
    postAdminLogin
}
