;(function() {
  "use strict"

  /**
   *  Reduce the set of matched elements to the final one in the set.
   */
  function last() {
    this.dom = this.dom.slice(this.length - 1);
    return this;
  }

  function plugin(conf) {
    conf.proto.last = last;
  }

  module.exports = plugin;
})();