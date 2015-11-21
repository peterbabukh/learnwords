var User = require('../models/User').User;

exports.get = function(req, res) {

    User.remove({'_id': req.session.user._id}, function (err) {
        if (err) return console.log(err);

        req.session.destroy(function(err) {
            if (err) return console.log(err);

            return res.redirect('/');

        });
    });
};
