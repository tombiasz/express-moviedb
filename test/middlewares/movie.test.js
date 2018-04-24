const chai = require('chai');
const httpMocks = require('node-mocks-http');
const mocha = require('mocha');
const sinon = require('sinon');
const { validationResult } = require('express-validator/check');


const models = require('../../models');
const dbUtils = require('../../utils/db');
const testUtils = require('../../utils/test');
const movieFactory = require('../factories/movie');
const {
  getAllMovies,
  validateMovie,
} = require('../../middlewares/movie');


const { expect } = chai;
const { describe, it, before, beforeEach } = mocha;

before((done) => {
  dbUtils
    .rebuildDatabase()
    .then(() => done());
});

describe('Movie middlewares', () => {
  before((done) => {
    Promise
      .all([
        movieFactory(),
        movieFactory(),
        movieFactory(),
        movieFactory(),
      ])
      .then((movies) => {
        this.movies = movies;
        done();
      });
  });

  beforeEach((done) => {
    this.req = httpMocks.createRequest();
    this.res = httpMocks.createResponse();
    this.next = sinon.spy();
    done();
  });

  describe('getAllMovies', () => {
    it('should return JSON', (done) => {
      const { req, res } = this;

      getAllMovies(req, res)
        .then(() => {
          expect(res._isJSON()).to.be.true;
          done();
        })
        .catch(done);
    });

    it('should return an array', (done) => {
      const { req, res } = this;

      getAllMovies(req, res)
        .then(() => {
          const data = JSON.parse(res._getData());
          expect(data).to.be.a('array');
          done();
        })
        .catch(done);
    });

    it('should return all movies', (done) => {
      const { req, res, movies } = this;

      getAllMovies(req, res)
        .then(() => {
          const data = JSON.parse(res._getData());
          const getIds = (obj) => obj.id;
          const moviesIds = movies.map(getIds);
          const dataIds = data.map(getIds);

          expect(dataIds).to.deep.equal(moviesIds);
          done();
        })
        .catch(done);
    });

    it('should return an array when there are no movies', (done) => {
      const { req, res, movies } = this;

      models.Movie
        .destroy({ where: {} })
        .then(() => getAllMovies(req, res))
        .then(() => {
          const data = JSON.parse(res._getData());
          expect(data).to.be.a('array');
        })
        .then(() => models.Movie.bulkCreate(movies))
        .then(() => done())
        .catch(done);
    });
  });

  describe('validateMovie', () => {
    it('should verify if title was provided', (done) => {
      const { res, req, next } = this;

      req.body = {};
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, validateMovie)
        .then(() => {
          const errors = validationResult(req);
          const { title } = errors.mapped();
          expect(title.msg).to.equal('Title must be specified.');
          done();
        })
        .catch(done);
    });

    it('should verify if title is not empty string', (done) => {
      const { res, req, next } = this;

      req.body = { title: '' };
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, validateMovie)
        .then(() => {
          const errors = validationResult(req);
          const { title } = errors.mapped();
          expect(title.msg).to.equal('Title must be at least 1 character long.');
          done();
        })
        .catch(done);
    });

    it('should not raise error if title is valid', (done) => {
      const { res, req, next } = this;

      req.body = { title: 'title' };
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, validateMovie)
        .then(() => {
          const errors = validationResult(req);
          const { title } = errors.mapped();
          expect(title).to.equal(undefined);
          done();
        })
        .catch(done);
    });
  });
});
