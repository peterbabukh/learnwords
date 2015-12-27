module.exports = function(req, res, next) {

    res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate'); // HTTP 1.1.
    res.set('Pragma', 'no-cache'); // HTTP 1.0.
    res.set('Expires', '-1'); // Proxies.
    next();

};