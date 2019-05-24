// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"scss/style.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"../node_modules/@babel/runtime/regenerator/index.js":[function(require,module,exports) {
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":"../node_modules/regenerator-runtime/runtime.js"}],"../node_modules/@babel/runtime/helpers/asyncToGenerator.js":[function(require,module,exports) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
},{}],"../node_modules/@babel/runtime/helpers/classCallCheck.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],"../node_modules/@babel/runtime/helpers/createClass.js":[function(require,module,exports) {
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{}],"js/generateBG.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateBG;

//A feature module to generate the room background graphic for the main screens
function generateBG() {
  document.querySelectorAll(".container .room-bg").forEach(function (bg) {
    var column = bg.getAttribute("column");
    var wallpaperOutput = ""; //Generate wallpaper tiles

    for (var i = 0; i < column; i++) {
      wallpaperOutput += "<div></div>";
    } //Combine wallpaper with other background elements


    var output = "<div class=\"wallpaper\">\n                ".concat(wallpaperOutput, "\n            </div>\n            <div class=\"baseboard\"></div>\n            <div class=\"floor\"></div>\n            "); //Output combine background

    bg.innerHTML = output;
  });
}
},{}],"js/updateNav.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = updateNav;

//A feature module to update the room background graphic for the main screens
function updateNav(pageName) {
  //Grab navigation bar elements
  var navElem = document.querySelector(".nav");
  var navBtnElem = document.querySelectorAll(".nav-btn");
  var navTextElem = document.querySelectorAll(".nav-text"); //Manually defining navigation bar state for each screen

  var pageNavData = {
    desk: ["bottom", "logs", "about", "portfolio"],
    logs: ["bottom", "null", "null", "desk"],
    portfolio: ["bottom", "desk", "null", "null"],
    about: ["top", "null", "desk", "null"]
  }; //Grab relevant navigation state according to the inputted page number

  var navItems = pageNavData[pageName.replace(".html", "")]; //Setup animation listener to complete the navigation bar transition flow

  navElem.addEventListener("animationend", function (e) {
    navElem.classList.remove("fade"); //Reset scroll position of all cards

    document.getElementById("portfolio-card").scrollTop = 0;
    document.getElementById("logs-card").scrollTop = 0;
    document.getElementById("about-card").scrollTop = 0;
  }); //Fade out navigation bar & update navigation bar content as soon as fade finishes (0.25s hard coded timing)

  navElem.classList.add("fade");
  setTimeout(function () {
    if (navItems[0] === "bottom") navElem.classList.remove("nav-top");else if (navItems[0] === "top") navElem.classList.add("nav-top");else throw "Error: Invalid nav position";

    for (var i = 1; i < navItems.length; i++) {
      if (navItems[i] != "null") {
        navBtnElem[i - 1].classList.remove("hidden");
        navBtnElem[i - 1].setAttribute("href", "#".concat(navItems[i]));
        navTextElem[i - 1].innerText = navItems[i];
      } else {
        navBtnElem[i - 1].classList.add("hidden");
      }
    }
  }, 250);
}
},{}],"js/ContentManager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContentManager =
/*#__PURE__*/
function () {
  function ContentManager(router) {
    (0, _classCallCheck2.default)(this, ContentManager);
    this.contentData = [7];
    this.fetchArray = [];
  } //Grab all the content data from JSON files & render all base content


  (0, _createClass2.default)(ContentManager, [{
    key: "initContent",
    value: function () {
      var _initContent = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var _this = this;

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                //Grab all output elements
                this.portfolioElem = document.getElementById("portfolio-card");
                this.logsElem = document.getElementById("logs-card");
                this.aboutElem = document.getElementById("about-card");
                this.detailElem = document.querySelector(".detail-card");
                this.toolkitElem = document.querySelector(".toolkit-card"); //Empty the innerHTML of multi-block output elements

                this.logsElem.innerHTML = "";
                this.aboutElem.innerHTML = ""; //Fetch portfolio content

                this.fetchArray.push(fetch("content/portfolioContent.json").then(function (res) {
                  return res.json();
                }).then(function (data) {
                  _this.contentData[0] = data; //Render portfolio content ---------------------------------

                  var portfolioOutput = "<div>";
                  data.forEach(function (p) {
                    return portfolioOutput += "<div class=\"card-item ".concat(p.field, "\">\n                            <div class=\"p-2\">\n                                <h2>").concat(p.title, " (").concat(p.year, ")</h2>\n                                <h4>").concat(p.desc, "</h4>\n                            </div>\n                            <div class=\"cta-panel portfolio-panel\">\n                                <h3 class=\"p-2 bg-").concat(function (field) {
                      if (field === "UX") return "success";else if (field === "Design") return "warning";else if (field === "Dev") return "danger";
                    }(p.field), "\">").concat(p.field, "</h3>\n                                <h5 class=\"px-2\">").concat(p.type.replace(" ", "<br>"), "</h5>\n                                <button class=\"btn btn-l btn-light\" ").concat(function (action) {
                      if (action !== "none") return "onClick=\"window.open('".concat(action, "')\"");else return "style=\"visibility:hidden\"";
                    }(p.action), ">").concat(function (link) {
                      if (link.includes("youtu.be")) return '<i class="fas fa-play"></i>';else if (link.includes("github")) return '<i class="fab fa-github fa-lg"></i>';else return "<i class=\"fas fa-link\"></i>";
                    }(p.action), "</button>\n                                <button id=\"portfolio-").concat(p.id, "\" class=\"btn btn-l detail-btn btn-light mx-1\"><i class=\"fas fa-info-circle\"></i></button>\n                            </div>\n                        </div>");
                  });
                  _this.portfolioElem.innerHTML = portfolioOutput + "</div>";
                  console.log("Done Portfolio!");
                }).catch(function (err) {
                  throw err;
                })); //Fetch adventure content

                this.fetchArray.push(fetch("content/adventureContent.json").then(function (res) {
                  return res.json();
                }).then(function (data) {
                  _this.contentData[1] = data; //Render adventure content ------------------------------  

                  var advOutput = "<div id=\"adventure-logs\">";
                  data.forEach(function (a) {
                    return advOutput += "<div class=\"card-item\">\n                            <div class=\"card-photo\" style=\"background-image: url(./images/adventure/".concat(a.id, "/").concat(a.cover, ")\">\n                                <div class=\"p-2 text-light text-drop-shadow\">\n                                    <h2>").concat(a.title, "</h2>\n                                    <h4>").concat(a.desc, "</h4>\n                                </div>\n                            </div>\n                            <div class=\"cta-panel adventure-panel\">\n                                <h4 class=\"p-2\">").concat(a.month, "</h4>\n                                <button id=\"adventure-").concat(a.id, "\" class=\"btn btn-sm detail-btn btn-light mx-1\">Diary</button>\n                            </div>\n                        </div>");
                  });
                  advOutput += "</div>";
                  _this.logsElem.innerHTML += advOutput;
                  console.log("Done Adventure!");
                }).catch(function (err) {
                  throw err;
                })); //Fetch upgrade(learning logs) content

                this.fetchArray.push(fetch("content/upgradeContent.json").then(function (res) {
                  return res.json();
                }).then(function (data) {
                  _this.contentData[2] = data; //Render upgrade content ------------------------------  

                  var inProgressList = data.filter(function (item) {
                    return item.status === "progress";
                  }).sort(function (a, b) {
                    return b.id - a.id;
                  });
                  var wishList = data.filter(function (item) {
                    return item.status === "que";
                  }).sort(function (a, b) {
                    return b.id - a.id;
                  });
                  var completedList = data.filter(function (item) {
                    return item.status === "completed";
                  }).sort(function (a, b) {
                    return b.id - a.id;
                  });
                  var upgradeOutput = "<div id=\"upgrade-logs\" class=\"hidden fade\">\n                        <div class=\"cta-panel cta-warning upgrade-panel\">\n                            <h2 class=\"p-2\">In Progress</h2>\n                            <button id=\"progress-btn\" class=\"btn btn-l btn-light mx-1 toggle-btn upgrade-toggle toggled\"><i class=\"fas fa-chevron-down\"></i></button>\n                        </div>\n                        <div id=\"progress\" class=\"upgrade-items\">";
                  inProgressList.forEach(function (item) {
                    upgradeOutput += "<div class=\"p-2\">\n                            <h3>".concat(item.title, "</h3>\n                        </div>");
                  });
                  upgradeOutput += "</div>\n                    <div class=\"cta-panel cta-danger upgrade-panel\">\n                        <h2 class=\"p-2\">Knowledge Wishlist</h2>\n                        <button id=\"wish-btn\" class=\"btn btn-l btn-light mx-1 toggle-btn upgrade-toggle\"><i class=\"fas fa-chevron-down\"></i></button>\n                    </div>\n                    <div id=\"wish\" class=\"upgrade-items hidden\">";
                  wishList.forEach(function (item) {
                    upgradeOutput += "<div class=\"p-2\">\n                        <h3>".concat(item.title, "</h3>\n                    </div>");
                  });
                  upgradeOutput += "</div>\n                    <div class=\"cta-panel cta-success upgrade-panel\">\n                        <h2 class=\"p-2\">Recently Completed</h2>\n                        <button id=\"completed-btn\" class=\"btn btn-l btn-light mx-1 toggle-btn upgrade-toggle\"><i class=\"fas fa-chevron-down\"></i></button>\n                    </div>\n                    <div id=\"completed\" class=\"upgrade-items hidden\">";
                  completedList.forEach(function (item) {
                    upgradeOutput += "<div class=\"p-2\">\n                            <h3>".concat(item.title, "</h3>\n                        </div>");
                  });
                  upgradeOutput += "</div></div>";
                  _this.logsElem.innerHTML += upgradeOutput;
                  console.log("Done Upgrade!");
                }).catch(function (err) {
                  throw err;
                })); //Fetch experience content

                this.fetchArray.push(fetch("content/experienceContent.json").then(function (res) {
                  return res.json();
                }).then(function (data) {
                  _this.contentData[3] = data; //Render about content --------------------------------

                  var expOutput = "<div id=\"experience-about\">";

                  _this.contentData[3].forEach(function (exp) {
                    return expOutput += "<div class=\"card-item\">\n                            <div class=\"p-2\">\n                                <h2>".concat(exp.title, "</h2>\n                                <h4>").concat(exp.role, "</h4>\n                            </div>\n                            <div class=\"cta-panel experience-panel\">\n                                <h5 class=\"p-2\">").concat(exp.months, "</h5>\n                                <h5 class=\"px-2\"><i class=\"fas fa-map-marker-alt\"></i>&nbsp;").concat(exp.location, "</h5>\n                                <button id=\"experience-").concat(exp.id, "\" class=\"btn btn-sm detail-btn btn-light mx-1\">Detail</button>\n                            </div>\n                        </div>");
                  });

                  expOutput += "</div>";
                  _this.aboutElem.innerHTML += expOutput;
                  console.log("Done About!");
                }).catch(function (err) {
                  throw err;
                })); //Fetch education content

                this.fetchArray.push(fetch("content/educationContent.json").then(function (res) {
                  return res.json();
                }).then(function (data) {
                  _this.contentData[4] = data; //Render about content --------------------------------

                  var eduOutput = "<div id=\"education-about\" class=\"education-card hidden fade\">\n                        <div class=\"milestone\"></div>\n                        <div class=\"card-item\">\n                            <h2>".concat(data[0].deg, "</h2>\n                            <h4 class=\"text-warning mt-1\">").concat(data[0].uni, "</h4>\n                            <h3 class=\"text-warning\">").concat(data[0].year, "</h3>\n                            <button id=\"education-1\" class=\"btn btn-sm detail-btn btn-dark my-1 px-2\">Detail</button>\n                            <hr class=\"bg-warning text-warning my-1\">\n                        </div>\n                        <div class=\"milestone\"></div>\n                        <div class=\"card-item\">\n                            <h2>").concat(data[1].deg, "</h2>\n                            <h4 class=\"text-warning mt-1\">").concat(data[1].uni, "</h4>\n                            <h3 class=\"text-warning\">").concat(data[1].year, "</h3>\n                            <button id=\"education-2\" class=\"btn btn-sm detail-btn btn-dark my-1\">Detail</button>\n                            <hr class=\"bg-warning text-warning my-1\">\n                        </div>\n                        <div class=\"milestone\"></div>\n                        <div class=\"card-item\">\n                            <h2>").concat(data[2].deg, "</h2>\n                            <h4 class=\"text-warning mt-1\">").concat(data[2].uni, "</h4>\n                            <h3 class=\"text-warning\">").concat(data[2].year, "</h3>\n                            <button id=\"education-3\" class=\"btn btn-sm detail-btn btn-dark my-1\">Detail</button>\n                        </div>\n                    </div>");
                  _this.aboutElem.innerHTML += eduOutput;
                  console.log("Done Education!");
                }).catch(function (err) {
                  throw err;
                })); //Fetch contact content

                this.fetchArray.push(fetch("content/contactContent.json").then(function (res) {
                  return res.json();
                }).then(function (data) {
                  _this.contentData[5] = data; //Render about content --------------------------------

                  var contactOutput = "<div id=\"contact-about\" class=\"contact-card hidden fade\">\n                        <h1 class=\"text-center\">Pleasure to meet you!</h1>\n                        <div class=\"avatar\">\n                            <object class=\"mb-1\" type=\"image/svg+xml\" data=\"./images/me.svg\"></object>\n                        </div> \n                        <div class=\"cta-panel contact-panel\">\n                            <h4 class=\"p-2 text-left\">Download CV</h4>\n                            <button class=\"btn btn-l btn-light mx-1\" onclick=\"window.open('./downloadable/C_Utsahajit_CV19.pdf')\"><i class=\"fas fa-download\"></i></button>\n                        </div>\n                        <div class=\"cta-panel contact-panel\">\n                            <h4 class=\"p-2 text-left\">".concat(data.email, "</h4>\n                            <button class=\"btn btn-l btn-light mx-1\" onclick=\"window.open('mailto:bzkwork1993@gmail.com')\">Email</button>\n                        </div>\n                        <div class=\"cta-panel contact-panel\">\n                            <h4 class=\"p-2 text-left\">").concat(data.mobile, "</h4>\n                            <button class=\"btn btn-l btn-light mx-1\" onclick=\"window.open('tel:+447956982635')\">Call</button>\n                        </div>\n                        <div class=\"social-media\">\n                            <button class=\"btn btn-l btn-dark\" onclick=\"window.open('https://github.com/bbazukun123')\"><i class=\"fab fa-github\"></i>&nbsp;Github</button>\n                            <button class=\"btn btn-l btn-dark\" onclick=\"window.open('https://www.linkedin.com/in/chanodom-utsahajit/')\"><i class=\"fab fa-linkedin\"></i>&nbsp;Linkedin</button>\n                        </div>\n                    </div>");
                  _this.aboutElem.innerHTML += contactOutput;
                  console.log("Done Contact!");
                }).catch(function (err) {
                  throw err;
                })); //Fetch toolkit content

                this.fetchArray.push(fetch("content/toolkitContent.json").then(function (res) {
                  return res.json();
                }).then(function (data) {
                  _this.contentData[6] = data;
                }).catch(function (err) {
                  throw err;
                }));

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initContent() {
        return _initContent.apply(this, arguments);
      }

      return initContent;
    }() //Pre-cache immediately needed images into users' browser

  }, {
    key: "preloadImages",
    value: function preloadImages() {
      var _this2 = this;

      console.log("Enter Preload Img!");
      var linkList = []; //Accumulate portfolio image links

      this.contentData[0].forEach(function (d) {
        console.log(d.content.media[0].type);
        if (d.content.media[0].type === "image") linkList.push("portfolio/".concat(d.id, "/").concat(d.content.media[0].link));
      }); //Accumulate adventure image links

      this.contentData[1].forEach(function (d) {
        linkList.push("adventure/".concat(d.id, "/").concat(d.cover));
        if (d.diary.media[0].type === "image") linkList.push("adventure/".concat(d.id, "/").concat(d.diary.media[0].link));
      });
      var counter = linkList.length;
      var loadingList = [];
      linkList.forEach(function (link) {
        var img = new Image();

        img.onload = function () {
          var index = loadingList.indexOf(_this2);

          if (index !== -1) {
            loadingList.splice(index, 1);
          }

          counter--;
          console.log(counter);
          if (counter == 0) document.querySelector(".loading-screen").dispatchEvent(new Event("loaded"));
        };

        loadingList.push(img);
        img.src = "./images/" + link;
      });
    } //Update portfolio card content based on input of field type filter

  }, {
    key: "updatePortfolio",
    value: function updatePortfolio(inField) {
      var hide = function hide(item) {
        if (!item.classList.contains("hidden")) {
          var transitionExtract = item.style.transition;
          item.style.transition = "";
          requestAnimationFrame(function () {
            item.style.height = item.scrollHeight + "px";
            item.style.transition = transitionExtract;
            requestAnimationFrame(function () {
              item.style.height = 0 + "px";
            });
          });
          var collapse = ["transitionend", function (e) {
            item.removeEventListener.apply(item, collapse);
            item.classList.add("hidden");
            document.getElementById("portfolio-card").dispatchEvent(new Event("faded"));
          }];
          item.addEventListener.apply(item, collapse);
        }
      };

      var show = function show(item) {
        if (item.classList.contains("hidden")) {
          item.classList.remove("hidden");
          item.style.height = item.scrollHeight + "px";
          var expand = ["transitionend", function (e) {
            item.removeEventListener.apply(item, expand);
            item.style.height = null;
            document.getElementById("portfolio-card").dispatchEvent(new Event("faded"));
          }];
          item.addEventListener.apply(item, expand);
        }
      };

      if (inField === "all") {
        document.querySelectorAll(".card-item.UX").forEach(function (item) {
          show(item);
        });
        document.querySelectorAll(".card-item.Dev").forEach(function (item) {
          show(item);
        });
        document.querySelectorAll(".card-item.Design").forEach(function (item) {
          show(item);
        });
      } else if (inField === "UX") {
        document.querySelectorAll(".card-item.UX").forEach(function (item) {
          show(item);
        });
        document.querySelectorAll(".card-item.Dev").forEach(function (item) {
          hide(item);
        });
        document.querySelectorAll(".card-item.Design").forEach(function (item) {
          hide(item);
        });
      } else if (inField === "Dev") {
        document.querySelectorAll(".card-item.UX").forEach(function (item) {
          hide(item);
        });
        document.querySelectorAll(".card-item.Dev").forEach(function (item) {
          show(item);
        });
        document.querySelectorAll(".card-item.Design").forEach(function (item) {
          hide(item);
        });
      } else if (inField === "Design") {
        document.querySelectorAll(".card-item.UX").forEach(function (item) {
          hide(item);
        });
        document.querySelectorAll(".card-item.Dev").forEach(function (item) {
          hide(item);
        });
        document.querySelectorAll(".card-item.Design").forEach(function (item) {
          show(item);
        });
      }
    } //Switch the logs content between the adventure and upgrade tabs

  }, {
    key: "updateLogs",
    value: function updateLogs(tab) {
      //Define transition sequence between tabs
      var fade = function fade(inElem, outElem) {
        outElem.classList.add("fade");
        inElem.classList.remove("hidden");
        var fadeEvent = ["transitionend", function (e) {
          outElem.removeEventListener.apply(outElem, fadeEvent);
          outElem.classList.add("hidden");
          inElem.classList.remove("fade");
          document.getElementById("logs-card").dispatchEvent(new Event("faded"));
        }];
        outElem.addEventListener.apply(outElem, fadeEvent);
      };

      if (tab === "Adventure") {
        fade(document.getElementById("adventure-logs"), document.getElementById("upgrade-logs"));
      } else if (tab === "Upgrade") {
        fade(document.getElementById("upgrade-logs"), document.getElementById("adventure-logs"));
      }
    } //Switch the about card content between the experience, education, & contact tabs

  }, {
    key: "updateAbout",
    value: function updateAbout(tab) {
      //Define transition sequence between tabs
      var fade = function fade(inElem, outElem) {
        outElem.classList.add("fade");
        inElem.classList.remove("hidden");
        var fadeEvent = ["transitionend", function (e) {
          outElem.removeEventListener.apply(outElem, fadeEvent);
          outElem.classList.add("hidden");
          inElem.classList.remove("fade");
          document.getElementById("about-card").dispatchEvent(new Event("faded"));
        }];
        outElem.addEventListener.apply(outElem, fadeEvent);
      };

      if (tab === "Experience") {
        fade(document.getElementById("experience-about"), Array.from(document.getElementById("about-card").children).filter(function (item) {
          return !item.classList.contains("hidden");
        })[0]);
      } else if (tab === "Education") {
        fade(document.getElementById("education-about"), Array.from(document.getElementById("about-card").children).filter(function (item) {
          return !item.classList.contains("hidden");
        })[0]);
      } else if (tab === "Contact") {
        fade(document.getElementById("contact-about"), Array.from(document.getElementById("about-card").children).filter(function (item) {
          return !item.classList.contains("hidden");
        })[0]);
      }
    } //Update detail pop-up card to match the content of the select element

  }, {
    key: "updateDetail",
    value: function updateDetail(id) {
      //Render detail card for the selected portfolio item
      if (id.includes("portfolio")) {
        var d;
        var detailContent = "";
        this.contentData[0].forEach(function (p) {
          if (p.id === id.replace("portfolio-", "")) d = p;
        });
        detailContent += "<h1 class=\"mt-3 px-6\">".concat(d.title, "</h1>\n                <h3 class=\"m-3 px-6\">").concat(d.desc, "</h3>\n                <hr class=\"mt-3 mb-1\">\n                <div class=\"detail-badges\">\n                    <h3 class=\"").concat(function (field) {
          if (field === "UX") return "text-success";else if (field === "Dev") return "text-danger";else if (field === "Design") return "text-warning";
        }(d.field), "\">").concat(d.field, "</h3>\n                    <div class=\"mx-2\"></div>\n                    <h5 class=\"text-left\">").concat(d.type.replace(" ", "<br>"), "</h5>\n                </div>  \n                <div class=\"detail-gallery\">\n                    <div class=\"media-container\">");
        var tempCounter = 1;
        d.content.media.forEach(function (m) {
          if (m.type === "image") {
            detailContent += "<div id=\"media-".concat(tempCounter, "\" class=\"media-image\" style=\"background-image: url(./images/portfolio/").concat(d.id, "/").concat(m.link, ")\"></div>");
          } else if (m.type === "video") {
            detailContent += "<div id=\"media-".concat(tempCounter, "\" class=\"media-video\"><iframe src=\"").concat(m.link, "\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe></div>");
          }

          tempCounter++;
        });
        detailContent += "</div>       \n                </div>\n                <div class=\"media-control mb-8\">\n                    <button id=\"media-left-btn\" class=\"btn btn-l btn-dark mx-1\"><i class=\"fas fa-chevron-left\"></i></button>\n                    <h3 id=\"gallery-counter\">1 / ".concat(d.content.media.length, "</h3>\n                    <button id=\"media-right-btn\" class=\"btn btn-l btn-dark mx-1\"><i class=\"fas fa-chevron-right\"></i></button>\n                </div>\n                <h4 class=\"detail-content px-5 mb-5 text-paragraph text-dark-muted\">").concat(d.content.detail, "</h4><br> \n                <div class=\"cta-panel cta-danger challenges-panel\">\n                    <h3><i class=\"fas fa-mountain\"></i></h3>\n                    <h3 class=\"p-2\">Challenges</h3>\n                </div>\n                <div class=\"list-content list-danger\">");
        d.content.challenges.forEach(function (c) {
          detailContent += "<h4>".concat(c.challenge, "</h4>");
        });
        detailContent += "</div>\n                <div class=\"cta-panel tools-panel\">\n                    <h3><i class=\"fas fa-tools\"></i></h3>\n                    <h3 class=\"p-2\">Tools</h3>\n                </div>\n                <div class=\"list-content\">";
        d.content.tools.forEach(function (t) {
          detailContent += "<h4>".concat(t.tool, "</h4>");
        });
        detailContent += "</div>\n                <div class=\"height-filler\"></div>";
        this.detailElem.innerHTML = detailContent;
        document.querySelector(".media-container>div:first-child").classList.add("active"); //Setup gallery buttons

        var mediaBtns = Array.from(document.querySelector(".media-control").children);
        mediaBtns[0].addEventListener("click", function (e) {
          var current = document.querySelector(".media-container .active");
          current.classList.remove("active");
          if (current.previousElementSibling) current.previousElementSibling.classList.add("active");else current.parentElement.lastChild.classList.add("active");
          document.getElementById("gallery-counter").innerText = "".concat(document.querySelector(".media-container .active").id.replace("media-", ""), " / ").concat(d.content.media.length);
        });
        mediaBtns[2].addEventListener("click", function (e) {
          var current = document.querySelector(".media-container .active");
          current.classList.remove("active");
          if (current.nextElementSibling) current.nextElementSibling.classList.add("active");else current.parentElement.firstChild.classList.add("active");
          document.getElementById("gallery-counter").innerText = "".concat(document.querySelector(".media-container .active").id.replace("media-", ""), " / ").concat(d.content.media.length);
        });
      } //Render detail card for the selected adventure item
      else if (id.includes("adventure")) {
          var _d;

          var _detailContent = "";
          this.contentData[1].forEach(function (adv) {
            if (adv.id === id.replace("adventure-", "")) _d = adv;
          });
          _detailContent += "<h1 class=\"mt-3 px-5\">".concat(_d.title, "</h1>\n                <h3 class=\"m-2 px-5 text-success\">").concat(_d.desc, "</h3>\n                <hr class=\"mt-2 mb-2\">\n                <h3 class=\"mb-5 text-danger\">").concat(_d.month, "</h3> \n                <div class=\"detail-gallery\">\n                    <div class=\"media-container\">");
          var _tempCounter = 1;

          _d.diary.media.forEach(function (m) {
            if (m.type === "image") {
              _detailContent += "<div id=\"media-".concat(_tempCounter, "\" class=\"media-image\" style=\"background-image: url(./images/adventure/").concat(_d.id, "/").concat(m.link, ")\"></div>");
            } else if (m.type === "video") {
              _detailContent += "<div id=\"media-".concat(_tempCounter, "\" class=\"media-video\"><iframe src=\"").concat(m.link, "\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe></div>");
            }

            _tempCounter++;
          });

          _detailContent += "</div>\n                </div>\n                <div class=\"media-control mb-8\">\n                    <button id=\"media-left-btn\" class=\"btn btn-l btn-dark mx-1\"><i class=\"fas fa-chevron-left\"></i></button>\n                    <h3 id=\"gallery-counter\">1 / ".concat(_d.diary.media.length, "</h3>\n                    <button id=\"media-right-btn\" class=\"btn btn-l btn-dark mx-1\"><i class=\"fas fa-chevron-right\"></i></button>\n                </div>\n                <h4 class=\"detail-content px-5 mb-5 text-paragraph text-dark-muted\">").concat(_d.diary.text, "</h4><br> \n                <div class=\"height-filler\"></div>");
          this.detailElem.innerHTML = _detailContent;
          document.querySelector(".media-container>div:first-child").classList.add("active"); //Setup gallery buttons

          var _mediaBtns = Array.from(document.querySelector(".media-control").children);

          _mediaBtns[0].addEventListener("click", function (e) {
            var current = document.querySelector(".media-container .active");
            current.classList.remove("active");
            if (current.previousElementSibling) current.previousElementSibling.classList.add("active");else current.parentElement.lastChild.classList.add("active");
            document.getElementById("gallery-counter").innerText = "".concat(document.querySelector(".media-container .active").id.replace("media-", ""), " / ").concat(_d.diary.media.length);
          });

          _mediaBtns[2].addEventListener("click", function (e) {
            var current = document.querySelector(".media-container .active");
            current.classList.remove("active");
            if (current.nextElementSibling) current.nextElementSibling.classList.add("active");else current.parentElement.firstChild.classList.add("active");
            document.getElementById("gallery-counter").innerText = "".concat(document.querySelector(".media-container .active").id.replace("media-", ""), " / ").concat(_d.diary.media.length);
          });
        } //Render detail card for the selected experience item
        else if (id.includes("experience")) {
            var _d2;

            var _detailContent2 = "";
            this.contentData[3].forEach(function (exp) {
              if (exp.id === id.replace("experience-", "")) _d2 = exp;
            });
            _detailContent2 += "<h1 class=\"mt-3 px-4\">".concat(_d2.title, "</h1>\n                <h3 class=\"m-3 px-4 text-success\">").concat(_d2.role, "</h3>\n                <hr class=\"mt-1 mb-1\">\n                <h3 class=\"m-2\">").concat(_d2.months.replace("-", " - "), "</h3>\n                <h3 class=\"m-1 text-danger\"><i class=\"fas fa-map-marker-alt\"></i>&nbsp;").concat(_d2.location, "</h3>\n                <h4 class=\"detail-content px-5 mt-8 mb-4 text-paragraph text-dark-muted\">").concat(_d2.detail, "</h4><br> \n                <div class=\"cta-panel key-learning-panel\">\n                    <h3><i class=\"fas fa-key\"></i></h3>\n                    <h3 class=\"p-2\">Key Learning</h3>\n                </div>\n                <h3 id=\"key-learning\" class=\"text-dark-muted\">").concat(_d2.gain, "</h3>\n                <div class=\"height-filler\"></div>");
            this.detailElem.innerHTML = _detailContent2;
          } //Render detail card for the selected education item
          else if (id.includes("education")) {
              var _d3;

              var _detailContent3 = "";
              this.contentData[4].forEach(function (edu) {
                if (edu.id === id.replace("education-", "")) _d3 = edu;
              });
              _detailContent3 += "<h1 class=\"mt-3 px-4\">".concat(_d3.deg, "</h1>\n                <h3 class=\"m-3 px-4 text-success\">").concat(_d3.uni, "</h3>\n                <hr class=\"mt-1 mb-1\">\n                <h3 class=\"m-2\">").concat(_d3.year, "</h3>\n                <h3 class=\"m-2 text-warning\"><i class=\"fas fa-award\"></i>&nbsp;").concat(_d3.honour, "</h3>\n                ").concat(function (award) {
                if (typeof award !== "undefined") return "<h4 class=\"m-2 px-4 text-danger\"><i class=\"fas fa-medal\"></i>&nbsp;".concat(award, "</h3>");else return "";
              }(_d3.award), "\n                <h4 class=\"detail-content px-5 mt-6 mb-4 text-paragraph text-dark-muted\"><span class=\"text-danger\">Key Modules:&nbsp;</span>").concat(_d3.modules, "</h4><br> \n                <div class=\"cta-panel dissertation-panel\">\n                    <h3><i class=\"fas fa-book\"></i></h3>\n                    <h3 class=\"p-2\">Dissertation</h3>\n                </div>\n                <h4 id=\"dissertation\" class=\"text-dark-muted\">").concat(_d3.disser, "</h4>\n                <div class=\"height-filler\"></div>");
              this.detailElem.innerHTML = _detailContent3;
            }

      this.detailElem.scrollTop = 0;
    } //Update toolkit pop-up card to match the content of the select toolkit

  }, {
    key: "updateToolkit",
    value: function updateToolkit(id) {
      var d;
      var toolkitContent = "";
      if (id === "ux-screen") d = this.contentData[6][0];else if (id === "dev-screen") d = this.contentData[6][1];else if (id === "business-screen") d = this.contentData[6][2];
      toolkitContent += "<h1 class=\"mt-5 mb-4\">".concat(d.title, "</h1>\n            <hr class=\"mt-1 mb-1\">\n            <h4 class=\"detail-content px-5 mt-4 mb-4 text-paragraph text-dark-muted\">").concat(d.desc, "</h4><br>");
      var setCount = 1;
      d.toolkit.forEach(function (set) {
        toolkitContent += "<div class=\"cta-panel cta-".concat(d.color, " toolkit-panel\">\n                <h3 class=\"pl-1\"><i class=\"fas fa-").concat(set.fa, "\"></i></h3>\n                <h3 class=\"p-2 text-left\">").concat(set.set, "</h3>\n                <button id=\"set").concat(setCount, "-btn\" class=\"btn btn-l btn-light mx-1 toggle-btn toolkit-toggle toggled\"><i class=\"fas fa-chevron-down\"></i></button>\n            </div>\n            <div id=\"set").concat(setCount, "\" class=\"list-content list-").concat(d.color, "\">");
        set.tools.forEach(function (tool) {
          toolkitContent += "<h4>".concat(tool.tool, "</h4>");
        });
        toolkitContent += "</div>";
        setCount++;
      });
      this.toolkitElem.innerHTML = toolkitContent + "<div class=\"height-filler\"></div>";
      this.toolkitElem.scrollTop = 0; //Setup toolkit toggles

      document.querySelectorAll(".toolkit-toggle").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          var outputElem = document.getElementById(e.target.id.replace("-btn", ""));

          if (outputElem.classList.contains("hidden")) {
            outputElem.style.height = outputElem.scrollHeight + "px";
            var expand = ["transitionend", function (e) {
              outputElem.removeEventListener.apply(outputElem, expand);
              outputElem.style.height = null;
            }];
            outputElem.addEventListener.apply(outputElem, expand);
            outputElem.classList.remove("hidden");
            e.target.classList.add("toggled");
          } else {
            var transitionExtract = outputElem.style.transition;
            outputElem.style.transition = "";
            requestAnimationFrame(function () {
              outputElem.style.height = outputElem.scrollHeight + "px";
              outputElem.style.transition = transitionExtract;
              requestAnimationFrame(function () {
                outputElem.style.height = 0 + "px";
              });
            });
            var collapse = ["transitionend", function (e) {
              outputElem.removeEventListener.apply(outputElem, collapse);
              outputElem.classList.add("hidden");
            }];
            outputElem.addEventListener.apply(outputElem, collapse);
            e.target.classList.remove("toggled");
          }
        });
      });
    }
  }]);
  return ContentManager;
}();

