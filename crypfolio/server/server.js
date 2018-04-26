const express = require('express');
const app = require('./middleware')(express);
const {port, dbUrl, supportedCoins, checkInterval} = require('./config');
const database = require('./models');
const http = require('http');
const WebSocket = require('ws');
const initDatabase = require('./models/initDatabase');
const changeCurrentPrice = require('./models/changeCurrentPrice');

const server = http.createServer(app);
require('./wsServer')(server, checkInterval);


database.connect(dbUrl, () => {
    initDatabase(supportedCoins);
    changeCurrentPrice(checkInterval);

    server.listen(process.env.PORT || port, () => {
        console.log('Сервер запущен на порту %d', server.address().port);
    });
});




