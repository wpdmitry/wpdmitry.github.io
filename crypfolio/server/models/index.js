module.exports = {
    connect: (dbUrl, callback) => {
        const mongoose = require('mongoose');
        const options = {
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000,
        };

        mongoose.connect(dbUrl, options);
        const db = mongoose.connection;

        db.on('error', err => {
            console.log('Не удалось установить соединение с базой данных ', err)
        });

        db.on('disconnect', err => {
            console.log('База данных отключена');
            mongoose.connect(dbUrl, options);
        });

        db.on('reconnected', function () {
            console.log('База данных переподключена');
        });

        db.once('open', () => {
            console.log('Соединение с базой данных установлено');
            callback();
        });
    }
};

