var HttpError = require('./httpError').HttpError;
var log = require('../lib/log')(module);

module.exports = function(app) {

    return function(err, req, res, next) {
        if (typeof err == 'number') {
            err = new HttpError(err);
        }

        if (err instanceof HttpError) {
            res.sendHttpError(err);
        } else {
            if (app.get('env') == 'development') {
                console.log(err);
            } else {
                log.error(err);
                err = new HttpError(500);
                res.sendHttpError(err);
            }
        }
    };
};