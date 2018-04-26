module.exports = (server, checkInterval) => {
    const WebSocket = require('ws');
    const {model: User} = require('./models/user');

    const ws = new WebSocket.Server({ server });
    let subscribers = [];

    ws.on('connection', function connection(client, req) {
        console.log('Соединение установлено');

        loop();

        function loop() {
            subscribers.forEach(({client, user}) => {
                user.getPortfolio()
                    .then(portfolio => client.send(JSON.stringify(portfolio)))
                    .catch(() => client.send('Не удалось получить состояние портфеля'));
            });

            setTimeout(loop, checkInterval);
        }

        client.on('message', (message) => {
            const token = message;

            User.findOne({token}, (err, user) => {
                if (err) {
                    client.close();
                }

                subscribers.push({
                    client,
                    user,
                })
            });
        });


        client.on('close', () => {
            console.log('Клиент отключился');
            subscribers = subscribers
                .filter(subscriber => subscriber.client !== client);
        });
    });
};