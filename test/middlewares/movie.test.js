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
  findMovie,
  getAllMovies,
  validateMovie,
  sanitizeMovie,
} = require('../../middlewares/movie');


const { expect } = chai;
const { describe, it, before, beforeEach } = mocha;

before((done) => {
  dbUtils
    .rebuildDatabase()
    .then(() => done());
});

describe('Movie middlewares', () => {
  beforeEach((done) => {
    this.req = httpMocks.createRequest();
    this.res = httpMocks.createResponse();
    this.next = sinon.spy();


    dbUtils
      .rebuildDatabase()
      .then(() => {
        return Promise.all([
          movieFactory(),
          movieFactory(),
          movieFactory(),
          movieFactory(),
        ]);
      })
      .then((movies) => {
        this.movies = movies;
        done();
      });
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

          expect(dataIds.sort()).to.deep.equal(moviesIds.sort());
          done();
        })
        .catch(done);
    });

    it('should return an array when there are no movies', (done) => {
      const { req, res } = this;

      models.Movie
        .destroy({ where: {} })
        .then(() => getAllMovies(req, res))
        .then(() => {
          const data = JSON.parse(res._getData());
          expect(data).to.be.a('array');
          done();
        })
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

    it('should verify if title does not contains only white characters', (done) => {
      const { res, req, next } = this;

      req.body = { title: '      \t         ' };
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

  describe('sanitizeMovie', () => {
    it('should verify if title will be trimmed', (done) => {
      const { res, req, next } = this;

      req.body = { title: '   test         ' };
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, sanitizeMovie)
        .then(() => {
          expect(req.body.title).to.equal('test');
          done();
        })
        .catch(done);
    });

    it('should verify if title will be escaped', (done) => {
      const { res, req, next } = this;

      req.body = { title: 'name<script>alert(1)</script>' };
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, sanitizeMovie)
        .then(() => {
          expect(req.body.title).to.equal('name&lt;script&gt;alert(1)&lt;&#x2F;script&gt;');
          done();
        })
        .catch(done);
    });
  });

  describe('findMovie', () => {
    it('should return JSON if movie exists in database', (done) => {
      const { res, req, next, movies } = this;
      const selectedMovie = movies[0];

      req.body = { title: selectedMovie.title };
      findMovie(req, res, next)
        .then(() => {
          expect(res._isJSON()).to.be.true;
          done();
        })
        .catch(done);
    });

    it('should return movie with a given title', (done) => {
      const { res, req, next, movies } = this;
      const selectedMovie = movies[0];

      req.body = { title: selectedMovie.title };
      findMovie(req, res, next)
        .then(() => {
          const { title } = JSON.parse(res._getData());
          expect(title).to.be.equal(selectedMovie.title);
          done();
        })
        .catch(done);
    });

    it('should call next if movie was not found', (done) => {
      const { res, req, next } = this;

      req.body = { title: 'nonexistent-title' };
      findMovie(req, res, next)
        .then(() => {
          expect(next.calledWithExactly()).to.be.true;
          done();
        })
        .catch(done);
    });
  });
});
