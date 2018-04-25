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
  createComment,
  getAllComments,
  sanitizeComment,
  sanitizeGetAllCommentsQueryParams,
  validateComment,
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

  describe('validateComment', () => {
    it('should verify if movieId was provided', (done) => {
      const { res, req, next } = this;

      req.body = {};
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, validateComment)
        .then(() => {
          const errors = validationResult(req);
          const { movieId } = errors.mapped();
          expect(movieId.msg).to.equal('Movie ID must be specified.');
          done();
        })
        .catch(done);
    });

    it('should verify if movieId is valid integer', (done) => {
      const { res, req, next } = this;

      req.body = { movieId: 'invalid' };
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, validateComment)
        .then(() => {
          const errors = validationResult(req);
          const { movieId } = errors.mapped();
          expect(movieId.msg).to.equal('Movie ID must be an integer');
          done();
        })
        .catch(done);
    });

    it('should verify if movieId exists in database', (done) => {
      const { res, req, next } = this;

      req.body = { movieId: 99988888882123 };
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, validateComment)
        .then(() => {
          const errors = validationResult(req);
          const { movieId } = errors.mapped();
          expect(movieId.msg).to.equal('Invalid Movie ID');
          done();
        })
        .catch(done);
    });

    it('should not raise validation error if movieId is valid', (done) => {
      const { res, req, next, movie1 } = this;

      req.body = { movieId: movie1.id };
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, validateComment)
        .then(() => {
          const errors = validationResult(req);
          const { movieId } = errors.mapped();
          expect(movieId).to.equal(undefined);
          done();
        })
        .catch(done);
    });

    it('should verify if body was provided', (done) => {
      const { res, req, next } = this;

      req.body = {};
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, validateComment)
        .then(() => {
          const errors = validationResult(req);
          const { body } = errors.mapped();
          expect(body.msg).to.equal('Body must be specified.');
          done();
        })
        .catch(done);
    });

    it('should verify if body is not empty string', (done) => {
      const { res, req, next } = this;

      req.body = { body: '' };
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, validateComment)
        .then(() => {
          const errors = validationResult(req);
          const { body } = errors.mapped();
          expect(body.msg).to.equal('Body must be at least 1 character long.');
          done();
        })
        .catch(done);
    });

    it('should verify if body does not contains only white characters', (done) => {
      const { res, req, next } = this;

      req.body = { body: '         \t          ' };
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, validateComment)
        .then(() => {
          const errors = validationResult(req);
          const { body } = errors.mapped();
          expect(body.msg).to.equal('Body must be at least 1 character long.');
          done();
        })
        .catch(done);
    });

    it('should not raise validation error if body is valid', (done) => {
      const { res, req, next } = this;

      req.body = { body: 'comment' };
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, validateComment)
        .then(() => {
          const errors = validationResult(req);
          const { body } = errors.mapped();
          expect(body).to.equal(undefined);
          done();
        })
        .catch(done);
    });
  });

  describe('sanitizeComment', () => {
    it('should verify if movieId will be trimmed', (done) => {
      const { res, req, next } = this;
      const movieId = '   123  ';

      req.body = { movieId };
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, sanitizeComment)
        .then(() => {
          expect(req.body.movieId.toString()).to.equal(movieId.trim());
          done();
        })
        .catch(done);
    });

    it('should verify if movieId will be cast to number', (done) => {
      const { res, req, next } = this;
      const movieId = '123';

      req.body = { movieId };
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, sanitizeComment)
        .then(() => {
          expect(req.body.movieId).to.be.a('number');
          expect(req.body.movieId).to.be.equal(parseInt(movieId, 10));
          done();
        })
        .catch(done);
    });

    it('should verify if invalid movieId will be set to NaN', (done) => {
      const { res, req, next } = this;
      const movieId = 'invalid';

      req.body = { movieId };
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, sanitizeComment)
        .then(() => {
          expect(req.body.movieId).to.be.NaN;
          done();
        })
        .catch(done);
    });

    it('should verify if body will be trimmed', (done) => {
      const { res, req, next } = this;
      const body = '   comment body  ';

      req.body = { body };
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, sanitizeComment)
        .then(() => {
          expect(req.body.body).to.equal(body.trim());
          done();
        })
        .catch(done);
    });

    it('should verify if body will be escaped', (done) => {
      const { res, req, next } = this;

      req.body = { body: 'name<script>alert(1)</script>' };
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, sanitizeComment)
        .then(() => {
          expect(req.body.body).to.equal('name&lt;script&gt;alert(1)&lt;&#x2F;script&gt;');
          done();
        })
        .catch(done);
    });
  });

  describe('createComment', () => {
    it('should return created comment object as JSON', (done) => {
      const { res, req, movie1 } = this;
      const body = 'test comment';

      req.body = {
        movieId: movie1.id,
        body,
      };
      createComment(req, res)
        .then(() => {
          expect(res._isJSON()).to.be.true;

          const data = JSON.parse(res._getData());
          expect(data).to.have.property('id');
          expect(data).to.have.property('MovieId');
          expect(data).to.have.property('body');
          expect(data.MovieId).to.equal(movie1.id);
          expect(data.body).to.equal(body);
          done();
        })
        .catch(done);
    });
  });
});
