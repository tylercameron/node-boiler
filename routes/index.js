const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
// const userController = require('../controllers/userController');
// const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', storeController.homePage);
router.get('/add', storeController.addStore);

router.post('/add', 
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.createStore)
);

// router.get('/', (req, res) => {
//   const turtle = {
//     name: "T",
//     age: 30,
//     location: "Aus"
//   }
//   // res.send('Hey! It works!');
//   // res.json(turtle);
//   // res.json(req.query.name); //this grabs info from url query and displays
//   res.render('hello', {
//     name: 'test',
//     dog: req.query.dog,
//     title: 'example-title'
//   }); // redner allows us to render a template - in our views
// });

// router.get('/reverse/:name', (req, res) => {
//   // res.send('it works!');
//   const reverse = [...req.params.name].reverse().join("");
//   // res.send(req.params.name) // params takes name from url (: in front means it can change)
//   res.send(reverse);
// })



// router.get('/', catchErrors(storeController.getStores)); // call controller to render logic commented out below
// router.get('/stores', catchErrors(storeController.getStores));
// router.get('/stores/page/:page', catchErrors(storeController.getStores));
// router.get('/add', authController.isLoggedIn, storeController.addStore);

// router.post('/add', 
//   storeController.upload, 
//   catchErrors(storeController.resize),
//   catchErrors(storeController.createStore)
// ); //how to catch errors with async await - wrap function
// router.post('/add/:id', 
//   storeController.upload,
//   catchErrors(storeController.resize),
//   catchErrors(storeController.updateStore)
// );

// router.get('/stores/:id/edit', catchErrors(storeController.editStore));

// router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

// router.get('/tags', catchErrors(storeController.getStoresByTag));
// router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

// router.get('/login', userController.loginForm);
// router.post('/login', authController.login);
// router.get('/register', userController.registerForm);

// // 1. Validate the registration data
// // 2. register the user
// // 3. we need to log them in
// router.post('/register',
//   userController.validateRegister,
//   // we need to know about errors if 
//   // validation will be passed, but registration 
//   // will be failed in some reasons, e.g. second 
//   // registration with same email
//   catchErrors(userController.register),
//   authController.login
// );

// router.get('/logout', authController.logout);

// router.get('/account', 
//     authController.isLoggedIn,
//     userController.account
// );
// router.post('/account', catchErrors(userController.updateAccount));

// router.post('/account/forgot', catchErrors(authController.forgot));
// router.get('/account/reset/:token', catchErrors(authController.reset));
// router.post('/account/reset/:token', 
//     authController.confirmedPasswords, 
//     catchErrors(authController.update)
// );

// router.get('/map', storeController.mapPage);

// router.post('/reviews/:id', 
//     authController.isLoggedIn, 
//     catchErrors(reviewController.addReview)
// );

// router.get('/top', catchErrors(storeController.getTopStores));

// router.get('/api/search', catchErrors(storeController.searchStores));

// router.get('/api/stores/near', catchErrors(storeController.mapStores));
// router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));

// router.get('/hearts', authController.isLoggedIn, catchErrors(storeController.getHearts));



module.exports = router;
