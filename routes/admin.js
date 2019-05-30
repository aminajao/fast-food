const path = require('path');

const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin'); 

const isAuthenticated = require('../middleware/is-auth');
const { check } = require('express-validator/check');


// /admin/add-product => GET
// router.get('/add-product', check('description').isString().isLength({min: 12}) , isAuthenticated, adminController.getAddProduct);

// router.get('/edit-product/:productId', isAuthenticated, adminController.getEditProduct);

// router.post('/edit-product', isAuthenticated, adminController.postEditProduct);

// router.get('/products', isAuthenticated, adminController.getProducts);

// router.post('/delete-product', isAuthenticated, adminController.postDeleteProduct);

// /admin/add-product => POST
// router.post('/add-product', isAuthenticated, adminController.postAddProduct);

module.exports = router;
