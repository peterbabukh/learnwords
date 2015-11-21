var passport = require('passport');

exports.get = function(req, res) {

    res.render('login', {
        title: 'learn English words',
        message: req.flash('message')
    });

};

exports.post = passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash : true
});
