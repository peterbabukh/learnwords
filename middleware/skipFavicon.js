module.exports = function(req, res, next) {
    //stop '/favicon.ico' request
	if (req.url == '/favicon.ico') return res.end('');
	next();
};
