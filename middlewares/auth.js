const jwt = require('jsonwebtoken');

const { errorCreator } = require('../utils/helper');
const Msg = require('../utils/messages');

exports.authenticated = (req, res, next) => {
    const authHeader = req.get('Authorization');

    try {
        if (!authHeader) {
            errorCreator(Msg.authHeaderErr, 401);
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) {
            errorCreator(Msg.authHeaderErr, 401);
        }

        req.userId = decodedToken.userId;
        next();
    } catch (err) {
        console.log(err);
        next(err);
    }
};