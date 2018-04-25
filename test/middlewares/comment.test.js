const chai = require('chai');
const httpMocks = require('node-mocks-http');
const mocha = require('mocha');
const sinon = require('sinon');
const { validationResult } = require('express-validator/check');

const models = require('../../models');
const dbUtils = require('../../utils/db');
const testUtils = require('../../utils/test');
const movieFactory = require('../factories/movie');
const commentFactory = require('../factories/comment');
const {
  getAllComments,
  sanitizeGetAllCommentsQueryParams,
} = require('../../middlewares/comment');


const { expect } = chai;
const { describe, it, beforeEach } = mocha;

describe('Comment middlewares', () => {
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
        ]);
      })
      .then((movies) => {
        const [movie1, movie2] = movies;

        this.movie1 = movie1;
        this.movie2 = movie2;
        return Promise.all([
          commentFactory(movie1.id),
          commentFactory(movie1.id),
          commentFactory(movie1.id),
          commentFactory(movie2.id),
        ]);
      })
      .then((comments) => {
        this.comments = comments;
        done();
      });
  });

  describe('getAllComments', () => {
    it('should return JSON', (done) => {
      const { req, res } = this;

      getAllComments(req, res)
        .then(() => {
          expect(res._isJSON()).to.be.true;
          done();
        })
        .catch(done);
    });

    it('should return an array', (done) => {
      const { req, res } = this;

      getAllComments(req, res)
        .then(() => {
          const data = JSON.parse(res._getData());
          expect(data).to.be.a('array');
          done();
        })
        .catch(done);
    });

    it('should return all comments', (done) => {
      const { req, res, comments } = this;

      getAllComments(req, res)
        .then(() => {
          const data = JSON.parse(res._getData());
          const getIds = (obj) => obj.id;
          const commentsIds = comments.map(getIds);
          const dataIds = data.map(getIds);

          expect(dataIds.sort()).to.deep.equal(commentsIds.sort());
          done();
        })
        .catch(done);
    });

    it('should return an array when there are no comments', (done) => {
      const { req, res } = this;

      models.Comment
        .destroy({ where: {} })
        .then(() => getAllComments(req, res))
        .then(() => {
          const data = JSON.parse(res._getData());
          expect(data).to.be.a('array');
          done();
        })
        .catch(done);
    });

    it('should return comments for given movieId query param', (done) => {
      const { req, res, movie1 } = this;

      req.query.movieId = movie1.id;
      Promise
        .all([
          movie1.getComments(),
          getAllComments(req, res),
        ])
        .then((results) => {
          const [comments, _] = results;
          const data = JSON.parse(res._getData());
          const getIds = obj => obj.id;
          const commentsIds = comments.map(getIds);
          const dataIds = data.map(getIds);

          expect(dataIds.sort()).to.deep.equal(commentsIds.sort());
          done();
        })
        .catch(done);
    });
  });

  describe('sanitizeGetAllCommentsQueryParams', () => {
    it('should verify if movieId will be cast to number', (done) => {
      const { res, req, next } = this;
      const movieId = '123';

      req.query.movieId = movieId;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, sanitizeGetAllCommentsQueryParams)
        .then(() => {
          expect(req.query.movieId).to.be.a('number');
          expect(req.query.movieId).to.be.equal(parseInt(movieId, 10));
          done();
        })
        .catch(done);
    });

    it('should verify if invalid movieId will be set to NaN', (done) => {
      const { res, req, next } = this;
      const movieId = 'invalid';

      req.query.movieId = movieId;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, sanitizeGetAllCommentsQueryParams)
        .then(() => {
          expect(req.query.movieId).to.be.NaN;
          done();
        })
        .catch(done);
    });
  });
});
