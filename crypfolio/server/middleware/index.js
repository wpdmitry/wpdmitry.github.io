module.exports = function (express) {
    const path = require('path');
    const favicon = require('static-favicon');
    const bodyParser = require('body-parser');
    const bearerToken = require('express-bearer-token');
    const routes = require('../routes/index');
    const setHeaders = require('./setHeaders');

    const app = express();

    app.use(favicon());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(bearerToken({headerKey: 'Bearer'}));
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(setHeaders);

    routes(app);

    return app;
};