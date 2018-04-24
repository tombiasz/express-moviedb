const chai = require('chai');
const mocha = require('mocha');

const movieFactory = require('../factories/movie');


const { expect } = chai;
const { describe, it, before } = mocha;

describe('Movie model', () => {
  before((done) => {
    movieFactory()
      .then((movie) => {
        this.movie = movie;
        done();
      });
  });

  describe('model attributes', () => {
    describe('title', () => {
      it('should be of type STRING', (done) => {
        const { movie } = this;
        const fieldType = movie.rawAttributes.title.type.constructor.key;
        expect(fieldType).to.be.equal('STRING');
        done();
      });
    });

    describe('document', () => {
      it('should be of type JSONB', (done) => {
        const { movie } = this;
        const fieldType = movie.rawAttributes.document.type.constructor.key;
        expect(fieldType).to.be.equal('JSONB');
        done();
      });
    });
  });

  describe('model associations', () => {
    it('should be associated with Comments', (done) => {
      const { associations } = this.movie.constructor;
      expect(associations).to.have.property('Comments');
      done();
    });

    it('should have many Comments ', (done) => {
      const { associationType } = this.movie.constructor.associations.Comments;
      expect(associationType).to.be.equal('HasMany');
      done();
    });
  });
});
