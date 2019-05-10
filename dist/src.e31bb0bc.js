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

function generateBG() {
  document.querySelectorAll(".container .room-bg").forEach(function (bg) {
    var column = bg.getAttribute("column"); //Generate Wallpaper

    var wallpaperOutput = "";

    for (var i = 0; i < column; i++) {
      wallpaperOutput += "<div></div>";
    }

    var output = "<div class=\"wallpaper\">\n            ".concat(wallpaperOutput, "\n        </div>\n        <div class=\"baseboard\"></div>\n        <div class=\"floor\"></div>\n        ");
    bg.innerHTML = output;
  });
}
},{}],"js/updateNav.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = updateNav;

function updateNav(pageName) {
  var navElem = document.querySelector(".nav");
  var navBtnElem = document.querySelectorAll(".nav-btn");
  var navTextElem = document.querySelectorAll(".nav-text");
  var pageNavData = {
    desk: ["bottom", "logs", "about", "portfolio"],
    logs: ["bottom", "null", "null", "desk"],
    portfolio: ["bottom", "desk", "null", "null"],
    about: ["top", "null", "desk", "null"]
  };
  var navItems = pageNavData[pageName.replace(".html", "")];
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

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContentManager =
/*#__PURE__*/
function () {
  function ContentManager(router) {
    (0, _classCallCheck2.default)(this, ContentManager);
    this.contentData = [];
    this.fetchArray = [];
  } //Grab all the content data from JSON files & render initial content


  (0, _createClass2.default)(ContentManager, [{
    key: "initContent",
    value: function initContent() {
      var _this = this;

      //let fetchArray = [];
      //Fetch portfolio content
      this.fetchArray.push(fetch("content/portfolioContent.json").then(function (res) {
        return res.json();
      }).then(function (data) {
        _this.contentData.push(data);
      }).catch(function (err) {
        throw err;
      })); //Fetch adventure content

      this.fetchArray.push(fetch("content/adventureContent.json").then(function (res) {
        return res.json();
      }).then(function (data) {
        _this.contentData.push(data);
      }).catch(function (err) {
        throw err;
      })); //Fetch upgrade(learning logs) content

      this.fetchArray.push(fetch("content/upgradeContent.json").then(function (res) {
        return res.json();
      }).then(function (data) {
        _this.contentData.push(data);
      }).catch(function (err) {
        throw err;
      })); //Fetch experience content

      this.fetchArray.push(fetch("content/experienceContent.json").then(function (res) {
        return res.json();
      }).then(function (data) {
        _this.contentData.push(data);
      }).catch(function (err) {
        throw err;
      })); //Fetch education content

      this.fetchArray.push(fetch("content/educationContent.json").then(function (res) {
        return res.json();
      }).then(function (data) {
        _this.contentData.push(data);
      }).catch(function (err) {
        throw err;
      })); //Fetch contact content

      this.fetchArray.push(fetch("content/contactContent.json").then(function (res) {
        return res.json();
      }).then(function (data) {
        _this.contentData.push(data);
      }).catch(function (err) {
        throw err;
      })); //Fetch toolkit content

      this.fetchArray.push(fetch("content/toolkitContent.json").then(function (res) {
        return res.json();
      }).then(function (data) {
        _this.contentData.push(data);
      }).catch(function (err) {
        throw err;
      }));
      /* -------------------------------------------------------------------- */

      Promise.all(this.fetchArray).then(function () {
        //Grab all output elements
        _this.portfolioElem = document.getElementById("portfolio-card");
        _this.logsElem = document.getElementById("logs-card");
        _this.aboutElem = document.getElementById("about-card");
        _this.detailElem = document.querySelector(".detail-card");
        _this.toolkitElem = document.querySelector(".toolkit-card"); //Render portfolio content---------------------------------

        var portfolioOutput = "<div>";

        _this.contentData[0].forEach(function (p) {
          return portfolioOutput += "<div class=\"card-item ".concat(p.field, "\">\n                        <div class=\"p-2\">\n                            <h2>").concat(p.title, " (").concat(p.year, ")</h2>\n                            <h4>").concat(p.desc, "</h4>\n                        </div>\n                        <div class=\"cta-panel portfolio-panel\">\n                            <h3 class=\"p-2 bg-").concat(function (field) {
            if (field === "UX") return "success";else if (field === "Design") return "warning";else if (field === "Web") return "danger";
          }(p.field), "\">").concat(p.field, "</h3>\n                            <h5 class=\"px-2\">").concat(p.type.replace(" ", "<br>"), "</h5>\n                            <button class=\"btn btn-l btn-light\" ").concat(function (action) {
            if (action !== "none") return "onClick=\"window.open('".concat(action, "')\"");else return "style=\"visibility:hidden\"";
          }(p.action), ">").concat(function (link) {
            if (link.includes("youtu.be")) return '<i class="fas fa-play"></i>';else if (link.includes("github")) return '<i class="fab fa-github"></i>';else return "<i class=\"fas fa-link\"></i>";
          }(p.action), "</button>\n                            <button id=\"portfolio-").concat(p.id, "\" class=\"btn btn-l detail-btn btn-light mx-1\"><i class=\"fas fa-info-circle\"></i></button>\n                        </div>\n                    </div>");
        });

        _this.portfolioElem.innerHTML = portfolioOutput + "</div>"; //Render logs content------------------------------  

        var advOutput = "<div id=\"adventure-logs\">";

        _this.contentData[1].forEach(function (a) {
          return advOutput += "<div class=\"card-item\">\n                        <div class=\"card-photo\" style=\"background-image: url(../images/".concat(a.cover, ")\">\n                            <div class=\"p-2 text-light text-drop-shadow\">\n                                <h2>").concat(a.title, "</h2>\n                                <h4>").concat(a.desc, "</h4>\n                            </div>\n                        </div>\n                        <div class=\"cta-panel adventure-panel\">\n                            <h4 class=\"p-2\">").concat(a.month, "</h4>\n                            <button id=\"adventure-").concat(a.id, "\" class=\"btn btn-sm detail-btn btn-light mx-1\">Diary</button>\n                        </div>\n                    </div>");
        });

        advOutput += "</div>";
        var upgradeData = _this.contentData[2];
        var inProgressList = upgradeData.filter(function (item) {
          return item.status === "progress";
        }).sort(function (a, b) {
          return b.id - a.id;
        });
        var wishList = upgradeData.filter(function (item) {
          return item.status === "que";
        }).sort(function (a, b) {
          return b.id - a.id;
        });
        var completedList = upgradeData.filter(function (item) {
          return item.status === "completed";
        }).sort(function (a, b) {
          return b.id - a.id;
        });
        var upgradeOutput = "<div id=\"upgrade-logs\" class=\"hidden\">\n                <div class=\"cta-panel cta-warning upgrade-panel\">\n                    <h2 class=\"p-2\">In Progress</h2>\n                    <button id=\"progress-btn\" class=\"btn btn-l btn-light mx-1 toggle-btn toggled\"><i class=\"fas fa-chevron-down\"></i></button>\n                </div>\n                <div id=\"progress\" class=\"upgrade-items\">";
        inProgressList.forEach(function (item) {
          upgradeOutput += "<div class=\"p-2\">\n                        <h3>".concat(item.title, "</h3>\n                    </div>");
        });
        upgradeOutput += "</div>\n            <div class=\"cta-panel cta-danger upgrade-panel\">\n                <h2 class=\"p-2\">Knowledge Wishlist</h2>\n                <button id=\"wish-btn\" class=\"btn btn-l btn-light mx-1 toggle-btn\"><i class=\"fas fa-chevron-down\"></i></button>\n            </div>\n            <div id=\"wish\" class=\"upgrade-items hidden\">";
        wishList.forEach(function (item) {
          upgradeOutput += "<div class=\"p-2\">\n                    <h3>".concat(item.title, "</h3>\n                </div>");
        });
        upgradeOutput += "</div>\n            <div class=\"cta-panel cta-success upgrade-panel\">\n                <h2 class=\"p-2\">Recently Completed</h2>\n                <button id=\"completed-btn\" class=\"btn btn-l btn-light mx-1 toggle-btn\"><i class=\"fas fa-chevron-down\"></i></button>\n            </div>\n            <div id=\"completed\" class=\"upgrade-items hidden\">";
        completedList.forEach(function (item) {
          upgradeOutput += "<div class=\"p-2\">\n                        <h3>".concat(item.title, "</h3>\n                    </div>");
        });
        upgradeOutput += "</div></div>";
        _this.logsElem.innerHTML = advOutput + upgradeOutput; //Render about content--------------------------------

        var expOutput = "<div id=\"experience-about\">";

        _this.contentData[3].forEach(function (exp) {
          return expOutput += "<div class=\"card-item\">\n                        <div class=\"p-2\">\n                            <h2>".concat(exp.title, "</h2>\n                            <h4>").concat(exp.role, "</h4>\n                        </div>\n                        <div class=\"cta-panel experience-panel\">\n                            <h5 class=\"p-2\">").concat(exp.months, "</h5>\n                            <h5 class=\"px-2\"><i class=\"fas fa-map-marker-alt\"></i>&nbsp;").concat(exp.location, "</h5>\n                            <button id=\"experience-").concat(exp.id, "\" class=\"btn btn-sm detail-btn btn-light mx-1\">Detail</button>\n                        </div>\n                    </div>");
        });

        expOutput += "</div>";
        var edu = _this.contentData[4];
        var eduOutput = "<div id=\"education-about\" class=\"education-card hidden\">\n                        <div class=\"milestone\"></div>\n                        <div class=\"card-item\">\n                            <h2>".concat(edu[0].deg, "</h2>\n                            <h4 class=\"text-warning mt-1\">").concat(edu[0].uni, "</h4>\n                            <h3 class=\"text-warning\">").concat(edu[0].year, "</h3>\n                            <button id=\"education-1\" class=\"btn btn-sm detail-btn btn-dark my-1 px-2\">Detail</button>\n                            <hr class=\"bg-warning text-warning my-1\">\n                        </div>\n                        <div class=\"milestone\"></div>\n                        <div class=\"card-item\">\n                            <h2>").concat(edu[1].deg, "</h2>\n                            <h4 class=\"text-warning mt-1\">").concat(edu[1].uni, "</h4>\n                            <h3 class=\"text-warning\">").concat(edu[1].year, "</h3>\n                            <button id=\"education-2\" class=\"btn btn-sm detail-btn btn-dark my-1\">Detail</button>\n                            <hr class=\"bg-warning text-warning my-1\">\n                        </div>\n                        <div class=\"milestone\"></div>\n                        <div class=\"card-item\">\n                            <h2>").concat(edu[2].deg, "</h2>\n                            <h4 class=\"text-warning mt-1\">").concat(edu[2].uni, "</h4>\n                            <h3 class=\"text-warning\">").concat(edu[2].year, "</h3>\n                            <button id=\"education-3\" class=\"btn btn-sm detail-btn btn-dark my-1\">Detail</button>\n                        </div>\n                    </div>");
        var con = _this.contentData[5];
        console.log(con);
        var contactOutput = "<div id=\"contact-about\" class=\"contact-card hidden\">\n                    <h1 class=\"text-center\">Pleasure to meet you!</h1>\n                    <div class=\"avatar\">\n                        <object class=\"mb-1\" type=\"image/svg+xml\" data=\"./images/me.svg\"></object>\n                    </div> \n                    <div class=\"cta-panel contact-panel\">\n                        <h4 class=\"p-2 text-left\">Download CV</h4>\n                        <button class=\"btn btn-l btn-light mx-1\" onclick=\"window.open('./downloadable/C_Utsahajit_CV19.pdf')\"><i class=\"fas fa-download\"></i></button>\n                    </div>\n                    <div class=\"cta-panel contact-panel\">\n                        <h4 class=\"p-2 text-left\">".concat(con.email, "</h4>\n                        <button class=\"btn btn-l btn-light mx-1\" onclick=\"window.open('mailto:bzkwork1993@gmail.com')\">Email</button>\n                    </div>\n                    <div class=\"cta-panel contact-panel\">\n                        <h4 class=\"p-2 text-left\">").concat(con.mobile, "</h4>\n                        <button class=\"btn btn-l btn-light mx-1\" onclick=\"window.open('tel:+447956982635')\">Call</button>\n                    </div>\n                    <div class=\"social-media\">\n                        <button class=\"btn btn-l btn-dark\" onclick=\"window.open('https://github.com/bbazukun123')\"><i class=\"fab fa-github\"></i>&nbsp;Github</button>\n                        <button class=\"btn btn-l btn-dark\" onclick=\"window.open('https://www.linkedin.com/in/chanodom-utsahajit/')\"><i class=\"fab fa-linkedin\"></i>&nbsp;Linkedin</button>\n                    </div>\n                </div>");
        _this.aboutElem.innerHTML = expOutput + eduOutput + contactOutput;
      });
    }
  }, {
    key: "updatePortfolio",
    value: function updatePortfolio(inField) {
      switch (inField) {
        case "all":
          document.querySelectorAll(".card-item.UX").forEach(function (item) {
            item.classList.remove("hidden");
          });
          document.querySelectorAll(".card-item.Web").forEach(function (item) {
            item.classList.remove("hidden");
          });
          document.querySelectorAll(".card-item.Design").forEach(function (item) {
            item.classList.remove("hidden");
          });
          break;

        case "UX":
          document.querySelectorAll(".card-item.UX").forEach(function (item) {
            item.classList.remove("hidden");
          });
          document.querySelectorAll(".card-item.Web").forEach(function (item) {
            item.classList.add("hidden");
          });
          document.querySelectorAll(".card-item.Design").forEach(function (item) {
            item.classList.add("hidden");
          });
          break;

        case "Design":
          document.querySelectorAll(".card-item.UX").forEach(function (item) {
            item.classList.add("hidden");
          });
          document.querySelectorAll(".card-item.Web").forEach(function (item) {
            item.classList.add("hidden");
          });
          document.querySelectorAll(".card-item.Design").forEach(function (item) {
            item.classList.remove("hidden");
          });
          break;

        case "Web":
          document.querySelectorAll(".card-item.UX").forEach(function (item) {
            item.classList.add("hidden");
          });
          document.querySelectorAll(".card-item.Web").forEach(function (item) {
            item.classList.remove("hidden");
          });
          document.querySelectorAll(".card-item.Design").forEach(function (item) {
            item.classList.add("hidden");
          });
          break;

        default:
          break;
      }
    }
  }, {
    key: "updateLogs",
    value: function updateLogs(tab) {
      var logsOutput = "";

      if (tab === "Adventure") {
        document.getElementById("adventure-logs").classList.remove("hidden");
        document.getElementById("upgrade-logs").classList.add("hidden");
      } else if (tab === "Upgrade") {
        document.getElementById("adventure-logs").classList.add("hidden");
        document.getElementById("upgrade-logs").classList.remove("hidden");
      }
    }
  }, {
    key: "updateAbout",
    value: function updateAbout(tab) {
      var aboutOutput = "";

      if (tab === "Experience") {
        document.getElementById("experience-about").classList.remove("hidden");
        document.getElementById("education-about").classList.add("hidden");
        document.getElementById("contact-about").classList.add("hidden");
      } else if (tab === "Education") {
        document.getElementById("experience-about").classList.add("hidden");
        document.getElementById("education-about").classList.remove("hidden");
        document.getElementById("contact-about").classList.add("hidden");
      } else if (tab === "Contact") {
        document.getElementById("experience-about").classList.add("hidden");
        document.getElementById("education-about").classList.add("hidden");
        document.getElementById("contact-about").classList.remove("hidden");
      }
    }
  }, {
    key: "updateDetail",
    value: function updateDetail(id) {
      if (id.includes("portfolio")) {
        var d;
        var detailContent = "";
        this.contentData[0].forEach(function (p) {
          if (p.id === id.replace("portfolio-", "")) d = p;
        });
        detailContent += "<h1 class=\"mt-3 px-6\">".concat(d.title, "</h1>\n                <h3 class=\"m-3 px-6\">").concat(d.desc, "</h3>\n                <hr class=\"mt-3 mb-1\">\n                <div class=\"detail-badges\">\n                    <h3 class=\"").concat(function (field) {
          if (field === "UX") return "text-success";else if (field === "Web") return "text-danger";else if (field === "Design") return "text-warning";
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
        detailContent += "</div>       \n                </div>\n                <div class=\"media-control mb-4\">\n                    <button id=\"media-left-btn\" class=\"btn btn-l btn-dark mx-1\"><i class=\"fas fa-chevron-left\"></i></button>\n                    <h3 id=\"gallery-counter\">1 / ".concat(d.content.media.length, "</h3>\n                    <button id=\"media-right-btn\" class=\"btn btn-l btn-dark mx-1\"><i class=\"fas fa-chevron-right\"></i></button>\n                </div>\n                <h4 class=\"detail-content px-5 mb-2\">").concat(d.content.detail, "</h4><br> \n                <div class=\"cta-panel cta-danger challenges-panel\">\n                    <h3><i class=\"fas fa-mountain\"></i></h3>\n                    <h3 class=\"p-2\">Challenges</h3>\n                </div>\n                <div class=\"list-content\">");
        d.content.challenges.forEach(function (c) {
          detailContent += "<h4>".concat(c.challenge, "</h4>");
        });
        detailContent += "</div>\n                <div class=\"cta-panel tools-panel\">\n                    <h3><i class=\"fas fa-tools\"></i></h3>\n                    <h3 class=\"p-2\">Tools</h3>\n                </div>\n                <div class=\"list-content\">";
        d.content.tools.forEach(function (t) {
          detailContent += "<h4>".concat(t.tool, "</h4>");
        });
        detailContent += "</div>\n                <div class=\"height-filler\"></div>";
        this.detailElem.innerHTML = detailContent;
        document.querySelector(".media-container>div:first-child").classList.add("active");
        var mediaBtns = Array.from(document.querySelector(".media-control").children);
        mediaBtns[0].addEventListener("click", function (e) {
          var current = document.querySelector(".media-container .active");

          if (current.previousElementSibling) {
            current.classList.remove("active");
            current.previousElementSibling.classList.add("active");
          } else {
            current.classList.remove("active");
            current.parentElement.lastChild.classList.add("active");
          }

          document.getElementById("gallery-counter").innerText = "".concat(document.querySelector(".media-container .active").id.replace("media-", ""), " / ").concat(d.content.media.length);
        });
        mediaBtns[2].addEventListener("click", function (e) {
          var current = document.querySelector(".media-container .active");

          if (current.nextElementSibling) {
            current.classList.remove("active");
            current.nextElementSibling.classList.add("active");
          } else {
            current.classList.remove("active");
            current.parentElement.firstChild.classList.add("active");
          }

          document.getElementById("gallery-counter").innerText = "".concat(document.querySelector(".media-container .active").id.replace("media-", ""), " / ").concat(d.content.media.length);
        });
      } else if (id.includes("adventure")) {
        var _d;

        var _detailContent = "";
        this.contentData[1].forEach(function (adv) {
          if (adv.id === id.replace("adventure-", "")) _d = adv;
        });
        _detailContent += "<h1 class=\"mt-3 px-4\">".concat(_d.title, "</h1>\n                <h3 class=\"m-2 px-4\">").concat(_d.desc, "</h3>\n                <hr class=\"mt-1 mb-1\">\n                <h3 class=\"mb-4 text-danger\">").concat(_d.month, "</h3> \n                <div class=\"detail-gallery\">\n                    <div class=\"media-container\">");
        var _tempCounter = 1;

        _d.diary.media.forEach(function (m) {
          if (m.type === "image") {
            _detailContent += "<div id=\"media-".concat(_tempCounter, "\" class=\"media-image\" style=\"background-image: url(./images/").concat(m.link, ")\"></div>");
          } else if (m.type === "video") {
            _detailContent += "<div id=\"media-".concat(_tempCounter, "\" class=\"media-video\"><iframe src=\"").concat(m.link, "\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe></div>");
          }

          _tempCounter++;
        });

        _detailContent += "</div>\n                </div>\n                <div class=\"media-control mb-4\">\n                    <button id=\"media-left-btn\" class=\"btn btn-l btn-dark mx-1\"><i class=\"fas fa-chevron-left\"></i></button>\n                    <h3 id=\"gallery-counter\">1 / ".concat(_d.diary.media.length, "</h3>\n                    <button id=\"media-right-btn\" class=\"btn btn-l btn-dark mx-1\"><i class=\"fas fa-chevron-right\"></i></button>\n                </div>\n                <h4 class=\"detail-content p-3\">").concat(_d.diary.text, "</h4><br> \n                <div class=\"height-filler\"></div>");
        this.detailElem.innerHTML = _detailContent;
        document.querySelector(".media-container>div:first-child").classList.add("active");

        var _mediaBtns = Array.from(document.querySelector(".media-control").children);

        _mediaBtns[0].addEventListener("click", function (e) {
          var current = document.querySelector(".media-container .active");

          if (current.previousElementSibling) {
            current.classList.remove("active");
            current.previousElementSibling.classList.add("active");
          } else {
            current.classList.remove("active");
            current.parentElement.lastChild.classList.add("active");
          }

          document.getElementById("gallery-counter").innerText = "".concat(document.querySelector(".media-container .active").id.replace("media-", ""), " / ").concat(_d.diary.media.length);
        });

        _mediaBtns[1].addEventListener("click", function (e) {
          var current = document.querySelector(".media-container .active");

          if (current.nextElementSibling) {
            current.classList.remove("active");
            current.nextElementSibling.classList.add("active");
          } else {
            current.classList.remove("active");
            current.parentElement.firstChild.classList.add("active");
          }

          document.getElementById("gallery-counter").innerText = "".concat(document.querySelector(".media-container .active").id.replace("media-", ""), " / ").concat(_d.diary.media.length);
        });
      } else if (id.includes("experience")) {
        var _d2;

        var _detailContent2 = "";
        this.contentData[3].forEach(function (exp) {
          if (exp.id === id.replace("experience-", "")) _d2 = exp;
        });
        _detailContent2 += "<h1 class=\"mt-3 px-4\">".concat(_d2.title, "</h1>\n                <h3 class=\"m-3 px-4\">").concat(_d2.role, "</h3>\n                <hr class=\"mt-1 mb-1\">\n                <h3 class=\"m-2\">").concat(_d2.months.replace("-", " - "), "</h3>\n                <h3 class=\"m-1 text-danger\"><i class=\"fas fa-map-marker-alt\"></i>&nbsp;").concat(_d2.location, "</h3>\n                <h4 class=\"detail-content p-3 mt-2\">").concat(_d2.detail, "</h4><br> \n                <div class=\"cta-panel key-learning-panel\">\n                    <h3><i class=\"fas fa-key\"></i></h3>\n                    <h3 class=\"p-2\">Key Learning</h3>\n                </div>\n                <h3 id=\"key-learning\">").concat(_d2.gain, "</h3>\n                <div class=\"height-filler\"></div>");
        this.detailElem.innerHTML = _detailContent2;
      } else if (id.includes("education")) {
        var _d3;

        var _detailContent3 = "";
        this.contentData[4].forEach(function (edu) {
          if (edu.id === id.replace("education-", "")) _d3 = edu;
        });
        _detailContent3 += "<h1 class=\"mt-3 px-4\">".concat(_d3.deg, "</h1>\n                <h3 class=\"m-3 px-4\">").concat(_d3.uni, "</h3>\n                <hr class=\"mt-1 mb-1\">\n                <h3 class=\"m-2\">").concat(_d3.year, "</h3>\n                <h3 class=\"m-2 text-warning\"><i class=\"fas fa-award\"></i>&nbsp;").concat(_d3.honour, "</h3>\n                <h4 class=\"detail-content p-3 mt-2\"><span class=\"text-danger\">Key Modules:&nbsp;</span>").concat(_d3.modules, "</h4><br> \n                <div class=\"cta-panel dissertation-panel\">\n                    <h3><i class=\"fas fa-book\"></i></h3>\n                    <h3 class=\"p-2\">Dissertation</h3>\n                </div>\n                <h4 id=\"dissertation\">").concat(_d3.disser, "</h4>\n                <div class=\"height-filler\"></div>");
        this.detailElem.innerHTML = _detailContent3;
      }
    }
  }, {
    key: "updateToolkit",
    value: function updateToolkit(id) {
      var d;
      var toolkitContent = "";

      if (id === "ux-screen") {
        d = this.contentData[6][0];
      } else if (id === "web-screen") {} else if (id === "business-screen") {}

      toolkitContent += "";
      this.toolkitElem.innerHTML = toolkitContent;
    }
  }]);
  return ContentManager;
}();

exports.default = ContentManager;
},{"@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js"}],"js/router.js":[function(require,module,exports) {
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

var Router =
/*#__PURE__*/
function () {
  function Router(routes) {
    (0, _classCallCheck2.default)(this, Router);
    //Set routes
    this.routes = routes; //Grab output & control elements

    this.viewElem = document.querySelector(".view");
    this.supViewElem = document.querySelector(".sup-view");
    this.detailViewElem = document.querySelector(".detail-view");
    this.toolkitViewElem = document.querySelector(".toolkit-view");
    this.navElem = document.querySelector(".nav"); //Setup content manager & declare empty variables for content data

    this.contentManager = new _ContentManager.default();
    this.contentData = [];
  } //Assign a listener to hashchange & run hasChanged initially to load default route


  (0, _createClass2.default)(Router, [{
    key: "init",
    value: function init() {
      var _this = this;

      var r = this.routes;
      this.renderViews(r);
      window.addEventListener("hashchange", function (e) {
        _this.hasChanged(r);
      });
      this.navElem.addEventListener("animationend", function (e) {
        _this.navElem.classList.remove("fade");
      });
    } //Setup all the selector & item buttons' actions

  }, {
    key: "initButtons",
    value: function initButtons() {
      var _this2 = this;

      this.portfolioBtns = document.querySelector(".portfolio-selector-items");
      this.logsBtns = document.querySelector(".logs-selector-items");
      this.aboutBtns = document.querySelector(".about-selector-items");
      this.toggleBtns = document.querySelectorAll(".toggle-btn");
      this.detailBtns = document.querySelectorAll(".detail-btn");
      Array.from(this.portfolioBtns.children).forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          _this2.contentManager.updatePortfolio(e.target.id);

          _this2.updateScrollCard(document.getElementById("portfolio-card"));

          Array.from(_this2.portfolioBtns.children).forEach(function (btn) {
            if (btn.classList.contains("selected")) btn.classList.remove("selected");
          });
          e.target.classList.add("selected");
        });
      });
      Array.from(this.logsBtns.children).forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          _this2.contentManager.updateLogs(e.target.id);

          _this2.updateScrollCard(document.getElementById("logs-card"));

          Array.from(_this2.logsBtns.children).forEach(function (btn) {
            if (btn.classList.contains("selected")) btn.classList.remove("selected");
          });
          e.target.classList.add("selected");
        });
      });
      Array.from(this.aboutBtns.children).forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          _this2.contentManager.updateAbout(e.target.id);

          _this2.updateScrollCard(document.getElementById("about-card"));

          Array.from(_this2.aboutBtns.children).forEach(function (btn) {
            if (btn.classList.contains("selected")) btn.classList.remove("selected");
          });
          e.target.classList.add("selected");
        });
      });
      this.toggleBtns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          var outputElem = document.getElementById(e.target.id.replace("-btn", "")); //outputElem.style.maxHeight = outputElem.scrollHeight;

          if (outputElem.classList.contains("hidden")) {
            outputElem.classList.remove("hidden");
            e.target.classList.add("toggled");
          } else {
            outputElem.classList.add("hidden");
            e.target.classList.remove("toggled");
          }

          _this2.updateScrollCard(document.getElementById("logs-card"));
        });
      });
      this.detailBtns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          _this2.showDetail(e.target.id);
        });
      });
      document.querySelector(".back-btn.detail-btn").addEventListener("click", function (e) {
        _this2.hideDetail();
      });
      document.querySelector(".back-btn.toolkit-btn").addEventListener("click", function (e) {
        _this2.hideToolkit();

        _this2.viewElem.classList.remove("disabled");
      });
      document.getElementById("ux-screen").addEventListener("click", function (e) {
        _this2.showToolkit(e.target.id);

        _this2.viewElem.classList.add("disabled");
      });
      document.getElementById("web-screen").addEventListener("click", function (e) {
        _this2.showToolkit(e.target.id);

        _this2.viewElem.classList.add("disabled");
      });
      document.getElementById("business-screen").addEventListener("click", function (e) {
        _this2.showToolkit(e.target.id);

        _this2.viewElem.classList.add("disabled");
      });
    } //Update all scrollable card elements

  }, {
    key: "initScrollCard",
    value: function initScrollCard() {
      var _this3 = this;

      var cardLists = document.querySelectorAll(".card-list");
      cardLists.forEach(function (list) {
        list.addEventListener("scroll", function (e) {
          _this3.updateScrollCard(e.target);
        });
        console.log(list);

        _this3.updateScrollCard(list);
      });
    } //Update all scrollable card elements

  }, {
    key: "updateScrollCard",
    value: function updateScrollCard(list) {
      console.log("Scroll Height: ".concat(list.scrollHeight, ", & Client Height: ").concat(list.clientHeight));

      if (list.scrollHeight > list.clientHeight) {
        if (list.scrollTop === 0) {
          list.parentElement.parentElement.classList.add("no-scroll-shadow-top");
          list.parentElement.parentElement.classList.remove("no-scroll-shadow-bottom");
        } else if (list.scrollTop !== 0 && list.scrollTop + list.clientHeight < list.scrollHeight) {
          list.parentElement.parentElement.classList.remove("no-scroll-shadow-top");
          list.parentElement.parentElement.classList.remove("no-scroll-shadow-bottom");
        } else {
          list.parentElement.parentElement.classList.remove("no-scroll-shadow-top");
          list.parentElement.parentElement.classList.add("no-scroll-shadow-bottom");
        }
      } else {
        list.parentElement.parentElement.classList.add("no-scroll-shadow-top");
        list.parentElement.parentElement.classList.add("no-scroll-shadow-bottom");
      }
    }
  }, {
    key: "renderViews",
    value: function renderViews(r) {
      var _this4 = this;

      var orderedRoutes = r.sort(function (a, b) {
        return a.viewPos - b.viewPos;
      });
      var fetchArray = [];
      orderedRoutes.forEach(
      /*#__PURE__*/
      function () {
        var _ref = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee(route) {
          return _regenerator.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (Math.sign(route.viewPos) !== -1) {
                    fetchArray.push(fetch("views/".concat(route.htmlName)).then(function (res) {
                      return res.text();
                    }).then(function (data) {
                      _this4.viewElem.innerHTML += data;
                    }));
                  } else {
                    fetchArray.push(fetch("views/".concat(route.htmlName)).then(function (res) {
                      return res.text();
                    }).then(function (data) {
                      _this4.supViewElem.innerHTML += data;
                    }));
                  }

                case 1:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
      Promise.all(fetchArray).then(function () {
        (0, _generateBG.default)();

        _this4.contentManager.initContent();

        _this4.hasChanged(r);

        Promise.all(_this4.contentManager.fetchArray).then(function () {
          _this4.initButtons();

          _this4.initScrollCard();
        });
      });
    }
  }, {
    key: "hasChanged",
    value: function hasChanged(r) {
      if (window.location.hash.replace("#", "") !== "about") {
        if (window.location.hash.length > 0) {
          for (var i = 0, length = r.length; i < length; i++) {
            var route = r[i];

            if (route.isActiveRoute(window.location.hash.replace("#", ""))) {
              console.log(route.htmlName);
              this.updateView(route);
            }
          }
        } else {
          for (var _i = 0, _length = r.length; _i < _length; _i++) {
            var _route = r[_i];
            if (_route.defaultRoute) this.updateView(_route);
            console.log(_route.htmlName);
          }
        }
      } else {
        this.showAbout();
      }
    }
  }, {
    key: "updateView",
    value: function updateView(r) {
      if (!document.querySelector(".sup-view-active")) {
        console.log("In for others");
        var viewClasses = this.viewElem.classList;

        if (viewClasses[1] !== "view-".concat(r.viewPos)) {
          viewClasses.replace(viewClasses[1], "view-".concat(r.viewPos));
        }

        if (!viewClasses.contains("animate")) viewClasses.add("animate");
      } else {
        console.log("Wrong");
        document.querySelector(".sup-view-active").classList.remove("sup-view-active");
        this.supViewElem.classList.remove("roll-in");
        this.viewElem.classList.remove("disabled");
      }

      (0, _updateNav.default)(r.htmlName);
    }
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
      console.log("showAbout");
    }
  }, {
    key: "showDetail",
    value: function showDetail(id) {
      this.contentManager.updateDetail(id);
      this.detailViewElem.classList.add("pop-up");
      this.navElem.classList.add("hidden");
    }
  }, {
    key: "hideDetail",
    value: function hideDetail() {
      this.detailViewElem.classList.remove("pop-up");
      this.navElem.classList.remove("hidden");
    }
  }, {
    key: "showToolkit",
    value: function showToolkit(id) {
      this.contentManager.updateToolkit(id);
      this.toolkitViewElem.classList.add("pop-up");
      this.navElem.classList.add("hidden");
    }
  }, {
    key: "hideToolkit",
    value: function hideToolkit() {
      this.toolkitViewElem.classList.remove("pop-up");
      this.navElem.classList.remove("hidden");
    }
  }]);
  return Router;
}();