exports.default = ContentManager;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js"}],"js/AppController.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _generateBG = _interopRequireDefault(require("./generateBG"));

var _updateNav = _interopRequireDefault(require("./updateNav"));

var _ContentManager = _interopRequireDefault(require("./ContentManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Import content controller and feature modules ------------------------------------------
var AppController =
/*#__PURE__*/
function () {
  function AppController(routes) {
    (0, _classCallCheck2.default)(this, AppController);
    this.routes = routes; //Grab output & control elements

    this.viewElem = document.querySelector(".view");
    this.supViewElem = document.querySelector(".sup-view");
    this.detailViewElem = document.querySelector(".detail-view");
    this.toolkitViewElem = document.querySelector(".toolkit-view");
    this.navElem = document.querySelector(".nav");
    this.loadingScreenElem = document.querySelector(".loading-screen"); //Setup content manager & declare empty variables for content data

    this.contentManager = new _ContentManager.default();
    this.contentData = [];
  } //Initialising the application's base content and assign a listener to the hash changes of the URL ------------------------------------------


  (0, _createClass2.default)(AppController, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.renderViews(this.routes);
      window.addEventListener("hashchange", function (e) {
        _this.routeChanged(_this.routes);
      });
      /* window.addEventListener("resize", e => {
          document.querySelector("body").style.height = window.clientHeight;
          document.querySelector("body").style.width = window.clientWidth
      }); */
    } //Render the base screens' content ------------------------------------------

  }, {
    key: "renderViews",
    value: function renderViews(r) {
      var _this2 = this;

      if (navigator.userAgent.match(/iPhone|iPod/i)) document.getElementById("fullscreen-msg").style.display = "none";
      this.orderedData = [r.length]; //Sort route base on assigned view position
      //const orderedRoutes = r.sort((a,b) => a.viewPos - b.viewPos);
      //Grab base HTML for main screens, including about screen (** use map instead of foreach to return an array of promises **)

      Promise.all(r.map(
      /*#__PURE__*/
      function () {
        var _ref = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee(route) {
          var res, data, _res, _data;

          return _regenerator.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(Math.sign(route.viewPos) !== -1)) {
                    _context.next = 10;
                    break;
                  }

                  _context.next = 3;
                  return fetch("views/".concat(route.htmlName));

                case 3:
                  res = _context.sent;
                  _context.next = 6;
                  return res.text();

                case 6:
                  data = _context.sent;
                  _this2.orderedData[route.viewPos - 1] = data; //this.viewElem.innerHTML += data;

                  _context.next = 17;
                  break;

                case 10:
                  _context.next = 12;
                  return fetch("views/".concat(route.htmlName));

                case 12:
                  _res = _context.sent;
                  _context.next = 15;
                  return _res.text();

                case 15:
                  _data = _context.sent;
                  _this2.supViewElem.innerHTML += _data;

                case 17:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }())).then(function () {
        //console.log(this.orderedData);
        _this2.orderedData.forEach(function (data) {
          _this2.viewElem.innerHTML += data;
        }); //Once base HTMLs are in place, move on to inject content into those structure 


        _this2.contentManager.initContent(); //Wait for all the content data to be fetched and injected before setting up their functionalities


        Promise.all(_this2.contentManager.fetchArray).then(function () {
          console.log("Done init content!++++++");

          _this2.loadingScreenElem.addEventListener("transitionend", function (e) {
            var eventElem = e.target;

            if (eventElem === _this2.loadingScreenElem) {
              eventElem.parentElement.removeChild(_this2.loadingScreenElem);
              _this2.loadingScreenElem = null;
            }
          });

          (0, _generateBG.default)();

          _this2.setupButtons();

          _this2.setupScrollCards();

          _this2.routeChanged(r);
        });
      });
    } //Setup all the selector & item buttons' actions ------------------------------------------

  }, {
    key: "setupButtons",
    value: function setupButtons() {
      var _this3 = this;

      //Grab button elements
      this.portfolioBtns = document.querySelector(".portfolio-selector-items");
      this.logsBtns = document.querySelector(".logs-selector-items");
      this.aboutBtns = document.querySelector(".about-selector-items");
      this.upgradeToggles = document.querySelectorAll(".upgrade-toggle");
      this.detailBtns = document.querySelectorAll(".detail-btn"); //Setup buttons on portfolio screen

      Array.from(this.portfolioBtns.children).forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          var portfolioCard = document.getElementById("portfolio-card");
          var transitionEvent = ["faded", function (e) {
            portfolioCard.removeEventListener.apply(portfolioCard, transitionEvent); //Hacky Solution, Please find a way to fix this propperly!!! ***********

            setTimeout(function () {
              _this3.updateScrollCard(portfolioCard);
            }, 1);
          }];
          portfolioCard.addEventListener.apply(portfolioCard, transitionEvent);

          _this3.contentManager.updatePortfolio(e.target.id);

          Array.from(_this3.portfolioBtns.children).forEach(function (btn) {
            if (btn.classList.contains("selected")) btn.classList.remove("selected");
          });
          e.target.classList.add("selected");
        });
      }); //Setup buttons on logs screen

      Array.from(this.logsBtns.children).forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          var logsCard = document.getElementById("logs-card");
          var transitionEvent = ["faded", function (e) {
            logsCard.removeEventListener.apply(logsCard, transitionEvent);

            _this3.updateScrollCard(logsCard);

            logsCard.scrollTop = 0;
          }];
          logsCard.addEventListener.apply(logsCard, transitionEvent);

          _this3.contentManager.updateLogs(e.target.id);

          Array.from(_this3.logsBtns.children).forEach(function (btn) {
            if (btn.classList.contains("selected")) btn.classList.remove("selected");
          });
          e.target.classList.add("selected");
        });
      });
      this.upgradeToggles.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          var outputElem = document.getElementById(e.target.id.replace("-btn", ""));

          if (outputElem.classList.contains("hidden")) {
            outputElem.style.height = outputElem.scrollHeight + "px";
            var expand = ["transitionend", function (e) {
              outputElem.removeEventListener.apply(outputElem, expand);
              outputElem.style.height = null;

              _this3.updateScrollCard(document.getElementById("logs-card"));
            }];
            outputElem.addEventListener.apply(outputElem, expand);
            outputElem.classList.remove("hidden");
            e.target.classList.add("toggled");
          } else {
            var transitionExtract = outputElem.style.transition;
            outputElem.style.transition = "";
            requestAnimationFrame(function () {
              outputElem.style.height = outputElem.scrollHeight + "px";
              outputElem.style.transition = transitionExtract;
              requestAnimationFrame(function () {
                outputElem.style.height = 0 + "px";
              });
            });
            var collapse = ["transitionend", function (e) {
              outputElem.removeEventListener.apply(outputElem, collapse);
              outputElem.classList.add("hidden");

              _this3.updateScrollCard(document.getElementById("logs-card"));
            }];
            outputElem.addEventListener.apply(outputElem, collapse);
            e.target.classList.remove("toggled");
          }
        });
      }); //Setup buttons on about screen

      Array.from(this.aboutBtns.children).forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          var aboutCard = document.getElementById("about-card");
          var transitionEvent = ["faded", function (e) {
            aboutCard.removeEventListener.apply(aboutCard, transitionEvent);

            _this3.updateScrollCard(aboutCard);

            aboutCard.scrollTop = 0;
          }];
          aboutCard.addEventListener.apply(aboutCard, transitionEvent);

          _this3.contentManager.updateAbout(e.target.id);

          Array.from(_this3.aboutBtns.children).forEach(function (btn) {
            if (btn.classList.contains("selected")) btn.classList.remove("selected");
          });
          e.target.classList.add("selected");
        });
      }); //Setup more info, detail & diary action buttons for list elements

      this.detailBtns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          _this3.showDetail(e.target.id);
        });
      }); //Setup close/back button for pop-up elements

      document.querySelectorAll(".back-btn").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          if (e.target.classList.contains("detail-back")) _this3.hideDetail();else if (e.target.classList.contains("toolkit-back")) {
            _this3.hideToolkit(); //this.viewElem.classList.remove("disabled");

          }
        });
      }); //Setup toolkit buttons (monitor buttons)

      document.getElementById("ux-screen").addEventListener("click", function (e) {
        _this3.showToolkit(e.target.id); //this.viewElem.classList.add("disabled");

      });
      document.getElementById("dev-screen").addEventListener("click", function (e) {
        _this3.showToolkit(e.target.id); //this.viewElem.classList.add("disabled");

      });
      document.getElementById("business-screen").addEventListener("click", function (e) {
        _this3.showToolkit(e.target.id); //this.viewElem.classList.add("disabled");

      }); //Setup enter button on loading screen

      document.getElementById("enter-btn").addEventListener("click", function (e) {
        if (navigator.userAgent.match(/Android|BlackBerry|Opera Mini|IEMobile/i)) document.querySelector("body").requestFullscreen();

        _this3.loadingScreenElem.classList.add("entered");
      });
    } //Setup all scrollable card elements ------------------------------------------

  }, {
    key: "setupScrollCards",
    value: function setupScrollCards() {
      var _this4 = this;

      var cardLists = document.querySelectorAll(".card-list");
      cardLists.forEach(function (list) {
        list.addEventListener("scroll", function (e) {
          _this4.updateScrollCard(e.target);
        });

        _this4.updateScrollCard(list);
      });
    } //Acts as a router, update the content accordingly (Initialisation: Setup and show the default screen) ------------------------------------------

  }, {
    key: "routeChanged",
    value: function routeChanged(r) {
      var _this5 = this;

      if (window.location.hash.replace("#", "") !== "about") {
        if (window.location.hash.length > 0) {
          if (this.loadingScreenElem) {
            this.loadingScreenElem.classList.add("loaded");
            this.loadingScreenElem.classList.add("entered");
          }

          for (var i = 0, length = r.length; i < length; i++) {
            var route = r[i];

            if (route.isActiveRoute(window.location.hash.replace("#", ""))) {
              this.updateView(route);
            }
          }
        } else {
          var _this$loadingScreenEl;

          var loadedEvent = ["loaded", function (e) {
            var _this5$loadingScreenE;

            (_this5$loadingScreenE = _this5.loadingScreenElem).removeEventListener.apply(_this5$loadingScreenE, loadedEvent);

            console.log("Done Loading Imgs");

            _this5.loadingScreenElem.classList.add("loaded");

            for (var _i = 0, _length = r.length; _i < _length; _i++) {
              var _route = r[_i];
              if (_route.defaultRoute) _this5.updateView(_route); //window.location.hash = "#" + route.name;
            }
          }];

          (_this$loadingScreenEl = this.loadingScreenElem).addEventListener.apply(_this$loadingScreenEl, loadedEvent);

          this.contentManager.preloadImages();
        }
      } else {
        this.showAbout();
      }
    } //Update scrollable card element ------------------------------------------

  }, {
    key: "updateScrollCard",
    value: function updateScrollCard(_ref2) {
      var scrollHeight = _ref2.scrollHeight,
          clientHeight = _ref2.clientHeight,
          scrollTop = _ref2.scrollTop,
          parentElement = _ref2.parentElement;

      if (scrollHeight > clientHeight) {
        if (scrollTop === 0) {
          parentElement.parentElement.classList.add("no-scroll-shadow-top");
          parentElement.parentElement.classList.remove("no-scroll-shadow-bottom");
        } else if (scrollTop !== 0 && scrollTop + clientHeight < scrollHeight) {
          parentElement.parentElement.classList.remove("no-scroll-shadow-top");
          parentElement.parentElement.classList.remove("no-scroll-shadow-bottom");
        } else {
          parentElement.parentElement.classList.remove("no-scroll-shadow-top");
          parentElement.parentElement.classList.add("no-scroll-shadow-bottom");
        }
      } else {
        parentElement.parentElement.classList.add("no-scroll-shadow-top");
        parentElement.parentElement.classList.add("no-scroll-shadow-bottom");
      }
    } //Update and transition left/right to the according main screen ------------------------------------------

  }, {
    key: "updateView",
    value: function updateView(r) {
      if (!document.querySelector(".sup-view-active")) {
        /* if(window.location.hash.length === 0)
            window.location.hash = "#" + r.name; */
        var viewClasses = this.viewElem.classList;

        if (viewClasses[1] !== "view-".concat(r.viewPos)) {
          viewClasses.replace(viewClasses[1], "view-".concat(r.viewPos));
        }

        if (!viewClasses.contains("animate")) viewClasses.add("animate");
      } else {
        document.querySelector(".sup-view-active").classList.remove("sup-view-active");
        this.supViewElem.classList.remove("roll-in");
        this.viewElem.classList.remove("disabled");
      }

      (0, _updateNav.default)(r.htmlName);
    } //Roll in the about screen ------------------------------------------

  }, {
    key: "showAbout",
    value: function showAbout() {
      var routeClasses = document.getElementById("about-t").classList;

      if (!routeClasses.contains("sup-view-active")) {
        routeClasses.add("sup-view-active");
        this.supViewElem.classList.add("roll-in");
        this.viewElem.classList.add("disabled");
      }

      (0, _updateNav.default)("about.html");
    } //Pop-up the detail screen ------------------------------------------

  }, {
    key: "showDetail",
    value: function showDetail(id) {
      this.contentManager.updateDetail(id);
      this.detailViewElem.classList.add("pop-up");
      this.navElem.classList.add("hidden");
    } //Pop-up the toolkit screen ------------------------------------------

  }, {
    key: "showToolkit",
    value: function showToolkit(id) {
      this.contentManager.updateToolkit(id);
      this.toolkitViewElem.classList.add("pop-up");
      this.navElem.classList.add("hidden");
    } //Close the detail screen ------------------------------------------

  }, {
    key: "hideDetail",
    value: function hideDetail() {
      this.detailViewElem.classList.remove("pop-up");
      this.navElem.classList.remove("hidden");
    } //Close the toolkit screen ------------------------------------------

  }, {
    key: "hideToolkit",
    value: function hideToolkit() {
      this.toolkitViewElem.classList.remove("pop-up");
      this.navElem.classList.remove("hidden");
    }
  }]);
  return AppController;
}();

