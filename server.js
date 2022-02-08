const express = require('express');
const app = express();
const PORT = process.env.PORT || 4001;


// npm i dotenv
// per passare json
app.use(express.json());
// senza urlencoded il form non passa i dati
app.use(express.urlencoded({ extended : false }));
// npm i ejs
app.set('view engine', 'ejs');
// npm i bcrypt
const bcrypt = require('bcrypt');
//npm i pg
const pool = require('./db');
// npm i express-flash
const flash = require('express-flash');
app.use(flash());


/******************** PER LA SESSIONE ***************************************** */
// npm i express-session
const session = require('express-session');

// npm i passport
// npm i passport-local
const passport = require('passport');
const initializePassport = require(`./auth/passportConfig`);
initializePassport(passport);

app.use(session({
    secret: 'secret',

    resave: false,

    saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());
/*************************** FINE ***************************************** */



/************************* user section ******************************************* */
const { 
    getIndex, 
    getLogin, 
    getRegister, 
    getDashboard, 
    getLogout, 
    postRegister 
} = require('./routes/user');

const { 
    checkAuthenticated, 
    checkNotAuthenticated 
} = require("./auth/AuthServices");

const {  
    getAllProducts 
} = require('./routes/product');

app.get('/', getIndex);
app.get('/login', checkAuthenticated, getLogin);
app.get('/register', checkAuthenticated, getRegister);
app.get('/dashboard', checkNotAuthenticated, getDashboard);
app.get('/products', getAllProducts);
app.get('/logout', getLogout)

app.post('/register', postRegister);
app.post('/login', passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
    })
);
/******************************************************************************** */


/****************************** admin section ************************************************** */
const { 
    getAdminLogin, 
    getadmindashboard, 
    postAdminLogin
} = require('./admin/admin');

app.get('/admin', getAdminLogin);
app.get('/admindashboard', getadmindashboard);
app.post('/admin', postAdminLogin);
/********************************************************************************** */


app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
});