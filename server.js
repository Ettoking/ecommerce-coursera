const express = require('express');
const app = express();

const { products, getProducts } = require('./sql/queries');

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



/** PER LA SESSIONE */

// npm i express-session
const session = require('express-session');

// npm i passport
// npm i passport-local
const passport = require('passport');
const initializePassport = require(`./passportConfig`);
initializePassport(passport);


app.use(session({
    secret: 'secret',

    resave: false,

    saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

/** FINE */


// npm i express-flash
const flash = require('express-flash');

app.use(flash());


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', checkAuthenticated, (req, res) => {
    res.render('login');
});

app.get('/register', checkAuthenticated, (req, res) => {
    res.render('register');
});

app.get('/dashboard', checkNotAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user.name });
});

app.get('/products', getProducts);

app.get('/logout', (req, res) => {
    req.logOut();
    req.flash("success_msg", "You have logged out");
    res.redirect('login');
})

/** Funziona mostra il json di tutti i prodotti nella tabella 
app.get('/', (req, res) => {
    pool.query('SELECT * FROM products', (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
});
*/


app.post('/register', async (req, res) => {
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


});


app.post('/login', passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
    })
);


function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect('/dashboard');
    }
    next();
}


function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}


app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
});