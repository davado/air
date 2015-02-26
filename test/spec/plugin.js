var $ = require('air')
  , expect = require('chai').expect;

describe('Plugin:', function() {

  it('should load instance method plugin', function(done) {
    $.plugin([require('instance-plugin')]);
    var el = $('div');
    expect(el.method).to.be.a('function');
    expect(el.method()).to.equal(el);
    done();
  });

  it('should load static method plugin', function(done) {
    $.plugin([require('static-plugin')]);
    expect($.method).to.be.a('function');
    done();
  });

});
