// npm i dotenv
require("dotenv").config();



/*
const isProduction =  process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.envDB_PORT}/${process.envDB_DATABASE}`;

const pool = new Pool({
    connectionString : isProduction ? process.env.DATABASE_URL : connectionString
});
*/



const Pool = require('pg').Pool;


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});



module.exports = pool;