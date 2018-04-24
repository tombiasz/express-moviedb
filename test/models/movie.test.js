const chai = require('chai');
const mocha = require('mocha');


const { expect } = chai;
const { describe, it, before } = mocha;

describe('Movie model', () => {
  describe('title', () => {
    it('should be of type String');
  });
});
