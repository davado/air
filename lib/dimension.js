;(function() {
  "use strict"

  function width() {
    if(!arguments.length && this.length) return this.dom[0].innerWidth;
    // TODO
    return this;
  }

  function height() {
    if(!arguments.length && this.length) return this.dom[0].innerHeight;
    // TODO
    return this;
  }

  function plugin(conf) {
    conf.proto.width = width;
    conf.proto.height = height;
  }

  module.exports = plugin;
})();