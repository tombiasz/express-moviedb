const chai = require('chai');
const mocha = require('mocha');

const dbUtils = require('../utils/db');
const movieFactory = require('../factories/movie');


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
      .then((movie) => {
        this.movie = movie;
        done();
      });
  });

  describe('model attributes', () => {
    describe('body', () => {
      it('should be of type TEXT');
    });
  });
});
