var express = require('express');
var passport = require('passport');
var checkSession = require('../middleware/checkSession');
//var skipFavicon = require('../middleware/skipFavicon');

// middleware, checking if the user logged in
var requireLogin = require('../middleware/requireLogin');


var router = express.Router();

// skips Favicon requests
//router.use(skipFavicon);

// checks if session exists
router.use(checkSession);

// authorization routes
router.get('/', require('./login').get);
router.post('/login', require('./login').post);
router.get('/signup', require('./signup').get);
router.post('/signup', require('./signup').post);
router.get('/logout', require('./logout').get);
router.get('/signout', require('./signout').get);

// page render routes
router.get('/home', requireLogin, require('./home').get);
router.get('/fieldset', requireLogin, require('./home').get);
router.get('/list', requireLogin, require('./home').get);

// process user queries to db
router.get('/user', require('./user').get);
router.put('/user', require('./user').put);


// fetches lean array of words from db
router.get('/grades', require('./grades').get);

// operations on wordModels in db
router.put('/words/:id', require('./words').put);
router.delete('/words/:id', require('./words').delete);
router.post('/words', require('./words').post);

router.get('/resetFiled', require('./resetFiled').get);
router.get('/resetAll', require('./resetAll').get);

router.get('*', function(req, res){
    res.redirect('/');
});


module.exports = router;