exports.default = AppController;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","./generateBG":"js/generateBG.js","./updateNav":"js/updateNav.js","./ContentManager":"js/ContentManager.js"}],"js/route.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Route =
/*#__PURE__*/
function () {
  function Route(name, htmlName, viewPos, defaultRoute) {
    (0, _classCallCheck2.default)(this, Route);
    this.name = name;
    this.viewPos = viewPos;
    this.htmlName = htmlName;
    this.defaultRoute = defaultRoute;
  } //Self checking for activeness


  (0, _createClass2.default)(Route, [{
    key: "isActiveRoute",
    value: function isActiveRoute(hashedPath) {
      return hashedPath.replace("#", "") === this.name;
    }
  }]);
  return Route;
}();

exports.default = Route;
},{"@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js"}],"index.js":[function(require,module,exports) {
"use strict";

require("./scss/style.scss");

var _AppController = _interopRequireDefault(require("./js/AppController"));

var _route = _interopRequireDefault(require("./js/route"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Import key modules and other resources ------------------------------------------
//Instantiate & run app controller ------------------------------------------
var appController = new _AppController.default([//Pass in main screens as routes
new _route.default("desk", "desk.html", 2, true), new _route.default("about", "about.html", -1), new _route.default("portfolio", "portfolio.html", 3), new _route.default("logs", "logs.html", 1)]); //Run the app initialisation ------------------------------------------

appController.init();
window.scrollTo(0, 1);
window.scrollTo(0, document.querySelector(".view").scrollHeight);
},{"./scss/style.scss":"scss/style.scss","./js/AppController":"js/AppController.js","./js/route":"js/route.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51954" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map