const {model: User} = require('../../models/user');
const {authorize, deauthorize, accessCheck} = require('./helper');

const routerAuth = require('express').Router();

routerAuth.post('/sign-in', async (req, res) => {
    const {login, password} = req.body;

    if (!login || !password) {
        res.status(401);
        res.json({
            errors: {
                'login': ['Неверный логин'],
                'password': ['или пароль'],
            },
            data: null,
        });

        return;
    }

    try {
        const user = await User.getUser(login, password);

        if (!user) {
            res.status(401);
            res.json({
                errors: {
                    'login': ['Неверный логин'],
                    'password': ['или пароль'],
                },
                data: null,
            });
        } else {
            authorize(user, () => {
                res.json({
                    error: null,
                    data: user,
                });
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500);
        res.json({
            error: 'Ошибка при поиске пользователя',
            data: null,
        });
    }
});
routerAuth.post('/sign-out', accessCheck, (req, res) => {
    const user = req.user;

    deauthorize(user, () => {
        res.json({
            error: null,
            data: null,
        });
    });
});
routerAuth.post('/sign-up', (req, res) => {
    const {login, password, confirm_password} = req.body;

    if (password !== confirm_password) {
        res.status(401);
        res.json({
            errors: {
                'password': ['Мы должны совпадать'],
                'confirm_password': ['Мы должны совпадать'],
            },
            data: null,
        });

        return;
    }

    const user = new User({
        login,
        password,
    });

    user.save((err, user1) => {
        if (err) {
            res.status(401);
            res.json({
                errors: {'login': ['Такой логин уже занят :(']},
                data: null,
            });

            return;
        }

        authorize(user1, () => {
            res.json({
                error: null,
                data: user1,
            });
        });
    });
});
routerAuth.get('/authentication', (req, res) => {
    const token = req.token;

    User.findOne({token}, (err, user) => {
        if (err || !user) {
            res.json({
                error: null,
                data: false,
            });

            return;
        }

        res.json({
            error: null,
            data: user,
        });
    });
});

module.exports = routerAuth;