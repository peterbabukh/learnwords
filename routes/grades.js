var User = require('../models/User').User;

exports.get = function(req, res) {

    User.findOne({'_id': req.session.user._id}, function (err, user) {
        if (err) return console.log(err);

        var opts = [
            {
                path: 'words',
                options: {
                    lean: true
                },
                select: 'wordGroup grade lesson'
            }
        ];

        User.populate(user, opts, function (err, data) {
            if (err) return console.log(err);

            res.json( data );

        });

    });

};

