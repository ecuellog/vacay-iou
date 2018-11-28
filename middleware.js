var jwt = require('jsonwebtoken');
var config = require('./config');

var checkToken = function(req, res, next) {
    var token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Invalid token'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            message: 'No token'
        });
    }
};

module.exports = {
    checkToken: checkToken
}