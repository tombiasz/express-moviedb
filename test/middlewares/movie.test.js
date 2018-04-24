const chai = require('chai');
const httpMocks = require('node-mocks-http');
const mocha = require('mocha');
const sinon = require('sinon');


const models = require('../../models');
const dbUtils = require('../../utils/db');
const movieFactory = require('../factories/movie');
const {
  getAllMovies,
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
});
