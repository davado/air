var $ = require('air')
  , expect = require('chai').expect
  , util = require('../util');

describe('Remove:', function() {

  beforeEach(function(done) {
    $.plugin([
      require('remove')
    ]);
    util.before();
    done();
  })
  afterEach(util.after);

  it('should remove elements', function(done) {
    expect($('.remove span').remove().length).eql(0);
    done();
  });

});
