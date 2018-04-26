const https = require('https');

module.exports = (options) => {
    return new Promise((resolve, reject) => {
        const request = https.request(options, res => {
            let buffer = [];


            res.on('data', data => {
                buffer.push(data.toString())
            });

            res.on('end', () => {
                try {
                    const json = JSON.parse(buffer.join(''));
                    // cache = json;
                    resolve(json)
                } catch(err) {
                    console.log(`[ERROR HTTP] info: ${err}`);
                    reject();
                }
            });

            res.on('error', err => {
                console.log(`[ERROR HTTP] info: ${err}`);
                reject();
            })
        });

        if (options.method === 'POST') {
            request.write(options.params);
        }

        request.end()
    });
};