exports.get = function(req, res){

    req.session.destroy(function(err) {
        if (err) return next(err);

        res.redirect('/');
    });

};