"format global";
(function(global) {

  var defined = {};

  // indexOf polyfill for IE8
  var indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++)
      if (this[i] === item)
        return i;
    return -1;
  }

  var getOwnPropertyDescriptor = true;
  try {
    Object.getOwnPropertyDescriptor({ a: 0 }, 'a');
  }
  catch(e) {
    getOwnPropertyDescriptor = false;
  }

  var defineProperty;
  (function () {
    try {
      if (!!Object.defineProperty({}, 'a', {}))
        defineProperty = Object.defineProperty;
    }
    catch (e) {
      defineProperty = function(obj, prop, opt) {
        try {
          obj[prop] = opt.value || opt.get.call(obj);
        }
        catch(e) {}
      }
    }
  })();

  function register(name, deps, declare) {
    if (arguments.length === 4)
      return registerDynamic.apply(this, arguments);
    doRegister(name, {
      declarative: true,
      deps: deps,
      declare: declare
    });
  }

  function registerDynamic(name, deps, executingRequire, execute) {
    doRegister(name, {
      declarative: false,
      deps: deps,
      executingRequire: executingRequire,
      execute: execute
    });
  }

  function doRegister(name, entry) {
    entry.name = name;

    // we never overwrite an existing define
    if (!(name in defined))
      defined[name] = entry;

    // we have to normalize dependencies
    // (assume dependencies are normalized for now)
    // entry.normalizedDeps = entry.deps.map(normalize);
    entry.normalizedDeps = entry.deps;
  }


  function buildGroups(entry, groups) {
    groups[entry.groupIndex] = groups[entry.groupIndex] || [];

    if (indexOf.call(groups[entry.groupIndex], entry) != -1)
      return;

    groups[entry.groupIndex].push(entry);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];

      // not in the registry means already linked / ES6
      if (!depEntry || depEntry.evaluated)
        continue;

      // now we know the entry is in our unlinked linkage group
      var depGroupIndex = entry.groupIndex + (depEntry.declarative != entry.declarative);

      // the group index of an entry is always the maximum
      if (depEntry.groupIndex === undefined || depEntry.groupIndex < depGroupIndex) {

        // if already in a group, remove from the old group
        if (depEntry.groupIndex !== undefined) {
          groups[depEntry.groupIndex].splice(indexOf.call(groups[depEntry.groupIndex], depEntry), 1);

          // if the old group is empty, then we have a mixed depndency cycle
          if (groups[depEntry.groupIndex].length == 0)
            throw new TypeError("Mixed dependency cycle detected");
        }

        depEntry.groupIndex = depGroupIndex;
      }

      buildGroups(depEntry, groups);
    }
  }

  function link(name) {
    var startEntry = defined[name];

    startEntry.groupIndex = 0;

    var groups = [];

    buildGroups(startEntry, groups);

    var curGroupDeclarative = !!startEntry.declarative == groups.length % 2;
    for (var i = groups.length - 1; i >= 0; i--) {
      var group = groups[i];
      for (var j = 0; j < group.length; j++) {
        var entry = group[j];

        // link each group
        if (curGroupDeclarative)
          linkDeclarativeModule(entry);
        else
          linkDynamicModule(entry);
      }
      curGroupDeclarative = !curGroupDeclarative; 
    }
  }

  // module binding records
  var moduleRecords = {};
  function getOrCreateModuleRecord(name) {
    return moduleRecords[name] || (moduleRecords[name] = {
      name: name,
      dependencies: [],
      exports: {}, // start from an empty module and extend
      importers: []
    })
  }

  function linkDeclarativeModule(entry) {
    // only link if already not already started linking (stops at circular)
    if (entry.module)
      return;

    var module = entry.module = getOrCreateModuleRecord(entry.name);
    var exports = entry.module.exports;

    var declaration = entry.declare.call(global, function(name, value) {
      module.locked = true;

      if (typeof name == 'object') {
        for (var p in name)
          exports[p] = name[p];
      }
      else {
        exports[name] = value;
      }

      for (var i = 0, l = module.importers.length; i < l; i++) {
        var importerModule = module.importers[i];
        if (!importerModule.locked) {
          for (var j = 0; j < importerModule.dependencies.length; ++j) {
            if (importerModule.dependencies[j] === module) {
              importerModule.setters[j](exports);
            }
          }
        }
      }

      module.locked = false;
      return value;
    });

    module.setters = declaration.setters;
    module.execute = declaration.execute;

    // now link all the module dependencies
    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];
      var depModule = moduleRecords[depName];

      // work out how to set depExports based on scenarios...
      var depExports;

      if (depModule) {
        depExports = depModule.exports;
      }
      else if (depEntry && !depEntry.declarative) {
        depExports = depEntry.esModule;
      }
      // in the module registry
      else if (!depEntry) {
        depExports = load(depName);
      }
      // we have an entry -> link
      else {
        linkDeclarativeModule(depEntry);
        depModule = depEntry.module;
        depExports = depModule.exports;
      }

      // only declarative modules have dynamic bindings
      if (depModule && depModule.importers) {
        depModule.importers.push(module);
        module.dependencies.push(depModule);
      }
      else
        module.dependencies.push(null);

      // run the setter for this dependency
      if (module.setters[i])
        module.setters[i](depExports);
    }
  }

  // An analog to loader.get covering execution of all three layers (real declarative, simulated declarative, simulated dynamic)
  function getModule(name) {
    var exports;
    var entry = defined[name];

    if (!entry) {
      exports = load(name);
      if (!exports)
        throw new Error("Unable to load dependency " + name + ".");
    }

    else {
      if (entry.declarative)
        ensureEvaluated(name, []);

      else if (!entry.evaluated)
        linkDynamicModule(entry);

      exports = entry.module.exports;
    }

    if ((!entry || entry.declarative) && exports && exports.__useDefault)
      return exports['default'];

    return exports;
  }

  function linkDynamicModule(entry) {
    if (entry.module)
      return;

    var exports = {};

    var module = entry.module = { exports: exports, id: entry.name };

    // AMD requires execute the tree first
    if (!entry.executingRequire) {
      for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
        var depName = entry.normalizedDeps[i];
        var depEntry = defined[depName];
        if (depEntry)
          linkDynamicModule(depEntry);
      }
    }

    // now execute
    entry.evaluated = true;
    var output = entry.execute.call(global, function(name) {
      for (var i = 0, l = entry.deps.length; i < l; i++) {
        if (entry.deps[i] != name)
          continue;
        return getModule(entry.normalizedDeps[i]);
      }
      throw new TypeError('Module ' + name + ' not declared as a dependency.');
    }, exports, module);

    if (output)
      module.exports = output;

    // create the esModule object, which allows ES6 named imports of dynamics
    exports = module.exports;
 
    if (exports && exports.__esModule) {
      entry.esModule = exports;
    }
    else {
      entry.esModule = {};
      
      // don't trigger getters/setters in environments that support them
      if ((typeof exports == 'object' || typeof exports == 'function') && exports !== global) {
        if (getOwnPropertyDescriptor) {
          var d;
          for (var p in exports)
            if (d = Object.getOwnPropertyDescriptor(exports, p))
              defineProperty(entry.esModule, p, d);
        }
        else {
          var hasOwnProperty = exports && exports.hasOwnProperty;
          for (var p in exports) {
            if (!hasOwnProperty || exports.hasOwnProperty(p))
              entry.esModule[p] = exports[p];
          }
         }
       }
      entry.esModule['default'] = exports;
      defineProperty(entry.esModule, '__useDefault', {
        value: true
      });
    }
  }

  /*
   * Given a module, and the list of modules for this current branch,
   *  ensure that each of the dependencies of this module is evaluated
   *  (unless one is a circular dependency already in the list of seen
   *  modules, in which case we execute it)
   *
   * Then we evaluate the module itself depth-first left to right 
   * execution to match ES6 modules
   */
  function ensureEvaluated(moduleName, seen) {
    var entry = defined[moduleName];

    // if already seen, that means it's an already-evaluated non circular dependency
    if (!entry || entry.evaluated || !entry.declarative)
      return;

    // this only applies to declarative modules which late-execute

    seen.push(moduleName);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      if (indexOf.call(seen, depName) == -1) {
        if (!defined[depName])
          load(depName);
        else
          ensureEvaluated(depName, seen);
      }
    }

    if (entry.evaluated)
      return;

    entry.evaluated = true;
    entry.module.execute.call(global);
  }

  // magical execution function
  var modules = {};
  function load(name) {
    if (modules[name])
      return modules[name];

    // node core modules
    if (name.substr(0, 6) == '@node/')
      return require(name.substr(6));

    var entry = defined[name];

    // first we check if this module has already been defined in the registry
    if (!entry)
      throw "Module " + name + " not present.";

    // recursively ensure that the module and all its 
    // dependencies are linked (with dependency group handling)
    link(name);

    // now handle dependency execution in correct order
    ensureEvaluated(name, []);

    // remove from the registry
    defined[name] = undefined;

    // exported modules get __esModule defined for interop
    if (entry.declarative)
      defineProperty(entry.module.exports, '__esModule', { value: true });

    // return the defined module object
    return modules[name] = entry.declarative ? entry.module.exports : entry.esModule;
  };

  return function(mains, depNames, declare) {
    return function(formatDetect) {
      formatDetect(function(deps) {
        var System = {
          _nodeRequire: typeof require != 'undefined' && require.resolve && typeof process != 'undefined' && require,
          register: register,
          registerDynamic: registerDynamic,
          get: load, 
          set: function(name, module) {
            modules[name] = module; 
          },
          newModule: function(module) {
            return module;
          }
        };
        System.set('@empty', {});

        // register external dependencies
        for (var i = 0; i < depNames.length; i++) (function(depName, dep) {
          if (dep && dep.__esModule)
            System.register(depName, [], function(_export) {
              return {
                setters: [],
                execute: function() {
                  for (var p in dep)
                    if (p != '__esModule' && !(typeof p == 'object' && p + '' == 'Module'))
                      _export(p, dep[p]);
                }
              };
            });
          else
            System.registerDynamic(depName, [], false, function() {
              return dep;
            });
        })(depNames[i], arguments[i]);

        // register modules in this bundle
        declare(System);

        // load mains
        var firstLoad = load(mains[0]);
        if (mains.length > 1)
          for (var i = 1; i < mains.length; i++)
            load(mains[i]);

        if (firstLoad.__useDefault)
          return firstLoad['default'];
        else
          return firstLoad;
      });
    };
  };

})(typeof self != 'undefined' ? self : global)
/* (['mainModule'], ['external-dep'], function($__System) {
  System.register(...);
})
(function(factory) {
  if (typeof define && define.amd)
    define(['external-dep'], factory);
  // etc UMD / module pattern
})*/

