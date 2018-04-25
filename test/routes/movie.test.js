const app = require('../../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const sinon = require('sinon');

const dbUtils = require('../../utils/db');
const movieFactory = require('../factories/movie');
const omdbDocumentFactory = require('../factories/omdb-document');
const omdb = require('../../utils/omdb');


const { expect } = chai;
const { describe, it, beforeEach } = mocha;

chai.use(chaiHttp);

describe('Movie routes', () => {
  beforeEach((done) => {
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

  describe('Movies GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get('/movies/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Movies POST route', () => {
    it('should responds with status 200 if data is valid', (done) => {
      const fakeGetMovieByTitle = sinon
        .stub(omdb, 'getMovieByTitle')
        .returns(Promise.resolve(omdbDocumentFactory()));

      chai
        .request(app)
        .post('/movies/')
        .send({ title: 'test' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          fakeGetMovieByTitle.restore();
          done();
        });
    });

    it('should responds with status 400 if data is not valid', (done) => {
      chai
        .request(app)
        .post('/movies/')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });
});
