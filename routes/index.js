const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', storeController.getStores);

router.get('/add', authController.isLoggedIn, storeController.addStore);
router.post('/add', 
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

module.exports = router;