(['1'], [], function($__System) {

(function(__global) {
  var loader = $__System;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++)
      if (this[i] === item)
        return i;
    return -1;
  }

  function readMemberExpression(p, value) {
    var pParts = p.split('.');
    while (pParts.length)
      value = value[pParts.shift()];
    return value;
  }

  // bare minimum ignores for IE8
  var ignoredGlobalProps = ['_g', 'sessionStorage', 'localStorage', 'clipboardData', 'frames', 'external', 'mozAnimationStartTime', 'webkitStorageInfo', 'webkitIndexedDB'];

  var globalSnapshot;

  function forEachGlobal(callback) {
    if (Object.keys)
      Object.keys(__global).forEach(callback);
    else
      for (var g in __global) {
        if (!hasOwnProperty.call(__global, g))
          continue;
        callback(g);
      }
  }

  function forEachGlobalValue(callback) {
    forEachGlobal(function(globalName) {
      if (indexOf.call(ignoredGlobalProps, globalName) != -1)
        return;
      try {
        var value = __global[globalName];
      }
      catch (e) {
        ignoredGlobalProps.push(globalName);
      }
      callback(globalName, value);
    });
  }

  loader.set('@@global-helpers', loader.newModule({
    prepareGlobal: function(moduleName, exportName, globals) {
      // disable module detection
      var curDefine = __global.define;
       
      __global.define = undefined;
      __global.exports = undefined;
      if (__global.module && __global.module.exports)
        __global.module = undefined;

      // set globals
      var oldGlobals;
      if (globals) {
        oldGlobals = {};
        for (var g in globals) {
          oldGlobals[g] = globals[g];
          __global[g] = globals[g];
        }
      }

      // store a complete copy of the global object in order to detect changes
      if (!exportName) {
        globalSnapshot = {};

        forEachGlobalValue(function(name, value) {
          globalSnapshot[name] = value;
        });
      }

      // return function to retrieve global
      return function() {
        var globalValue;

        if (exportName) {
          globalValue = readMemberExpression(exportName, __global);
        }
        else {
          var singleGlobal;
          var multipleExports;
          var exports = {};

          forEachGlobalValue(function(name, value) {
            if (globalSnapshot[name] === value)
              return;
            if (typeof value == 'undefined')
              return;
            exports[name] = value;

            if (typeof singleGlobal != 'undefined') {
              if (!multipleExports && singleGlobal !== value)
                multipleExports = true;
            }
            else {
              singleGlobal = value;
            }
          });
          globalValue = multipleExports ? exports : singleGlobal;
        }

        // revert globals
        if (oldGlobals) {
          for (var g in oldGlobals)
            __global[g] = oldGlobals[g];
        }
        __global.define = curDefine;

        return globalValue;
      };
    }
  }));

})(typeof self != 'undefined' ? self : global);

