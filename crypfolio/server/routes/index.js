module.exports = (app) => {
  const routerApi = require('./api');

  app.use('/api', routerApi);
};
