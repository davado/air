Table of Contents
=================

* [Air](#air)
  * [Design](#design)
  * [Usage](#usage)
  * [Install](#install)
  * [API](#api)
    * [Core](#core)
      * [air(selector, [context])](#airselector-context)
      * [air.Air](#airair)
      * [new Air(selector, [context])](#new-airselector-context)
        * [.dom](#dom)
        * [.length](#length)
        * [get([index])](#getindex)
        * [each(iterator)](#eachiterator)
        * [air(selector, [context])](#airselector-context-1)
        * [plugin(list)](#pluginlist)
  * [Plugins](#plugins)
    * [append](#append)
    * [attr](#attr)
    * [children](#children)
  * [Plugin Groups](#plugin-groups)
    * [Attributes](#attributes)
  * [Plugin Handbook](#plugin-handbook)
    * [Creating Plugins](#creating-plugins)
      * [Instance Plugins](#instance-plugins)
      * [Static Plugins](#static-plugins)
      * [Composite Plugins](#composite-plugins)
    * [Loading Plugins](#loading-plugins)
  * [Compatibility](#compatibility)
    * [Array Access](#array-access)
    * [HTML Parsing](#html-parsing)
    * [AJAX](#ajax)
    * [Element Data](#element-data)
    * [XML](#xml)
    * [Selector Extensions](#selector-extensions)
    * [Redundancy](#redundancy)
    * [Dimension](#dimension)
  * [Developer](#developer)
    * [Test](#test)
    * [Cover](#cover)
    * [Lint](#lint)
    * [Clean](#clean)
    * [Dist](#dist)
    * [Spec](#spec)
    * [Instrument](#instrument)
    * [Readme](#readme)
  * [Roadmap](#roadmap)
  * [License](#license)

Air
===

Lightweight, modular DOM library.

Browser targets are relatively *modern browsers* from IE9+, Chrome, Firefox, Safari and modern versions of Opera (post [blink](http://www.chromium.org/blink) integration).

This library is not designed to be a drop-in replacement for [jquery](http://jquery.com), it is designed to provide a modular library that is *jqueryesque* therefore it is best suited to new projects.

***Work in progress: not yet ready for production***.

## Design

Whilst the API is similar to [jquery](http://jquery.com) some notable design decisions:

* Plugin architecture.
* No global variables.
* Stay focused, see [compatibility](#compatibility).

To get a feel for how lightweight `air` is see [air.js](https://github.com/socialally/air/blob/master/lib/air.js), the core of the system is less than 100 lines of code (with comments). All other files in [lib](https://github.com/socialally/air/blob/master/lib) are plugins that should be loaded depending upon your application requirements.

## Usage

Designed to work with [browserify](http://browserify.org) by default, assuming you have configured the [browserify](http://browserify.org) `paths` option correctly:

```javascript
var $ = require('air');
$.plugin([
  require('event')
])
```

## Install

```
npm i air
```

Note that currently we do not own the `air` package and we are attempting to resolve this. Therefore this module is currently published to a *private* registry. This project is open-source and if we resolve the package name dispute will be published to the public registry as `air` otherwise an alternative package name will be used.

In the meantime you can depend upon the git repository:

```
"air": "socialally/air"
```

## API

The main function `air` wraps a set of elements in a class that may be decorated by plugins.

### Core

Core functionality is the main method, the class function and the pre-defined properties and methods on the class, see [air.js](https://github.com/socialally/air/blob/master/lib/air.js).

#### air(selector, [context])

Returns an `Air` instance.

#### air.Air

Reference to the `Air` constructor.

#### new Air(selector, [context])

Class constructor.

Accepts a selector `String`, `Element`, `NodeList`, `Air` instance or array of elements.

The `context` argument is only applicable when a selector `String` argument is used and should reference the parent `Element` context for `querySelectorAll`.

When an existing `Air` instance is passed the underlying array is copied but the elements are not cloned.

```javascript
var $ = require('air');
$('body');                                  // String (selector)
$(document.querySelector('body'));          // Element
$(document.getElementById('id'));           // Element
$(document.querySelectorAll('div'));        // NodeList
$([document.getElementById('id')]);         // Array
$($('body'));                               // Air
```

##### .dom

The underlying array of elements.

##### .length

The number of encapsulated elements.

##### get([index])

Get the element at the specified index, if no arguments are passed the `dom` array is returned.

##### each(iterator)

Iterate the underlying elements, alias for `dom.forEach`.

##### air(selector, [context])

Alias to the main `air` function, allows instance methods to wrap elements using `this.air()`.

##### plugin(list)

Alias to the `plugin` function, allows instance methods to load plugins via `this.plugin()`.

## Plugins

Default plugins that may be loaded on demand, syntax examples assume that `air` has been aliased to `$`.

Everything except the [core methods](#core) are implemented as plugins so there are many examples in [lib](https://github.com/socialally/air/blob/master/lib).

### append

Insert content, specified by the parameter, to the end of each element in the set of matched elements.

```javascript
$(selector, [context]).append(content);
```

* File: [append.js](https://github.com/socialally/air/blob/master/lib/append.js).
* Dependencies: none.

### attr

Get the value of an attribute for the first element in the set of matched elements or set one or more attributes for every matched element.

```javascript
$(selector, [context]).attr(name);
$(selector, [context]).attr(name, value);
$(selector, [context]).attr(attributes);
```

* File: [attr.js](https://github.com/socialally/air/blob/master/lib/attr.js).
* Dependencies: none.

### children

Get the children of each element in the set of matched elements.

```javascript
$(selector, [context]).children();
```

* File: [children.js](https://github.com/socialally/air/blob/master/lib/children.js).
* Dependencies: none.

## Plugin Groups

Plugin groups provide a convenient way to load related plugins.

### Attributes

Element attribute plugins.

* File: [attributes.js](https://github.com/socialally/air/blob/master/lib/attributes.js).
* Plugins: [attr](#attr), [class](#class), [data](#data).

## Plugin Handbook

This section provides information on writing and loading plugins.

Plugins are functions invoked in the scope of the class prototype that typically decorate the prototype object (using `this`) but may also add static methods or load other plugins.

### Creating Plugins

Creating plugins is designed to be simple and easy to use.

#### Instance Plugins

To create an instance plugin just assign a function to `this` within the plugin function:

```javascript
module.exports = function() {
  // decorate Air.prototype
  this.method = function() {
    // implement method functionality

    // return this to allow chaining on this function
    return this;
  }
}
```

You can then invoke the `method` function on `Air` instances:

```javascript
var $ = require('air');
$('div').method();
```

Most of the default plugins are instance plugins, take a look at [lib](https://github.com/socialally/air/blob/master/lib) for examples.

#### Static Plugins

To decorate the main `air` function with static functions assign to `this.air`.

```javascript
module.exports = function() {
  // decorate main function
  this.air.method = function() {
    // implement method functionality
  }
}
```

You can then invoke the `method` function on `air`:

```javascript
var $ = require('air');
$.method();
```

See the [create](https://github.com/socialally/air/blob/master/lib/create.js) plugin for an example static plugin.

#### Composite Plugins

You can depend upon other plugins by calling `this.plugin` within the plugin function. This allows plugins to composite other plugins in order to resolve plugin dependencies or provide plugin groups (related plugins).

```javascript
module.exports = function() {
  this.plugin([require('alt-plugin')]);
}
```

See the [attributes](https://github.com/socialally/air/blob/master/lib/attributes.js) plugin group for an example composite plugin.

By convention plugins are singular and plugin groups are plural.

### Loading Plugins

To load plugin(s) call the `plugin` function passing an array of plugin functions:

```javascript
// alias to $ for brevity
var $ = require('air');
$.plugin([require('attr')]);
```

It is possible to pass a configuration object at runtime to a plugin by using an object with a `plugin` function and a `conf` object:

```javascript
var $ = require('air');
var plugins = [
  {
    plugin: function(conf) {
      // do something with the runtime configuration
      // initialize the plugin
    },
    conf: {foo: 'bar'}
  }
];
$.plugin(plugins);
```

## Compatibility

Some features available in [jquery](http://jquery.com) that there are no plans to implement.

### Array Access

Accessing the underlying DOM elements using array bracket notation `[]` is not available, if you wish to access the encapsulated elements use the [core methods](#core).

### HTML Parsing

Whilst [jquery](http://jquery.com) allows HTML parsing (eg: `$('<p></p>')`) this library does not support it and there are no plans to implement this functionality, the rationale is:

* Confuses the semantics of `$`.
* You can create elements easily by chaining function calls.
* For complex requirements a template library is a better option.
* Implementing complex expressions to prevent [xss](http://en.wikipedia.org/wiki/Cross-site_scripting) attacks is not a good idea, best to avoid potentially tainted input wherever possible.

Note that recent [jquery](http://jquery.com) versions now recommend `$.parseHTML` rather than passing markup to `$`. 

### AJAX

This is deemed to be irrelevant to DOM manipulation and is best left to one of the many capable libraries available.

### Element Data

The `data` plugin allows manipulating the `data-` attributes of an element but does not store any data on the element itself. If you wish to maintain data as part of your application it would be best resolved using another pattern (eg: [storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)).

If you really need to assign arbitrary data to an element you can always do so by directly setting properties on the element.

### XML

Designed to work with `HTML` documents the behaviour when modifying `XML` documents is undefined.

### Selector Extensions

The [jquery](http://jquery.com) library extends CSS selectors with pseudo-selectors such as `:checked`, we believe this is unnecessary as all selector extension functionality can be achieved using other means.

### Redundancy

We aim to provide a single way to perform a task, the [jquery](http://jquery.com) library often provides multiple ways to achieve the same thing, for example:

* `$.get()` and `$.toArray()`.
* `$.append()` and `$.appendTo()`.
* `$.prepend()` and `$.prependTo()`.

The `air` library will usually prefer the shorter and most common variant and not supply the alternatives; using the above examples the equivalent functions are `$.get()`, `$.append()` and `$.prepend()`.

### Dimension

Whilst the [jquery](http://jquery.com) dimension methods (`width()`, `innerWidth()` etc.) allow setting element dimensions we prefer (for the sake of simplicity) to make these read-only as you can already set element dimensions using the `css` plugin. It is possible that this may change in the future.

## Developer

Developer workflow is via [gulp](http://gulpjs.com) but should be executed as `npm` scripts to enable shell execution where necessary.

### Test

Run the headless test suite using [phantomjs](http://phantomjs.org):

```
npm test
```

To run the tests in a browser context open [test/index.html](https://github.com/socialally/air/blob/master/test/index.html).

### Cover

Run the test suite and generate code coverage:

```
npm run cover
```

### Lint

Run the source tree through [eslint](http://eslint.org):

```
npm run lint
```

### Clean

Remove generated files:

```
npm run clean
```

### Dist

Create distribution builds in [dist](https://github.com/socialally/air/blob/master/dist):

```
npm run dist
```

### Spec

Compile the test specifications:

```
npm run spec
```

### Instrument

Generate instrumented code from `lib` in `instrument`:

```
npm run instrument
```

### Readme

Generate the project readme file (requires [mdp](https://github.com/freeformsystems/mdp)):

```
npm run readme
```

## Roadmap

1. Get the core plugins stable and well tested with comprehensive code coverage.
2. Build a command line interface to generate custom plugin builds for various module standards including [umd](https://github.com/umdjs/umd), [requirejs](http://requirejs.org) and [systemjs](https://github.com/systemjs/systemjs).

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](https://github.com/socialally/air/blob/master/LICENSE) if you feel inclined.

Generated by [mdp(1)](https://github.com/freeformsystems/mdp).

[node]: http://nodejs.org
[npm]: http://www.npmjs.org
[jquery]: http://jquery.com
[gulp]: http://gulpjs.com
[phantomjs]: http://phantomjs.org
[browserify]: http://browserify.org
[eslint]: http://eslint.org
[blink]: http://www.chromium.org/blink
[requirejs]: http://requirejs.org
[umd]: https://github.com/umdjs/umd
[systemjs]: https://github.com/systemjs/systemjs
[xss]: http://en.wikipedia.org/wiki/Cross-site_scripting
[storage]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
[mdp]: https://github.com/freeformsystems/mdp
