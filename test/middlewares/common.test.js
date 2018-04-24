const chai = require('chai');
const httpMocks = require('node-mocks-http');
const mocha = require('mocha');
const sinon = require('sinon');

const { checkValidationErrors } = require('../../middlewares/common');


const { expect } = chai;
const { describe, it, beforeEach } = mocha;

describe('Movie middlewares', () => {
  beforeEach((done) => {
    this.req = httpMocks.createRequest();
    this.res = httpMocks.createResponse();
    this.next = sinon.spy();
    done();
  });

  describe('checkValidationErrors', () => {
    it('should call next if there no validation errors ', (done) => {
      const { req, res, next } = this;

      req.asyncValidationErrors = (params) => Promise.resolve();
      checkValidationErrors(req, res, next)
        .then(() => {
          expect(next.calledWithExactly()).to.be.true;
          done();
        })
        .catch(done);
    });

    it('should return error 400 if there are validation errors', (done) => {
      const { req, res, next } = this;

      req.asyncValidationErrors = (params) => Promise.reject();
      checkValidationErrors(req, res, next)
        .then(() => {
          expect(res._getStatusCode()).to.be.equal(400);
          done();
        })
        .catch(done);
    });

    it('should return error  body as JSON', (done) => {
      const { req, res, next } = this;
      const error = { msg: 'Error ' };

      req.asyncValidationErrors = (params) => Promise.reject(error);
      checkValidationErrors(req, res, next)
        .then(() => {
          expect(res._isJSON()).to.be.true;

          const data = JSON.parse(res._getData());
          expect(data).to.deep.equal(error);
          done();
        })
        .catch(done);
    });
  });
});
