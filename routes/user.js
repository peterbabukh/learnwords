var User = require('../models/User').User;

exports.get = function(req, res) {

    User.findOne({'_id': req.session.user._id}, function (err, user) {
        if (err) return next(err);

        res.json(user);
    });

};


exports.put = function(req, res) {

    User.findOne({'_id': req.session.user._id}, function (err, user) {
        if (err) return next(err);

        user.selectOptions = req.body.selectOptions;
        user.markModified('selectOptions');
        user.modified = new Date();
        user.markModified('modified');

        user.save(function(err){
            if (err) return next(err);
			
            res.json(user);
        });

    });

};
