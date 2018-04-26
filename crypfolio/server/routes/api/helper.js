const jwt = require('jsonwebtoken');
const {model: User} = require('../../models/user');
const {secret_key} = require('../../config');

function authorize(user, callback) {
    user.token = '';
    const {login} = user.login;
    user.token = jwt.sign({login}, secret_key);

    User.update({_id: user._id}, user, callback);
}
function deauthorize(user, callback) {
    user.token = '';

    User.update({_id: user._id}, user, callback);
}
function accessCheck(req, res, next) {
    const token = req.token;

    User.findOne({token}, (err, user) => {
        if (err || !user) {
            res.status(401);
            res.json({
                error: 'Необходима авторизация',
                data: null,
            });

            return;
        }

        req.user = user;
        next();
    })
}

module.exports  = {authorize, deauthorize, accessCheck};