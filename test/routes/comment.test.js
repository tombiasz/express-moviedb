const app = require('../../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const sinon = require('sinon');

const dbUtils = require('../../utils/db');
const movieFactory = require('../factories/movie');
const commentFactory = require('../factories/comment');
const omdbDocumentFactory = require('../factories/omdb-document');
const omdb = require('../../utils/omdb');


const { expect } = chai;
const { describe, it, beforeEach } = mocha;

chai.use(chaiHttp);

describe('Comment routes', () => {
  beforeEach((done) => {
    dbUtils
      .rebuildDatabase()
      .then(() => movieFactory())
      .then((movie) => {
        this.movie = movie;
        return Promise.all([
          commentFactory(movie.id),
          commentFactory(movie.id),
          commentFactory(movie.id),
        ]);
      })
      .then((comments) => {
        this.comments = comments;
        done();
      });
  });

  describe('Comments GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get('/comments/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Comments POST route', () => {
    it('should responds with status 200 if data is valid', (done) => {
      const fakeGetMovieByTitle = sinon
        .stub(omdb, 'getMovieByTitle')
        .returns(Promise.resolve(omdbDocumentFactory()));

      chai
        .request(app)
        .post('/comments/')
        .send({
          movieId: this.movie.id,
          body: 'comment body',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          fakeGetMovieByTitle.restore();
          done();
        });
    });

    it('should responds with status 400 if data is not valid', (done) => {
      chai
        .request(app)
        .post('/comments/')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });
});