exports.default = Router;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","./generateBG":"js/generateBG.js","./updateNav":"js/updateNav.js","./ContentManager":"js/ContentManager.js"}],"js/route.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Route =
/*#__PURE__*/
function () {
  function Route(name, htmlName, viewPos, defaultRoute) {
    _classCallCheck(this, Route);

    this.name = name;
    this.viewPos = viewPos;
    this.htmlName = htmlName;
    this.defaultRoute = defaultRoute;
  } //Self checking for activeness


  _createClass(Route, [{
    key: "isActiveRoute",
    value: function isActiveRoute(hashedPath) {
      return hashedPath.replace("#", "") === this.name;
    }
  }]);

  return Route;
}();

exports.default = Route;
},{}],"index.js":[function(require,module,exports) {
"use strict";

require("./scss/style.scss");

var _router = _interopRequireDefault(require("./js/router"));

var _route = _interopRequireDefault(require("./js/route"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _router.default([new _route.default("desk", "desk.html", 2, true), new _route.default("about", "about.html", -1), new _route.default("portfolio", "portfolio.html", 3), new _route.default("logs", "logs.html", 1)]);
router.init();
},{"./scss/style.scss":"scss/style.scss","./js/router":"js/router.js","./js/route":"js/route.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53366" + '/');

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