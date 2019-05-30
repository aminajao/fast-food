const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');


const isAuthenticated = require('../middleware/is-auth');

const router = express.Router();

router.get('/index', shopController.getHomePage);

router.get('/shop', shopController.getProducts);

router.get('/shop/:productId', shopController.getProduct);

router.get('/cart', isAuthenticated, shopController.getCart);

router.post('/cart', isAuthenticated, shopController.postCart);

router.post('/cart-delete-item', isAuthenticated, shopController.postCartDeleteProduct);

router.post('/create-order', isAuthenticated, shopController.postOrder);

router.get('/orders', isAuthenticated, shopController.getOrders);

router.get('/checkout', isAuthenticated, shopController.getCheckout);

// router.get('/order/:orderId', isAuthenticated, shopController.getInvoice);


module.exports = router;
