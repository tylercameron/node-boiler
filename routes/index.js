const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const dealController = require('../controllers/dealController');
const categoryController = require('../controllers/categoryController');

const { catchErrors } = require('../handlers/errorHandlers');

// router.get('/', storeController.getStores);
router.get('/', dealController.getAllDeals);

router.get('/add-store', authController.isLoggedIn, storeController.addStore);
router.post('/add-store', 
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.createStore)
);
router.post('/add/:id',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore)
);

router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/login', userController.loginForm);
router.get('/auth/google', authController.login);
router.get('/auth/google/callback', authController.googleAuth);
router.get('/logout', authController.logout);
router.get('/account', authController.isLoggedIn, userController.account);

router.get('/deals', catchErrors(dealController.getAllDeals));
router.get('/add-deal', 
    authController.isLoggedIn, 
    dealController.addDeal
);
router.post('/deals/add', catchErrors(dealController.createDeal));

router.get('/categories', catchErrors(categoryController.getCategories));
router.get('/categories/add', authController.isLoggedIn, categoryController.addCategories);
router.post('/categories/add', authController.isLoggedIn, catchErrors(categoryController.createCategories));

module.exports = router;
