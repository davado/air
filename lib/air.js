;(function() {
  'use strict'

  /**
   *  Chainable wrapper class.
   *
   *  This is the core of the entire plugin system and typically you extend
   *  functionality by adding methods to the prototype of this function.
   *
   *  However a plugin may also add static methods to the main function,
   *  see the `create` plugin for an example of adding static methods.
   *
   *  This implementation targets modern browsers (IE9+) and requires that
   *  the array methods `isArray`, `forEach` and `filter` are available,
   *  for older browsers you will need to include polyfills.
   *
   *  @param el A selector, DOM element, array of elements or Air instance.
   *  @param context The context element for a selector.
   */
  function Air(el, context) {
    if(typeof context === 'string') {
      context = document.querySelector(context);
    }
    context = context || document;
    this.dom = typeof el === 'string' ? context.querySelectorAll(el) : el;
    if(el instanceof Air) {
      this.dom = el.dom.slice(0);
    }else if(!Array.isArray(el)) {
      if(this.dom instanceof NodeList) {
        this.dom = Array.prototype.slice.call(this.dom);
      }else{
        this.dom = (el instanceof Element || el === window) ? [el] : [];
      }
    }

    // undocumented shortcut to Array.prototype.slice
    this.slice = Array.prototype.slice;
  }

  var proto = Air.prototype;

  /**
   *  Get the number of wrapped DOM elements.
   */
  Object.defineProperty(
    proto, 'length', {get: function(){return this.dom.length}});

  /**
   *  Get the DOM element at the specified index.
   */
  proto.get = function get(index) {
    if(index === undefined) { return this.dom };
    return this.dom[index];
  }

  /**
   *  Iterate the encapsulated DOM elements.
   */
  proto.each = function each(cb) {
    this.dom.forEach(cb);
    return this;
  }

  /**
   *  Main function, see the documentation for the `Air` class.
   */
  function air(el, context) {
    return new Air(el, context);
  }

  /**
   *  Static plugin method.
   *
   *  @param plugins Array of plugin functions.
   */
  function plugin(plugins) {
    var z;
    for(z in plugins) {
      if(typeof plugins[z] === 'function') {
        plugins[z].call(proto);
      // assume object style declaration
      }else{
        plugins[z].plugin.call(proto, plugins[z].conf);
      }
    }
  }

  // main plugin method
  air.plugin = proto.plugin = plugin;

  // expose class reference
  air.Air = Air;

  module.exports = proto.air = air;
})();
