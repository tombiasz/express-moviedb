exports.checkValidationErrors = (req, res, next) => {
  const mapped = true;
  return req
    .asyncValidationErrors(mapped)
    .then(() => next())
    .catch(errors => res.status(400).json(errors));
};
