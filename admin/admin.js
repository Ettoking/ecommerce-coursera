const express = require('express');
const router = express.Router();

// npm i bcrypt
const bcrypt = require('bcrypt');



const isAdmin = false;

const getAdminLogin = (req, res) => {
    res.render('adminlogin');
};


module.exports = {
    getAdminLogin
}