$__System.register("2", [], function (_export) {
  "use strict";

  var chance;
  return {
    setters: [],
    execute: function () {
      chance = function chance(p) {
        var attempt = Math.random();
        return attempt < p;
      };

      _export("default", chance);
    }
  };
});

$__System.register("3", [], function (_export) {
  "use strict";

  var random;
  return {
    setters: [],
    execute: function () {
      random = function random(a, b) {
        switch (arguments.length) {
          case 0:
            return Math.random();
          case 1:
            return Math.random() * a;
          case 2:
            return Math.random() * (b - a) + a;
        }
      };

      _export("default", random);
    }
  };
});

$__System.registerDynamic("4", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("5", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(it) {
    if (typeof it != 'function')
      throw TypeError(it + ' is not a function!');
    return it;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("6", ["5"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var aFunction = $__require('5');
  module.exports = function(fn, that, length) {
    aFunction(fn);
    if (that === undefined)
      return fn;
    switch (length) {
      case 1:
        return function(a) {
          return fn.call(that, a);
        };
      case 2:
        return function(a, b) {
          return fn.call(that, a, b);
        };
      case 3:
        return function(a, b, c) {
          return fn.call(that, a, b, c);
        };
    }
    return function() {
      return fn.apply(that, arguments);
    };
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("7", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var core = module.exports = {version: '1.2.6'};
  if (typeof __e == 'number')
    __e = core;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("8", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
  if (typeof __g == 'number')
    __g = global;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("9", ["8", "7", "6"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var global = $__require('8'),
      core = $__require('7'),
      ctx = $__require('6'),
      PROTOTYPE = 'prototype';
  var $export = function(type, name, source) {
    var IS_FORCED = type & $export.F,
        IS_GLOBAL = type & $export.G,
        IS_STATIC = type & $export.S,
        IS_PROTO = type & $export.P,
        IS_BIND = type & $export.B,
        IS_WRAP = type & $export.W,
        exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
        target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
        key,
        own,
        out;
    if (IS_GLOBAL)
      source = name;
    for (key in source) {
      own = !IS_FORCED && target && key in target;
      if (own && key in exports)
        continue;
      out = own ? target[key] : source[key];
      exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key] : IS_BIND && own ? ctx(out, global) : IS_WRAP && target[key] == out ? (function(C) {
        var F = function(param) {
          return this instanceof C ? new C(param) : C(param);
        };
        F[PROTOTYPE] = C[PROTOTYPE];
        return F;
      })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
      if (IS_PROTO)
        (exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
    }
  };
  $export.F = 1;
  $export.G = 2;
  $export.S = 4;
  $export.P = 8;
  $export.B = 16;
  $export.W = 32;
  module.exports = $export;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("a", ["9", "7", "4"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $export = $__require('9'),
      core = $__require('7'),
      fails = $__require('4');
  module.exports = function(KEY, exec) {
    var fn = (core.Object || {})[KEY] || Object[KEY],
        exp = {};
    exp[KEY] = exec(fn);
    $export($export.S + $export.F * fails(function() {
      fn(1);
    }), 'Object', exp);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("b", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(it) {
    if (it == undefined)
      throw TypeError("Can't call method on  " + it);
    return it;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("c", ["b"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var defined = $__require('b');
  module.exports = function(it) {
    return Object(defined(it));
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("d", ["c", "a"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var toObject = $__require('c');
  $__require('a')('keys', function($keys) {
    return function keys(it) {
      return $keys(toObject(it));
    };
  });
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("e", ["d", "7"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  $__require('d');
  module.exports = $__require('7').Object.keys;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("f", ["e"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": $__require('e'),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.register("10", ["f"], function (_export) {
  var _Object$keys, _samples, sampleLibrary;

  return {
    setters: [function (_f) {
      _Object$keys = _f["default"];
    }],
    execute: function () {
      "use strict";

      _samples = {};
      sampleLibrary = {};

      sampleLibrary.get = function (name) {
        return _samples[name];
      };
      sampleLibrary.set = function (name, sample) {
        _samples[name] = sample;
      };
      sampleLibrary.list = function () {
        return _Object$keys(_samples);
      };
      // TODO: deprecate
      sampleLibrary.dump = function () {
        return _samples;
      };

      _export("default", sampleLibrary);
    }
  };
});

$__System.register('11', ['12'], function (_export) {
  'use strict';

  var ctx, time;

  function getContextCurrentTime() {
    return ctx.currentTime;
  }

  return {
    setters: [function (_) {
      ctx = _['default'];
    }],
    execute: function () {
      time = {};

      time.now = getContextCurrentTime;

      time['in'] = function (offsetSeconds) {
        return getContextCurrentTime() + offsetSeconds;
      };

      // identity, kinda useless
      time.seconds = function (t) {
        return t;
      };

      time.ms = function (seconds) {
        return seconds / 1000;
      };
      time.samp = function (samples) {
        return samples / ctx.sampleRate;
      };

      _export('default', time);
    }
  };
});

$__System.register('13', ['11', '12', '14'], function (_export) {
  'use strict';

  var time, ctx, BlipNode, envelopeFactory;
  return {
    setters: [function (_2) {
      time = _2['default'];
    }, function (_) {
      ctx = _['default'];
    }, function (_3) {
      BlipNode = _3['default'];
    }],
    execute: function () {
      envelopeFactory = function envelopeFactory() {
        var attack = 0,
            decay = 0,
            sustain = 0.8,
            release = 0;

        var gain = ctx.createGain();

        // wrap the GainNode, giving it BlipNode methods
        var envelope = BlipNode.fromAudioNode(gain);

        // initialize the gain at 0
        envelope.param('gain', 0);

        // ADSR setter/getters
        envelope.attack = function (a) {
          if (!arguments.length) return attack;
          attack = a;
          return envelope;
        };
        envelope.decay = function (d) {
          if (!arguments.length) return decay;
          decay = d;
          return envelope;
        };
        envelope.sustain = function (s) {
          if (!arguments.length) return sustain;
          sustain = s;
          return envelope;
        };
        envelope.release = function (r) {
          if (!arguments.length) return release;
          release = r;
          return envelope;
        };
        envelope.noteOn = function (t) {
          t = typeof t === 'number' ? t : time.now();
          envelope.param('gain', function () {
            this.cancelScheduledValues(t);
            this.setValueAtTime(0, t);
            this.linearRampToValueAtTime(1, t + attack);
            this.setTargetAtTime(sustain, t + attack, decay * 0.368);
            this.setValueAtTime(sustain, t + attack + decay);
          });
          return envelope;
        };
        envelope.noteOff = function (t) {
          t = typeof t === 'number' ? t : time.now();
          envelope.param('gain', function () {
            this.cancelScheduledValues(t);
            //this.setValueAtTime(sustain, t);
            this.setTargetAtTime(0, t, release * 0.368);
            this.setValueAtTime(0, t + release);
          });
          return envelope;
        };
        envelope.play = function (t, dur) {
          envelope.noteOn(t);
          envelope.noteOff(t + dur);
          return envelope;
        };

        return envelope;
      };

      _export('default', envelopeFactory);
    }
  };
});

$__System.register('15', ['12'], function (_export) {
  'use strict';

  var ctx, loopFactory;
  return {
    setters: [function (_) {
      ctx = _['default'];
    }],
    execute: function () {
      loopFactory = function loopFactory() {
        var lookahead = 25.0,
            // ms
        scheduleAheadTime = 0.1; // s

        var tempo = undefined; // ticks per minute

        var tickInterval = undefined; // seconds per tick

        var data = [];

        var currentTick = 0,
            nextTickTime = 0;

        var tick = function tick(t, d, i) {};
        var each = function each(t, i) {};

        var iterations = 0,
            limit = 0;

        var timer = undefined;

        var loop = {};

        function nextTick() {
          nextTickTime += tickInterval;

          // cycle through ticks
          if (++currentTick >= data.length) {
            currentTick = 0;
            iterations += 1;
          }
        }

        function scheduleTick(tickNum, time) {
          tick.call(loop, time, data[tickNum], tickNum);
        }

        function scheduleIteration(iterationNum, time) {
          each.call(loop, time, iterationNum);
        }

        function scheduler() {
          while (nextTickTime < ctx.currentTime + scheduleAheadTime) {
            scheduleTick(currentTick, nextTickTime);
            if (currentTick === 0) {
              scheduleIteration(iterations, nextTickTime);
            }
            nextTick();
            if (limit && iterations >= limit) {
              loop.reset();
              return;
            }
          }
          timer = window.setTimeout(scheduler, lookahead);
        }

        loop.tempo = function (bpm) {
          if (!arguments.length) return tempo;
          tempo = bpm;
          tickInterval = 60 / tempo;
          return loop;
        };
        loop.tickInterval = function (s) {
          if (!arguments.length) return tickInterval;
          tickInterval = s;
          tempo = 60 / tickInterval;
          return loop;
        };
        loop.data = function (a) {
          if (!arguments.length) return data;
          data = a;
          return loop;
        };
        loop.lookahead = function (ms) {
          if (!arguments.length) return lookahead;
          lookahead = ms;
          return loop;
        };
        loop.scheduleAheadTime = function (s) {
          if (!arguments.length) return scheduleAheadTime;
          scheduleAheadTime = s;
          return loop;
        };
        loop.limit = function (n) {
          if (!arguments.length) return limit;
          limit = n;
          return loop;
        };
        loop.tick = function (f) {
          if (!arguments.length) return tick;
          tick = f;
          return loop;
        };
        loop.each = function (f) {
          if (!arguments.length) return each;
          each = f;
          return loop;
        };
        loop.start = function (t) {
          nextTickTime = t || ctx.currentTime;
          scheduler();
          return loop;
        };
        loop.stop = function () {
          window.clearTimeout(timer);
          return loop;
        };
        loop.reset = function () {
          currentTick = 0;
          iterations = 0;
          return loop;
        };

        return loop;
      };
    }
  };
});

$__System.register("16", [], function (_export) {
  "use strict";

  var chainFactory;
  return {
    setters: [],
    execute: function () {
      chainFactory = function chainFactory(nodes) {
        nodes = nodes || [];

        wire();

        function wire() {
          for (var i = 0; i < nodes.length - 1; i++) {
            nodes[i].connect(nodes[i + 1]);
          }
        }

        var chain = {};

        chain.node = function (blipnode) {
          nodes.push(blipnode);
          wire();
          return chain;
        };
        chain.start = function () {
          var a = nodes.slice(0, 1);
          return a.length ? a[0] : null;
        };
        chain.end = function () {
          var a = nodes.slice(-1);
          return a.length ? a[0] : null;
        };
        chain.from = function (blipnode) {
          blipnode.connect(chain.start());
          return chain;
        };
        chain.to = function (blipnode) {
          chain.end().connect(blipnode);
          return chain;
        };
        chain.wire = function () {
          wire();
          return chain;
        };

        return chain;
      };

      _export("default", chainFactory);
    }
  };
});

$__System.register('17', ['12', '14', '18'], function (_export) {
  'use strict';

  var ctx, BlipNode, destination, clipFactory;
  return {
    setters: [function (_) {
      ctx = _['default'];
    }, function (_3) {
      BlipNode = _3['default'];
    }, function (_2) {
      destination = _2['default'];
    }],
    execute: function () {
      clipFactory = function clipFactory() {
        var sample = undefined,
            rate = 1,
            gain = 1;

        var chain = null;

        var outputGain = BlipNode.create('gain').connect(destination);

        var clip = {};

        clip.sample = function (name) {
          if (!arguments.length) return sample;
          sample = loadedSamples[name];
          return clip;
        };
        clip.rate = function (number) {
          if (!arguments.length) return rate;
          rate = number;
          return clip;
        };
        clip.gain = function (number) {
          if (!arguments.length) return gain;
          gain = number;
          return clip;
        };
        clip.chain = function (c) {
          if (!arguments.length) return chain;
          chain = c;
          outputGain.disconnect(destination);
          chain.from(outputGain).to(destination);
          return clip;
        };
        clip.play = function (time, params) {
          time = time || 0;
          var source = ctx.createBufferSource();
          source.buffer = sample;

          if (params) {
            if (typeof params.gain !== 'undefined') {
              if (typeof params.gain === 'function') {
                outputGain.param('gain', params.gain);
              } else {
                outputGain.param('gain', function () {
                  this.setValueAtTime(params.gain, time);
                });
              }
            } else {
              outputGain.param('gain', params.gain);
            }
            if (typeof params.rate !== 'undefined') {
              if (typeof params.rate === 'function') {
                BlipNode.prototype.param.call(BlipNode.fromAudioNode(source), 'playbackRate', params.rate);
              } else {
                source.playbackRate.setValueAtTime(params.rate, time);
              }
            } else {
              BlipNode.prototype.param.call(BlipNode.fromAudioNode(source), 'playbackRate', rate);
            }
          } else {
            if (gain !== 1) outputGain.param('gain', gain);
            if (rate !== 1) BlipNode.prototype.param.call(BlipNode.fromAudioNode(source), 'playbackRate', rate);
          }

          source.connect(outputGain.node());
          source.start(time);
        };
      };

      _export('default', clipFactory);
    }
  };
});

$__System.register("19", [], function (_export) {
  "use strict";

  function BlipNodeCollection(nodes) {
    this.nodes = nodes || [];
  }

  return {
    setters: [],
    execute: function () {
      BlipNodeCollection.prototype = {

        count: function count() {
          return this.nodes.length;
        },

        each: function each(f) {
          for (var i = 0; i < this.nodes.length; i++) {
            f.call(this, this.nodes[i], i, this.nodes);
          }
        },

        contains: function contains(node) {
          for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i] === node) return true;
          }
          return false;
        },

        add: function add(node) {
          if (this.nodes.indexOf(node) === -1) this.nodes.push(node);
        },

        remove: function remove(node) {
          var index = this.nodes.indexOf(node);
          if (index !== -1) this.nodes.splice(index, 1);
        },

        removeAll: function removeAll() {
          this.nodes = [];
        }

      };

      _export("default", BlipNodeCollection);
    }
  };
});

$__System.register("1a", [], function (_export) {
  /**
   * Generates a GUID string.
   * @returns {String} The generated GUID.
   * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
   * @author Slavik Meltser (slavik@meltser.info).
   * @link http://slavik.meltser.info/?p=142
   */
  "use strict";

  function guid() {
    function _p8(s) {
      var p = (Math.random().toString(16) + "000000000").substr(2, 8);
      return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
  }

  return {
    setters: [],
    execute: function () {
      _export("default", guid);
    }
  };
});

$__System.register('14', ['12', '19', '1a'], function (_export) {

  // the associated functions will be used by the `createNode` function within `blip.node`
  'use strict';

  var ctx, BlipNodeCollection, guid, NODE_TYPES;
  // alias

  function BlipNode() {
    this.inputs = new BlipNodeCollection();
    this.outputs = new BlipNodeCollection();
    return this;
  }return {
    setters: [function (_) {
      ctx = _['default'];
    }, function (_2) {
      BlipNodeCollection = _2['default'];
    }, function (_a) {
      guid = _a['default'];
    }],
    execute: function () {
      NODE_TYPES = {
        'gain': ctx.createGain,
        'delay': ctx.createDelay,
        'panner': ctx.createPanner,
        'convolver': ctx.createConvolver,
        'analyser': ctx.createAnalyser,
        'channelSplitter': ctx.createChannelSplitter,
        'channelMerger': ctx.createChannelMerger,
        'dynamicsCompressor': ctx.createDynamicsCompressor,
        'biquadFilter': ctx.createBiquadFilter,
        'waveShaper': ctx.createWaveShaper,
        'oscillator': ctx.createOscillator,
        'periodicWave': ctx.createPeriodicWave,
        'bufferSource': ctx.createBufferSource,
        'audioBufferSource': ctx.createBufferSource };
      ;

      BlipNode.prototype.connect = function (blipnode) {
        if (this.node().numberOfOutputs > 0 && blipnode.node().numberOfInputs > 0) {
          this.node().connect(blipnode.node());
          this.outputs.add(blipnode);
          blipnode.inputs.add(this);
        }
        return this;
      };

      BlipNode.prototype.disconnect = function (blipnode) {
        // disconnect all
        this.node().disconnect();

        var me = this;

        if (blipnode) {
          this.outputs.remove(blipnode);
          blipnode.inputs.remove(this);

          // reconnect to remaining outputs
          this.outputs.each(function (n) {
            this.connect(n);
          });
        } else {
          this.outputs.each(function (n) {
            n.inputs.remove(me);
          });
          this.outputs.removeAll();
        }

        return this;
      };

      BlipNode.prototype.prop = function (name, value) {
        if (arguments.length < 2) {
          if (typeof name === 'object') {
            for (var p in name) {
              this.node()[p] = name[p];
            }
            return this;
          } else {
            return this.node()[name];
          }
        }
        this.node()[name] = value;
        return this;
      };

      BlipNode.prototype.param = function (name, f) {
        if (arguments.length < 2) return this.node()[name];
        if (typeof f !== 'function') {
          this.node()[name].value = f;
        } else {
          f.call(this.node()[name]);
        }
        return this;
      };

      BlipNode.prototype.start = function (t) {
        this.node().start.call(this.node(), t);
      };

      BlipNode.prototype.stop = function (t) {
        this.node().stop.call(this.node(), t);
      };

      BlipNode.prototype.node = function () {
        return this.node();
      };

      BlipNode.prototype.toString = function () {
        return '[object BlipNode]';
      };

      BlipNode.prototype.valueOf = function () {
        return this.id();
      };

      BlipNode.prototype.call = function (methodName) {
        var args = Array.prototype.slice.call(arguments, 1);
        var node = this.node();
        if (typeof node[methodName] !== 'function') return;
        node[methodName].apply(node, args);
      };

      // wrap an existing AudioNode as a BlipNode
      BlipNode.fromAudioNode = function (ref) {
        var node = new BlipNode();
        var id = guid();
        node.node = function () {
          return ref;
        };
        node.id = function () {
          return id;
        };
        return node;
      };

      BlipNode.create = function (type) {
        var restParams = Array.prototype.slice.call(arguments, 1);
        var ref = createNode(type);
        var id = guid();

        var node = new BlipNode();

        function createNode(t) {
          return NODE_TYPES[t].apply(ctx, restParams);
        }

        node.node = function () {
          return ref;
        };
        node.id = function () {
          return id;
        };
        return node;
      };

      _export('default', BlipNode);
    }
  };
});

$__System.register('18', ['12', '14'], function (_export) {
  'use strict';

  var ctx, BlipNode, destination;
  return {
    setters: [function (_) {
      ctx = _['default'];
    }, function (_2) {
      BlipNode = _2['default'];
    }],
    execute: function () {
      destination = BlipNode.fromAudioNode(ctx.destination);

      _export('default', destination);
    }
  };
});

$__System.registerDynamic("1b", [], false, function(__require, __exports, __module) {
  var _retrieveGlobal = $__System.get("@@global-helpers").prepareGlobal(__module.id, null, null);
  (function() {
    (function(global, exports, perf) {
      'use strict';
      function fixSetTarget(param) {
        if (!param)
          return;
        if (!param.setTargetAtTime)
          param.setTargetAtTime = param.setTargetValueAtTime;
      }
      if (window.hasOwnProperty('webkitAudioContext') && !window.hasOwnProperty('AudioContext')) {
        window.AudioContext = webkitAudioContext;
        if (!AudioContext.prototype.hasOwnProperty('createGain'))
          AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
        if (!AudioContext.prototype.hasOwnProperty('createDelay'))
          AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
        if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor'))
          AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
        if (!AudioContext.prototype.hasOwnProperty('createPeriodicWave'))
          AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable;
        AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain;
        AudioContext.prototype.createGain = function() {
          var node = this.internal_createGain();
          fixSetTarget(node.gain);
          return node;
        };
        AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay;
        AudioContext.prototype.createDelay = function(maxDelayTime) {
          var node = maxDelayTime ? this.internal_createDelay(maxDelayTime) : this.internal_createDelay();
          fixSetTarget(node.delayTime);
          return node;
        };
        AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource;
        AudioContext.prototype.createBufferSource = function() {
          var node = this.internal_createBufferSource();
          if (!node.start) {
            node.start = function(when, offset, duration) {
              if (offset || duration)
                this.noteGrainOn(when, offset, duration);
              else
                this.noteOn(when);
            };
          }
          if (!node.stop)
            node.stop = node.noteOff;
          fixSetTarget(node.playbackRate);
          return node;
        };
        AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor;
        AudioContext.prototype.createDynamicsCompressor = function() {
          var node = this.internal_createDynamicsCompressor();
          fixSetTarget(node.threshold);
          fixSetTarget(node.knee);
          fixSetTarget(node.ratio);
          fixSetTarget(node.reduction);
          fixSetTarget(node.attack);
          fixSetTarget(node.release);
          return node;
        };
        AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter;
        AudioContext.prototype.createBiquadFilter = function() {
          var node = this.internal_createBiquadFilter();
          fixSetTarget(node.frequency);
          fixSetTarget(node.detune);
          fixSetTarget(node.Q);
          fixSetTarget(node.gain);
          return node;
        };
        if (AudioContext.prototype.hasOwnProperty('createOscillator')) {
          AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator;
          AudioContext.prototype.createOscillator = function() {
            var node = this.internal_createOscillator();
            if (!node.start)
              node.start = node.noteOn;
            if (!node.stop)
              node.stop = node.noteOff;
            if (!node.setPeriodicWave)
              node.setPeriodicWave = node.setWaveTable;
            fixSetTarget(node.frequency);
            fixSetTarget(node.detune);
            return node;
          };
        }
      }
    }(window));
  })();
  return _retrieveGlobal();
});

$__System.register('12', ['1b'], function (_export) {
  'use strict';

  var ctx;
  return {
    setters: [function (_b) {}],
    execute: function () {
      ctx = new AudioContext();

      _export('default', ctx);
    }
  };
});

$__System.register('1c', ['2', '3', '10', '11', '12', '13', '14', '15', '16', '17', '18'], function (_export) {

  // public api
  'use strict';

  var chance, random, sampleLibrary, time, ctx, envelopeFactory, BlipNode, loopFactory, chainFactory, clipFactory, destination, blip;
  return {
    setters: [function (_11) {
      chance = _11['default'];
    }, function (_10) {
      random = _10['default'];
    }, function (_8) {
      sampleLibrary = _8['default'];
    }, function (_9) {
      time = _9['default'];
    }, function (_) {
      ctx = _['default'];
    }, function (_7) {
      envelopeFactory = _7['default'];
    }, function (_3) {
      BlipNode = _3['default'];
    }, function (_6) {
      loopFactory = _6['default'];
    }, function (_5) {
      chainFactory = _5['default'];
    }, function (_4) {
      clipFactory = _4['default'];
    }, function (_2) {
      destination = _2['default'];
    }],
    execute: function () {
      blip = {};

      blip.version = '0.4.0';

      blip.time = time;
      blip.random = random;
      blip.chance = chance;

      blip.node = BlipNode.create;

      blip.clip = clipFactory;
      blip.chain = chainFactory;
      blip.loop = loopFactory;
      blip.envelope = envelopeFactory;

      blip.destination = destination;
      blip.listener = BlipNode.fromAudioNode(ctx.listener);

      blip.getContext = function () {
        return ctx;
      };

      // TODO: deprecate
      blip.getLoadedSamples = sampleLibrary.dump;
      blip.sample = sampleLibrary.get;

      _export('default', blip);
    }
  };
});

$__System.register('1', ['1c'], function (_export) {
  'use strict';

  var blip;
  return {
    setters: [function (_c) {
      blip = _c['default'];
    }],
    execute: function () {

      window.blip = blip;
    }
  };
});

})
(function(factory) {
  factory();
});