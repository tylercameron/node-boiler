const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const dealController = require('../controllers/dealController');
const categoryController = require('../controllers/categoryController');

const { catchErrors } = require('../handlers/errorHandlers');
const { userIsVendor } = require('../handlers/userVerification');
const { userIsAdmin } = require('../handlers/userVerification');

// router.get('/', storeController.getStores);
router.get('/', dealController.getAllDeals);

// =======   STORES   ======= //
router.get('/add-store', 
    authController.isLoggedIn, 
    userIsVendor, 
    storeController.addStore
);
router.post('/add-store', 
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.createStore)
);
router.post('/add-store/:id',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore)
);
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

// =======   USERS   ======= //
router.get('/login', userController.loginForm);
router.get('/auth/google', authController.login);
router.get('/auth/google/callback', authController.googleAuth);
router.get('/logout', authController.logout);
router.get('/account', authController.isLoggedIn, userController.account);
router.get('/vendor-signup', authController.isLoggedIn, userController.stripe);
router.post('/api/stripe', userController.payment);

// =======   DEALS   ======= //
router.get('/deals', catchErrors(dealController.getAllDeals));
router.get('/deals/:day', catchErrors(dealController.getAllDeals));
router.get('/deal/:deal', dealController.getDeal);
router.get('/add-deal', 
    authController.isLoggedIn, 
    dealController.addDeal
);
// router.post('/deals/add', catchErrors(dealController.createDeal));
router.post('/add-deal', catchErrors(dealController.createDeal));
router.get('/deals/:id/edit', 
    authController.isLoggedIn, 
    catchErrors(dealController.editDeal)
);
router.post('/add-deal/:id',
    // storeController.upload,
    // catchErrors(storeController.resize),
    catchErrors(dealController.updateDeal)
);

// =======   CATEGORIES   ======= //
// router.get('/categories', catchErrors(categoryController.getCategories));
router.get('/categories', catchErrors(dealController.getDealsByCategory));
router.get('/categories/add', 
    authController.isLoggedIn, 
    userIsAdmin, 
    categoryController.addCategories
);
router.get('/categories/:category', catchErrors(dealController.getDealsByCategory));
router.post('/categories/add', 
    authController.isLoggedIn, 
    userIsAdmin, 
    catchErrors(categoryController.createCategories)
);

module.exports = router;
