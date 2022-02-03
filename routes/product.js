//npm i pg

const pool = require('../db');

const getProducts = (req, res) => {
    pool.query('SELECT name FROM products ORDER BY id ASC', (error, results) => {
        if (error) {
          throw error
        }
        const products = results.rows;
        products.forEach(product => console.log(product.name));
        const output = [];
        products.forEach(product => output.push(product.name));
        res.json([... output]);
        
        
      })
};


// aggiungere prodotto al carrello  ...da implementare
const addToCart = (req, res) => {
  pool.query(`SELECT name FROM PRODUCTS WHERE id = $1`, [id], (error, results) => {
    if (error) {
      throw error
    }
    const cart = [];
    const product = results.rows;
    cart.push(product);
    res.json(cart);
  })
}


module.exports = {
    getProducts,
    addToCart
}