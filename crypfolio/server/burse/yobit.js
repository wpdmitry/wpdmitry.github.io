const promiseHttp = require('../helpres/promiseHttp');

class YobitApi {
    constructor({host}) {
        this.host = host;
    }

    getCoinNames() {
        return new Promise(((resolve, reject) => {
            this.getAllPairs()
                .then(res => {
                    const names = Object.keys(res['pairs'])
                        .map(pair => pair.toUpperCase().split('_')[0]);
                    resolve(names);
                })
        }))
    }

    getAllPairs() {
        return new Promise(resolve => {
            this.public({method: 'info'})
                .then((pairs) => {
                    resolve(pairs);
                })
                .catch(err => {
                    console.log(`[ERROR IN GETALLPAIRS] info: ${err}`);
                });
        })
    }

    checkPrice(pairs) {
        return new Promise(resolve => {
            this.public({
                method: 'ticker',
                pairs: pairs.map(pair => pair.replace('/', '_').toLowerCase()),
            })
                .then(res => {

                    const prices = Object.keys(res)
                        .map(pair => {
                            return {
                                pair: pair,
                                price: res[pair]['last'],
                            }
                        });

                    resolve(prices);
                })
                .catch(err => {
                    console.log(`[ERROR IN CHECKPRICE] info: ${err} | pair: ${pair}`);
                });
        })
    }

    public({method, pairs = [], params = {}}) {
        params = Object.keys(params).reduce((prevValue, currentKey) => {
            return `${prevValue}${currentKey}=${params[currentKey]}&`
        }, '');

        return promiseHttp({
            host: this.host,
            path: `/api/3/${method}/${pairs.join('-')}?${params}`,
        })
    }
}

module.exports  = new YobitApi({host: 'yobit.net'});