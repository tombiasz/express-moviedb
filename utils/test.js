exports.testExpressValidatorArrayMiddleware = (req, res, next, middlewares) => {
  const validators = middlewares.map(middleware =>
    new Promise(resolve => resolve(middleware(req, res, next))));

  return Promise.all(validators);
};
