module.exports = {
    host: 'http://localhost',
    port: 8002,
    dbUrl: 'mongodb://127.0.0.1:27017/abc',
    secret_key: 'очень секретная строка',
    checkInterval: 60 * 1000,
    minPrice: 1e-8,
    minAmount: 1e-8,
    supportedCoins: {
        'BTC': 'btc.png',
        'LTC': 'ltc.png',
        'ETH': 'eth.png',
        'ETC': 'etc.png',
        'TRX': 'trx.png',
        'WAVES': 'waves.png',
        'USD': 'logo',
        'RUR': 'logo',
    }
};