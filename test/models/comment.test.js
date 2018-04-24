const chai = require('chai');
const mocha = require('mocha');

const dbUtils = require('../utils/db');
const movieFactory = require('../factories/movie');
const commentFactory = require('../factories/comment');


const { expect } = chai;
const { describe, it, before } = mocha;

before((done) => {
  dbUtils
    .rebuildDatabase()
    .then(() => done());
});

describe('Comment model', () => {
  before((done) => {
    movieFactory()
      .then(movie => movie.id)
      .then(movieId => commentFactory(movieId))
      .then((comment) => {
        this.comment = comment;
        return done();
      });
  });

  describe('model attributes', () => {
    describe('body', () => {
      it('should be of type TEXT', (done) => {
        const fieldType = this.comment.rawAttributes.body.type.constructor.key;
        expect(fieldType).to.be.equal('TEXT');
        done();
      });
    });

    describe('MovieId', () => {
      it('should be of type INTEGER', (done) => {
        const fieldType = this.comment.rawAttributes.MovieId.type.constructor.key;
        expect(fieldType).to.be.equal('INTEGER');
        done();
      });
    });
  });

  describe('model associations', () => {
    it('should be associated with Movie', (done) => {
      const { associations } = this.comment.constructor;
      expect(associations).to.have.property('Movie');
      done();
    });

    it('should belongs to Movie ', (done) => {
      const { associationType } = this.comment.constructor.associations.Movie;
      expect(associationType).to.be.equal('BelongsTo');
      done();
    });
  });
});
