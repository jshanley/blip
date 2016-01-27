!function(e){function r(e,r,o){return 4===arguments.length?t.apply(this,arguments):void n(e,{declarative:!0,deps:r,declare:o})}function t(e,r,t,o){n(e,{declarative:!1,deps:r,executingRequire:t,execute:o})}function n(e,r){r.name=e,e in p||(p[e]=r),r.normalizedDeps=r.deps}function o(e,r){if(r[e.groupIndex]=r[e.groupIndex]||[],-1==v.call(r[e.groupIndex],e)){r[e.groupIndex].push(e);for(var t=0,n=e.normalizedDeps.length;n>t;t++){var a=e.normalizedDeps[t],u=p[a];if(u&&!u.evaluated){var d=e.groupIndex+(u.declarative!=e.declarative);if(void 0===u.groupIndex||u.groupIndex<d){if(void 0!==u.groupIndex&&(r[u.groupIndex].splice(v.call(r[u.groupIndex],u),1),0==r[u.groupIndex].length))throw new TypeError("Mixed dependency cycle detected");u.groupIndex=d}o(u,r)}}}}function a(e){var r=p[e];r.groupIndex=0;var t=[];o(r,t);for(var n=!!r.declarative==t.length%2,a=t.length-1;a>=0;a--){for(var u=t[a],i=0;i<u.length;i++){var s=u[i];n?d(s):l(s)}n=!n}}function u(e){return x[e]||(x[e]={name:e,dependencies:[],exports:{},importers:[]})}function d(r){if(!r.module){var t=r.module=u(r.name),n=r.module.exports,o=r.declare.call(e,function(e,r){if(t.locked=!0,"object"==typeof e)for(var o in e)n[o]=e[o];else n[e]=r;for(var a=0,u=t.importers.length;u>a;a++){var d=t.importers[a];if(!d.locked)for(var i=0;i<d.dependencies.length;++i)d.dependencies[i]===t&&d.setters[i](n)}return t.locked=!1,r},r.name);t.setters=o.setters,t.execute=o.execute;for(var a=0,i=r.normalizedDeps.length;i>a;a++){var l,s=r.normalizedDeps[a],c=p[s],v=x[s];v?l=v.exports:c&&!c.declarative?l=c.esModule:c?(d(c),v=c.module,l=v.exports):l=f(s),v&&v.importers?(v.importers.push(t),t.dependencies.push(v)):t.dependencies.push(null),t.setters[a]&&t.setters[a](l)}}}function i(e){var r,t=p[e];if(t)t.declarative?c(e,[]):t.evaluated||l(t),r=t.module.exports;else if(r=f(e),!r)throw new Error("Unable to load dependency "+e+".");return(!t||t.declarative)&&r&&r.__useDefault?r["default"]:r}function l(r){if(!r.module){var t={},n=r.module={exports:t,id:r.name};if(!r.executingRequire)for(var o=0,a=r.normalizedDeps.length;a>o;o++){var u=r.normalizedDeps[o],d=p[u];d&&l(d)}r.evaluated=!0;var c=r.execute.call(e,function(e){for(var t=0,n=r.deps.length;n>t;t++)if(r.deps[t]==e)return i(r.normalizedDeps[t]);throw new TypeError("Module "+e+" not declared as a dependency.")},t,n);c&&(n.exports=c),t=n.exports,t&&t.__esModule?r.esModule=t:r.esModule=s(t)}}function s(r){if(r===e)return r;var t={};if("object"==typeof r||"function"==typeof r)if(g){var n;for(var o in r)(n=Object.getOwnPropertyDescriptor(r,o))&&h(t,o,n)}else{var a=r&&r.hasOwnProperty;for(var o in r)(!a||r.hasOwnProperty(o))&&(t[o]=r[o])}return t["default"]=r,h(t,"__useDefault",{value:!0}),t}function c(r,t){var n=p[r];if(n&&!n.evaluated&&n.declarative){t.push(r);for(var o=0,a=n.normalizedDeps.length;a>o;o++){var u=n.normalizedDeps[o];-1==v.call(t,u)&&(p[u]?c(u,t):f(u))}n.evaluated||(n.evaluated=!0,n.module.execute.call(e))}}function f(e){if(D[e])return D[e];if("@node/"==e.substr(0,6))return y(e.substr(6));var r=p[e];if(!r)throw"Module "+e+" not present.";return a(e),c(e,[]),p[e]=void 0,r.declarative&&h(r.module.exports,"__esModule",{value:!0}),D[e]=r.declarative?r.module.exports:r.esModule}var p={},v=Array.prototype.indexOf||function(e){for(var r=0,t=this.length;t>r;r++)if(this[r]===e)return r;return-1},g=!0;try{Object.getOwnPropertyDescriptor({a:0},"a")}catch(m){g=!1}var h;!function(){try{Object.defineProperty({},"a",{})&&(h=Object.defineProperty)}catch(e){h=function(e,r,t){try{e[r]=t.value||t.get.call(e)}catch(n){}}}}();var x={},y="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&require.resolve&&"undefined"!=typeof process&&require,D={"@empty":{}};return function(e,n,o){return function(a){a(function(a){for(var u={_nodeRequire:y,register:r,registerDynamic:t,get:f,set:function(e,r){D[e]=r},newModule:function(e){return e}},d=0;d<n.length;d++)(function(e,r){r&&r.__esModule?D[e]=r:D[e]=s(r)})(n[d],arguments[d]);o(u);var i=f(e[0]);if(e.length>1)for(var d=1;d<e.length;d++)f(e[d]);return i.__useDefault?i["default"]:i})}}}("undefined"!=typeof self?self:global)

(["1"], [], function($__System) {

!function(e){function n(e,n){for(var t=e.split(".");t.length;)n=n[t.shift()];return n}function t(n){if(Object.keys)Object.keys(e).forEach(n);else for(var t in e)f.call(e,t)&&n(t)}function r(n){t(function(t){if(-1==a.call(l,t)){try{var r=e[t]}catch(o){l.push(t)}n(t,r)}})}var o,i=$__System,f=Object.prototype.hasOwnProperty,a=Array.prototype.indexOf||function(e){for(var n=0,t=this.length;t>n;n++)if(this[n]===e)return n;return-1},l=["_g","sessionStorage","localStorage","clipboardData","frames","frameElement","external","mozAnimationStartTime","webkitStorageInfo","webkitIndexedDB"];i.set("@@global-helpers",i.newModule({prepareGlobal:function(t,i,f){var a=e.define;e.define=void 0,e.exports=void 0,e.module&&e.module.exports&&(e.module=void 0);var l;if(f){l={};for(var u in f)l[u]=e[u],e[u]=f[u]}return i||(o={},r(function(e,n){o[e]=n})),function(){var t;if(i)t=n(i,e);else{var f,u,s={};r(function(e,n){o[e]!==n&&"undefined"!=typeof n&&(s[e]=n,"undefined"!=typeof f?u||f===n||(u=!0):f=n)}),t=u?s:f}if(l)for(var c in l)e[c]=l[c];return e.define=a,t}}}))}("undefined"!=typeof self?self:global);
!function(){var t=$__System;if("undefined"!=typeof window&&"undefined"!=typeof document&&window.location)var s=location.protocol+"//"+location.hostname+(location.port?":"+location.port:"");t.set("@@cjs-helpers",t.newModule({getPathVars:function(t){var n,o=t.lastIndexOf("!");n=-1!=o?t.substr(0,o):t;var e=n.split("/");return e.pop(),e=e.join("/"),"file:///"==n.substr(0,8)?(n=n.substr(7),e=e.substr(7),isWindows&&(n=n.substr(1),e=e.substr(1))):s&&n.substr(0,s.length)===s&&(n=n.substr(s.length),e=e.substr(s.length)),{filename:n,dirname:e}}}))}();
$__System.register('2', ['3', '4'], function (_export) {
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

$__System.register('5', ['2', '3', '4', '6'], function (_export) {
  'use strict';

  var destination, ctx, BlipNode, sampleLibrary, clipFactory;
  return {
    setters: [function (_2) {
      destination = _2['default'];
    }, function (_) {
      ctx = _['default'];
    }, function (_3) {
      BlipNode = _3['default'];
    }, function (_4) {
      sampleLibrary = _4['default'];
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
          sample = sampleLibrary.get(name);
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
          outputGain.param('gain', gain);
          return clip;
        };
        clip.chain = function (c) {
          if (!arguments.length) return chain;
          chain = c;
          outputGain.disconnect(destination);
          chain.from(outputGain).to(destination);
          return clip;
        };
        clip.play = function (time, sourceAccessor) {
          time = time || 0;
          var source = ctx.createBufferSource();
          source.buffer = sample;
          source.playbackRate.value = clip.rate();
          if (typeof sourceAccessor === 'function') {
            sourceAccessor.call(clip, source);
          }
          source.connect(outputGain.node());
          source.start(time);
        };
        return clip;
      };

      _export('default', clipFactory);
    }
  };
});

$__System.register("7", [], function (_export) {
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

$__System.register('8', ['3'], function (_export) {
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

      _export('default', loopFactory);
    }
  };
});

$__System.register("9", [], function (_export) {
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

$__System.register("a", [], function (_export) {
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

$__System.register('4', ['3', '9', 'a'], function (_export) {

  // the associated functions will be used by the `createNode` function within `blip.node`
  'use strict';

  var ctx, guid, BlipNodeCollection, NODE_TYPES;
  // alias

  function BlipNode() {
    this.inputs = new BlipNodeCollection();
    this.outputs = new BlipNodeCollection();
    return this;
  }return {
    setters: [function (_) {
      ctx = _['default'];
    }, function (_2) {
      guid = _2['default'];
    }, function (_a) {
      BlipNodeCollection = _a['default'];
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

$__System.register('b', ['3', '4', 'c'], function (_export) {
  'use strict';

  var ctx, BlipNode, time, envelopeFactory;
  return {
    setters: [function (_) {
      ctx = _['default'];
    }, function (_2) {
      BlipNode = _2['default'];
    }, function (_c) {
      time = _c['default'];
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

$__System.registerDynamic("d", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  "format cjs";
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("e", ["f", "10"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var toInteger = $__require('f'),
      defined = $__require('10');
  module.exports = function(TO_STRING) {
    return function(that, pos) {
      var s = String(defined(that)),
          i = toInteger(pos),
          l = s.length,
          a,
          b;
      if (i < 0 || i >= l)
        return TO_STRING ? '' : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("11", ["e", "12"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $at = $__require('e')(true);
  $__require('12')(String, 'String', function(iterated) {
    this._t = String(iterated);
    this._i = 0;
  }, function() {
    var O = this._t,
        index = this._i,
        point;
    if (index >= O.length)
      return {
        value: undefined,
        done: true
      };
    point = $at(O, index);
    this._i += point.length;
    return {
      value: point,
      done: false
    };
  });
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("13", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function() {};
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("14", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(done, value) {
    return {
      value: value,
      done: !!done
    };
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("15", ["16"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var cof = $__require('16');
  module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it) {
    return cof(it) == 'String' ? it.split('') : Object(it);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("17", ["15", "10"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var IObject = $__require('15'),
      defined = $__require('10');
  module.exports = function(it) {
    return IObject(defined(it));
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("18", ["19", "1a", "1b", "1c", "1d"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = $__require('19'),
      descriptor = $__require('1a'),
      setToStringTag = $__require('1b'),
      IteratorPrototype = {};
  $__require('1c')(IteratorPrototype, $__require('1d')('iterator'), function() {
    return this;
  });
  module.exports = function(Constructor, NAME, next) {
    Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
    setToStringTag(Constructor, NAME + ' Iterator');
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("12", ["1e", "1f", "20", "1c", "21", "22", "18", "1b", "19", "1d"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var LIBRARY = $__require('1e'),
      $export = $__require('1f'),
      redefine = $__require('20'),
      hide = $__require('1c'),
      has = $__require('21'),
      Iterators = $__require('22'),
      $iterCreate = $__require('18'),
      setToStringTag = $__require('1b'),
      getProto = $__require('19').getProto,
      ITERATOR = $__require('1d')('iterator'),
      BUGGY = !([].keys && 'next' in [].keys()),
      FF_ITERATOR = '@@iterator',
      KEYS = 'keys',
      VALUES = 'values';
  var returnThis = function() {
    return this;
  };
  module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    $iterCreate(Constructor, NAME, next);
    var getMethod = function(kind) {
      if (!BUGGY && kind in proto)
        return proto[kind];
      switch (kind) {
        case KEYS:
          return function keys() {
            return new Constructor(this, kind);
          };
        case VALUES:
          return function values() {
            return new Constructor(this, kind);
          };
      }
      return function entries() {
        return new Constructor(this, kind);
      };
    };
    var TAG = NAME + ' Iterator',
        DEF_VALUES = DEFAULT == VALUES,
        VALUES_BUG = false,
        proto = Base.prototype,
        $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
        $default = $native || getMethod(DEFAULT),
        methods,
        key;
    if ($native) {
      var IteratorPrototype = getProto($default.call(new Base));
      setToStringTag(IteratorPrototype, TAG, true);
      if (!LIBRARY && has(proto, FF_ITERATOR))
        hide(IteratorPrototype, ITERATOR, returnThis);
      if (DEF_VALUES && $native.name !== VALUES) {
        VALUES_BUG = true;
        $default = function values() {
          return $native.call(this);
        };
      }
    }
    if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      hide(proto, ITERATOR, $default);
    }
    Iterators[NAME] = $default;
    Iterators[TAG] = returnThis;
    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: !DEF_VALUES ? $default : getMethod('entries')
      };
      if (FORCED)
        for (key in methods) {
          if (!(key in proto))
            redefine(proto, key, methods[key]);
        }
      else
        $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
    }
    return methods;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("23", ["13", "14", "22", "17", "12"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var addToUnscopables = $__require('13'),
      step = $__require('14'),
      Iterators = $__require('22'),
      toIObject = $__require('17');
  module.exports = $__require('12')(Array, 'Array', function(iterated, kind) {
    this._t = toIObject(iterated);
    this._i = 0;
    this._k = kind;
  }, function() {
    var O = this._t,
        kind = this._k,
        index = this._i++;
    if (!O || index >= O.length) {
      this._t = undefined;
      return step(1);
    }
    if (kind == 'keys')
      return step(0, index);
    if (kind == 'values')
      return step(0, O[index]);
    return step(0, [index, O[index]]);
  }, 'values');
  Iterators.Arguments = Iterators.Array;
  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("24", ["23", "22"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  $__require('23');
  var Iterators = $__require('22');
  Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("1e", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = true;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("25", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(it, Constructor, name) {
    if (!(it instanceof Constructor))
      throw TypeError(name + ": use the 'new' operator!");
    return it;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("26", ["27"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var anObject = $__require('27');
  module.exports = function(iterator, fn, value, entries) {
    try {
      return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    } catch (e) {
      var ret = iterator['return'];
      if (ret !== undefined)
        anObject(ret.call(iterator));
      throw e;
    }
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("28", ["22", "1d"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var Iterators = $__require('22'),
      ITERATOR = $__require('1d')('iterator'),
      ArrayProto = Array.prototype;
  module.exports = function(it) {
    return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("f", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var ceil = Math.ceil,
      floor = Math.floor;
  module.exports = function(it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("29", ["f"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var toInteger = $__require('f'),
      min = Math.min;
  module.exports = function(it) {
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("2a", ["16", "1d"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var cof = $__require('16'),
      TAG = $__require('1d')('toStringTag'),
      ARG = cof(function() {
        return arguments;
      }()) == 'Arguments';
  module.exports = function(it) {
    var O,
        T,
        B;
    return it === undefined ? 'Undefined' : it === null ? 'Null' : typeof(T = (O = Object(it))[TAG]) == 'string' ? T : ARG ? cof(O) : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("22", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {};
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("2b", ["2a", "1d", "22", "2c"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var classof = $__require('2a'),
      ITERATOR = $__require('1d')('iterator'),
      Iterators = $__require('22');
  module.exports = $__require('2c').getIteratorMethod = function(it) {
    if (it != undefined)
      return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("2d", ["2e", "26", "28", "27", "29", "2b"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var ctx = $__require('2e'),
      call = $__require('26'),
      isArrayIter = $__require('28'),
      anObject = $__require('27'),
      toLength = $__require('29'),
      getIterFn = $__require('2b');
  module.exports = function(iterable, entries, fn, that) {
    var iterFn = getIterFn(iterable),
        f = ctx(fn, that, entries ? 2 : 1),
        index = 0,
        length,
        step,
        iterator;
    if (typeof iterFn != 'function')
      throw TypeError(iterable + ' is not iterable!');
    if (isArrayIter(iterFn))
      for (length = toLength(iterable.length); length > index; index++) {
        entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
      }
    else
      for (iterator = iterFn.call(iterable); !(step = iterator.next()).done; ) {
        call(iterator, f, step.value, entries);
      }
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("2f", ["19", "30", "27", "2e"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var getDesc = $__require('19').getDesc,
      isObject = $__require('30'),
      anObject = $__require('27');
  var check = function(O, proto) {
    anObject(O);
    if (!isObject(proto) && proto !== null)
      throw TypeError(proto + ": can't set as prototype!");
  };
  module.exports = {
    set: Object.setPrototypeOf || ('__proto__' in {} ? function(test, buggy, set) {
      try {
        set = $__require('2e')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) {
        buggy = true;
      }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy)
          O.__proto__ = proto;
        else
          set(O, proto);
        return O;
      };
    }({}, false) : undefined),
    check: check
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("31", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = Object.is || function is(x, y) {
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("27", ["30"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var isObject = $__require('30');
  module.exports = function(it) {
    if (!isObject(it))
      throw TypeError(it + ' is not an object!');
    return it;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("32", ["27", "33", "1d"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var anObject = $__require('27'),
      aFunction = $__require('33'),
      SPECIES = $__require('1d')('species');
  module.exports = function(O, D) {
    var C = anObject(O).constructor,
        S;
    return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("34", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(fn, args, that) {
    var un = that === undefined;
    switch (args.length) {
      case 0:
        return un ? fn() : fn.call(that);
      case 1:
        return un ? fn(args[0]) : fn.call(that, args[0]);
      case 2:
        return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
      case 3:
        return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
      case 4:
        return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
    }
    return fn.apply(that, args);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("35", ["36"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('36').document && document.documentElement;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("30", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("37", ["30", "36"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var isObject = $__require('30'),
      document = $__require('36').document,
      is = isObject(document) && isObject(document.createElement);
  module.exports = function(it) {
    return is ? document.createElement(it) : {};
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("38", ["2e", "34", "35", "37", "36", "16", "39"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  (function(process) {
    var ctx = $__require('2e'),
        invoke = $__require('34'),
        html = $__require('35'),
        cel = $__require('37'),
        global = $__require('36'),
        process = global.process,
        setTask = global.setImmediate,
        clearTask = global.clearImmediate,
        MessageChannel = global.MessageChannel,
        counter = 0,
        queue = {},
        ONREADYSTATECHANGE = 'onreadystatechange',
        defer,
        channel,
        port;
    var run = function() {
      var id = +this;
      if (queue.hasOwnProperty(id)) {
        var fn = queue[id];
        delete queue[id];
        fn();
      }
    };
    var listner = function(event) {
      run.call(event.data);
    };
    if (!setTask || !clearTask) {
      setTask = function setImmediate(fn) {
        var args = [],
            i = 1;
        while (arguments.length > i)
          args.push(arguments[i++]);
        queue[++counter] = function() {
          invoke(typeof fn == 'function' ? fn : Function(fn), args);
        };
        defer(counter);
        return counter;
      };
      clearTask = function clearImmediate(id) {
        delete queue[id];
      };
      if ($__require('16')(process) == 'process') {
        defer = function(id) {
          process.nextTick(ctx(run, id, 1));
        };
      } else if (MessageChannel) {
        channel = new MessageChannel;
        port = channel.port2;
        channel.port1.onmessage = listner;
        defer = ctx(port.postMessage, port, 1);
      } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
        defer = function(id) {
          global.postMessage(id + '', '*');
        };
        global.addEventListener('message', listner, false);
      } else if (ONREADYSTATECHANGE in cel('script')) {
        defer = function(id) {
          html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function() {
            html.removeChild(this);
            run.call(id);
          };
        };
      } else {
        defer = function(id) {
          setTimeout(ctx(run, id, 1), 0);
        };
      }
    }
    module.exports = {
      set: setTask,
      clear: clearTask
    };
  })($__require('39'));
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("16", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var toString = {}.toString;
  module.exports = function(it) {
    return toString.call(it).slice(8, -1);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("3a", ["36", "38", "16", "39"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  (function(process) {
    var global = $__require('36'),
        macrotask = $__require('38').set,
        Observer = global.MutationObserver || global.WebKitMutationObserver,
        process = global.process,
        Promise = global.Promise,
        isNode = $__require('16')(process) == 'process',
        head,
        last,
        notify;
    var flush = function() {
      var parent,
          domain,
          fn;
      if (isNode && (parent = process.domain)) {
        process.domain = null;
        parent.exit();
      }
      while (head) {
        domain = head.domain;
        fn = head.fn;
        if (domain)
          domain.enter();
        fn();
        if (domain)
          domain.exit();
        head = head.next;
      }
      last = undefined;
      if (parent)
        parent.enter();
    };
    if (isNode) {
      notify = function() {
        process.nextTick(flush);
      };
    } else if (Observer) {
      var toggle = 1,
          node = document.createTextNode('');
      new Observer(flush).observe(node, {characterData: true});
      notify = function() {
        node.data = toggle = -toggle;
      };
    } else if (Promise && Promise.resolve) {
      notify = function() {
        Promise.resolve().then(flush);
      };
    } else {
      notify = function() {
        macrotask.call(global, flush);
      };
    }
    module.exports = function asap(fn) {
      var task = {
        fn: fn,
        next: undefined,
        domain: isNode && process.domain
      };
      if (last)
        last.next = task;
      if (!head) {
        head = task;
        notify();
      }
      last = task;
    };
  })($__require('39'));
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("1a", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("1c", ["19", "1a", "3b"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = $__require('19'),
      createDesc = $__require('1a');
  module.exports = $__require('3b') ? function(object, key, value) {
    return $.setDesc(object, key, createDesc(1, value));
  } : function(object, key, value) {
    object[key] = value;
    return object;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("20", ["1c"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('1c');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("3c", ["20"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var redefine = $__require('20');
  module.exports = function(target, src) {
    for (var key in src)
      redefine(target, key, src[key]);
    return target;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("21", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var hasOwnProperty = {}.hasOwnProperty;
  module.exports = function(it, key) {
    return hasOwnProperty.call(it, key);
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("1b", ["19", "21", "1d"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var def = $__require('19').setDesc,
      has = $__require('21'),
      TAG = $__require('1d')('toStringTag');
  module.exports = function(it, tag, stat) {
    if (it && !has(it = stat ? it : it.prototype, TAG))
      def(it, TAG, {
        configurable: true,
        value: tag
      });
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("19", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $Object = Object;
  module.exports = {
    create: $Object.create,
    getProto: $Object.getPrototypeOf,
    isEnum: {}.propertyIsEnumerable,
    getDesc: $Object.getOwnPropertyDescriptor,
    setDesc: $Object.defineProperty,
    setDescs: $Object.defineProperties,
    getKeys: $Object.keys,
    getNames: $Object.getOwnPropertyNames,
    getSymbols: $Object.getOwnPropertySymbols,
    each: [].forEach
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("3b", ["3d"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = !$__require('3d')(function() {
    return Object.defineProperty({}, 'a', {get: function() {
        return 7;
      }}).a != 7;
  });
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("3e", ["2c", "19", "3b", "1d"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var core = $__require('2c'),
      $ = $__require('19'),
      DESCRIPTORS = $__require('3b'),
      SPECIES = $__require('1d')('species');
  module.exports = function(KEY) {
    var C = core[KEY];
    if (DESCRIPTORS && C && !C[SPECIES])
      $.setDesc(C, SPECIES, {
        configurable: true,
        get: function() {
          return this;
        }
      });
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("3f", ["36"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var global = $__require('36'),
      SHARED = '__core-js_shared__',
      store = global[SHARED] || (global[SHARED] = {});
  module.exports = function(key) {
    return store[key] || (store[key] = {});
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("40", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var id = 0,
      px = Math.random();
  module.exports = function(key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("1d", ["3f", "40", "36"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var store = $__require('3f')('wks'),
      uid = $__require('40'),
      Symbol = $__require('36').Symbol;
  module.exports = function(name) {
    return store[name] || (store[name] = Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("41", ["1d"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var ITERATOR = $__require('1d')('iterator'),
      SAFE_CLOSING = false;
  try {
    var riter = [7][ITERATOR]();
    riter['return'] = function() {
      SAFE_CLOSING = true;
    };
    Array.from(riter, function() {
      throw 2;
    });
  } catch (e) {}
  module.exports = function(exec, skipClosing) {
    if (!skipClosing && !SAFE_CLOSING)
      return false;
    var safe = false;
    try {
      var arr = [7],
          iter = arr[ITERATOR]();
      iter.next = function() {
        safe = true;
      };
      arr[ITERATOR] = function() {
        return iter;
      };
      exec(arr);
    } catch (e) {}
    return safe;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("42", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var process = module.exports = {};
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;
  function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
      queue = currentQueue.concat(queue);
    } else {
      queueIndex = -1;
    }
    if (queue.length) {
      drainQueue();
    }
  }
  function drainQueue() {
    if (draining) {
      return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while (len) {
      currentQueue = queue;
      queue = [];
      while (++queueIndex < len) {
        if (currentQueue) {
          currentQueue[queueIndex].run();
        }
      }
      queueIndex = -1;
      len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
  }
  process.nextTick = function(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
      setTimeout(drainQueue, 0);
    }
  };
  function Item(fun, array) {
    this.fun = fun;
    this.array = array;
  }
  Item.prototype.run = function() {
    this.fun.apply(null, this.array);
  };
  process.title = 'browser';
  process.browser = true;
  process.env = {};
  process.argv = [];
  process.version = '';
  process.versions = {};
  function noop() {}
  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;
  process.binding = function(name) {
    throw new Error('process.binding is not supported');
  };
  process.cwd = function() {
    return '/';
  };
  process.chdir = function(dir) {
    throw new Error('process.chdir is not supported');
  };
  process.umask = function() {
    return 0;
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("43", ["42"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('42');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("44", ["43"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__System._nodeRequire ? process : $__require('43');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("39", ["44"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('44');
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("45", ["19", "1e", "36", "2e", "2a", "1f", "30", "27", "33", "25", "2d", "2f", "31", "1d", "32", "3a", "3b", "3c", "1b", "3e", "2c", "41", "39"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  (function(process) {
    'use strict';
    var $ = $__require('19'),
        LIBRARY = $__require('1e'),
        global = $__require('36'),
        ctx = $__require('2e'),
        classof = $__require('2a'),
        $export = $__require('1f'),
        isObject = $__require('30'),
        anObject = $__require('27'),
        aFunction = $__require('33'),
        strictNew = $__require('25'),
        forOf = $__require('2d'),
        setProto = $__require('2f').set,
        same = $__require('31'),
        SPECIES = $__require('1d')('species'),
        speciesConstructor = $__require('32'),
        asap = $__require('3a'),
        PROMISE = 'Promise',
        process = global.process,
        isNode = classof(process) == 'process',
        P = global[PROMISE],
        Wrapper;
    var testResolve = function(sub) {
      var test = new P(function() {});
      if (sub)
        test.constructor = Object;
      return P.resolve(test) === test;
    };
    var USE_NATIVE = function() {
      var works = false;
      function P2(x) {
        var self = new P(x);
        setProto(self, P2.prototype);
        return self;
      }
      try {
        works = P && P.resolve && testResolve();
        setProto(P2, P);
        P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
        if (!(P2.resolve(5).then(function() {}) instanceof P2)) {
          works = false;
        }
        if (works && $__require('3b')) {
          var thenableThenGotten = false;
          P.resolve($.setDesc({}, 'then', {get: function() {
              thenableThenGotten = true;
            }}));
          works = thenableThenGotten;
        }
      } catch (e) {
        works = false;
      }
      return works;
    }();
    var sameConstructor = function(a, b) {
      if (LIBRARY && a === P && b === Wrapper)
        return true;
      return same(a, b);
    };
    var getConstructor = function(C) {
      var S = anObject(C)[SPECIES];
      return S != undefined ? S : C;
    };
    var isThenable = function(it) {
      var then;
      return isObject(it) && typeof(then = it.then) == 'function' ? then : false;
    };
    var PromiseCapability = function(C) {
      var resolve,
          reject;
      this.promise = new C(function($$resolve, $$reject) {
        if (resolve !== undefined || reject !== undefined)
          throw TypeError('Bad Promise constructor');
        resolve = $$resolve;
        reject = $$reject;
      });
      this.resolve = aFunction(resolve), this.reject = aFunction(reject);
    };
    var perform = function(exec) {
      try {
        exec();
      } catch (e) {
        return {error: e};
      }
    };
    var notify = function(record, isReject) {
      if (record.n)
        return;
      record.n = true;
      var chain = record.c;
      asap(function() {
        var value = record.v,
            ok = record.s == 1,
            i = 0;
        var run = function(reaction) {
          var handler = ok ? reaction.ok : reaction.fail,
              resolve = reaction.resolve,
              reject = reaction.reject,
              result,
              then;
          try {
            if (handler) {
              if (!ok)
                record.h = true;
              result = handler === true ? value : handler(value);
              if (result === reaction.promise) {
                reject(TypeError('Promise-chain cycle'));
              } else if (then = isThenable(result)) {
                then.call(result, resolve, reject);
              } else
                resolve(result);
            } else
              reject(value);
          } catch (e) {
            reject(e);
          }
        };
        while (chain.length > i)
          run(chain[i++]);
        chain.length = 0;
        record.n = false;
        if (isReject)
          setTimeout(function() {
            var promise = record.p,
                handler,
                console;
            if (isUnhandled(promise)) {
              if (isNode) {
                process.emit('unhandledRejection', value, promise);
              } else if (handler = global.onunhandledrejection) {
                handler({
                  promise: promise,
                  reason: value
                });
              } else if ((console = global.console) && console.error) {
                console.error('Unhandled promise rejection', value);
              }
            }
            record.a = undefined;
          }, 1);
      });
    };
    var isUnhandled = function(promise) {
      var record = promise._d,
          chain = record.a || record.c,
          i = 0,
          reaction;
      if (record.h)
        return false;
      while (chain.length > i) {
        reaction = chain[i++];
        if (reaction.fail || !isUnhandled(reaction.promise))
          return false;
      }
      return true;
    };
    var $reject = function(value) {
      var record = this;
      if (record.d)
        return;
      record.d = true;
      record = record.r || record;
      record.v = value;
      record.s = 2;
      record.a = record.c.slice();
      notify(record, true);
    };
    var $resolve = function(value) {
      var record = this,
          then;
      if (record.d)
        return;
      record.d = true;
      record = record.r || record;
      try {
        if (record.p === value)
          throw TypeError("Promise can't be resolved itself");
        if (then = isThenable(value)) {
          asap(function() {
            var wrapper = {
              r: record,
              d: false
            };
            try {
              then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
            } catch (e) {
              $reject.call(wrapper, e);
            }
          });
        } else {
          record.v = value;
          record.s = 1;
          notify(record, false);
        }
      } catch (e) {
        $reject.call({
          r: record,
          d: false
        }, e);
      }
    };
    if (!USE_NATIVE) {
      P = function Promise(executor) {
        aFunction(executor);
        var record = this._d = {
          p: strictNew(this, P, PROMISE),
          c: [],
          a: undefined,
          s: 0,
          d: false,
          v: undefined,
          h: false,
          n: false
        };
        try {
          executor(ctx($resolve, record, 1), ctx($reject, record, 1));
        } catch (err) {
          $reject.call(record, err);
        }
      };
      $__require('3c')(P.prototype, {
        then: function then(onFulfilled, onRejected) {
          var reaction = new PromiseCapability(speciesConstructor(this, P)),
              promise = reaction.promise,
              record = this._d;
          reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
          reaction.fail = typeof onRejected == 'function' && onRejected;
          record.c.push(reaction);
          if (record.a)
            record.a.push(reaction);
          if (record.s)
            notify(record, false);
          return promise;
        },
        'catch': function(onRejected) {
          return this.then(undefined, onRejected);
        }
      });
    }
    $export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
    $__require('1b')(P, PROMISE);
    $__require('3e')(PROMISE);
    Wrapper = $__require('2c')[PROMISE];
    $export($export.S + $export.F * !USE_NATIVE, PROMISE, {reject: function reject(r) {
        var capability = new PromiseCapability(this),
            $$reject = capability.reject;
        $$reject(r);
        return capability.promise;
      }});
    $export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {resolve: function resolve(x) {
        if (x instanceof P && sameConstructor(x.constructor, this))
          return x;
        var capability = new PromiseCapability(this),
            $$resolve = capability.resolve;
        $$resolve(x);
        return capability.promise;
      }});
    $export($export.S + $export.F * !(USE_NATIVE && $__require('41')(function(iter) {
      P.all(iter)['catch'](function() {});
    })), PROMISE, {
      all: function all(iterable) {
        var C = getConstructor(this),
            capability = new PromiseCapability(C),
            resolve = capability.resolve,
            reject = capability.reject,
            values = [];
        var abrupt = perform(function() {
          forOf(iterable, false, values.push, values);
          var remaining = values.length,
              results = Array(remaining);
          if (remaining)
            $.each.call(values, function(promise, index) {
              var alreadyCalled = false;
              C.resolve(promise).then(function(value) {
                if (alreadyCalled)
                  return;
                alreadyCalled = true;
                results[index] = value;
                --remaining || resolve(results);
              }, reject);
            });
          else
            resolve(results);
        });
        if (abrupt)
          reject(abrupt.error);
        return capability.promise;
      },
      race: function race(iterable) {
        var C = getConstructor(this),
            capability = new PromiseCapability(C),
            reject = capability.reject;
        var abrupt = perform(function() {
          forOf(iterable, false, function(promise) {
            C.resolve(promise).then(capability.resolve, reject);
          });
        });
        if (abrupt)
          reject(abrupt.error);
        return capability.promise;
      }
    });
  })($__require('39'));
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("46", ["d", "11", "24", "45", "2c"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  $__require('d');
  $__require('11');
  $__require('24');
  $__require('45');
  module.exports = $__require('2c').Promise;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("47", ["46"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": $__require('46'),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("10", [], true, function($__require, exports, module) {
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

$__System.registerDynamic("48", ["10"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var defined = $__require('10');
  module.exports = function(it) {
    return Object(defined(it));
  };
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("36", [], true, function($__require, exports, module) {
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

$__System.registerDynamic("33", [], true, function($__require, exports, module) {
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

$__System.registerDynamic("2e", ["33"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var aFunction = $__require('33');
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

$__System.registerDynamic("1f", ["36", "2c", "2e"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var global = $__require('36'),
      core = $__require('2c'),
      ctx = $__require('2e'),
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

$__System.registerDynamic("3d", [], true, function($__require, exports, module) {
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

$__System.registerDynamic("49", ["1f", "2c", "3d"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $export = $__require('1f'),
      core = $__require('2c'),
      fails = $__require('3d');
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

$__System.registerDynamic("4a", ["48", "49"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var toObject = $__require('48');
  $__require('49')('keys', function($keys) {
    return function keys(it) {
      return $keys(toObject(it));
    };
  });
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("2c", [], true, function($__require, exports, module) {
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

$__System.registerDynamic("4b", ["4a", "2c"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  $__require('4a');
  module.exports = $__require('2c').Object.keys;
  global.define = __define;
  return module.exports;
});

$__System.registerDynamic("4c", ["4b"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = {
    "default": $__require('4b'),
    __esModule: true
  };
  global.define = __define;
  return module.exports;
});

$__System.register("6", ["4c"], function (_export) {
  var _Object$keys, _samples, sampleLibrary;

  return {
    setters: [function (_c) {
      _Object$keys = _c["default"];
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

      _export("default", sampleLibrary);
    }
  };
});

$__System.register('4d', ['3', '6', '47', '4c'], function (_export) {
  var ctx, sampleLibrary, _Promise, _Object$keys, loadSamples;

  return {
    setters: [function (_2) {
      ctx = _2['default'];
    }, function (_3) {
      sampleLibrary = _3['default'];
    }, function (_) {
      _Promise = _['default'];
    }, function (_c) {
      _Object$keys = _c['default'];
    }],
    execute: function () {

      // `samples` is a mapping of names to URLs
      //   eg. { kick: 'path/to/kick.wav' }
      'use strict';

      loadSamples = function loadSamples(samples) {
        var sampleNames = _Object$keys(samples);
        // map sample names to promises for decoded audio buffers
        var bufferPromises = sampleNames.map(function (name) {
          var sampleUrl = samples[name];
          return new _Promise(function (resolve, reject) {
            fetch(sampleUrl, {
              method: 'GET'
            }).then(function (response) {
              return response.arrayBuffer();
            }, reject).then(function (arrayBuffer) {
              ctx.decodeAudioData(arrayBuffer, function (audioBuffer) {
                resolve(audioBuffer);
              }, reject);
            }, reject);
          });
        });
        return _Promise.all(bufferPromises).then(function (buffers) {
          sampleNames.map(function (name, index) {
            sampleLibrary.set(name, buffers[index]);
          });
        });
      };

      _export('default', loadSamples);
    }
  };
});

$__System.registerDynamic("4e", [], false, function(__require, __exports, __module) {
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

$__System.register('3', ['4e'], function (_export) {
  'use strict';

  var ctx;
  return {
    setters: [function (_e) {}],
    execute: function () {
      ctx = new AudioContext();

      _export('default', ctx);
    }
  };
});

$__System.register('c', ['3'], function (_export) {
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

$__System.register("4f", [], function (_export) {
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

$__System.register("50", [], function (_export) {
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

$__System.register('51', ['2', '3', '4', '5', '6', '7', '8', '50', 'b', '4d', 'c', '4f'], function (_export) {

  // public api
  'use strict';

  var destination, ctx, BlipNode, clipFactory, sampleLibrary, chainFactory, loopFactory, chance, envelopeFactory, loadSamples, time, random, blip;
  return {
    setters: [function (_2) {
      destination = _2['default'];
    }, function (_) {
      ctx = _['default'];
    }, function (_3) {
      BlipNode = _3['default'];
    }, function (_4) {
      clipFactory = _4['default'];
    }, function (_7) {
      sampleLibrary = _7['default'];
    }, function (_5) {
      chainFactory = _5['default'];
    }, function (_6) {
      loopFactory = _6['default'];
    }, function (_8) {
      chance = _8['default'];
    }, function (_b) {
      envelopeFactory = _b['default'];
    }, function (_d) {
      loadSamples = _d['default'];
    }, function (_c) {
      time = _c['default'];
    }, function (_f) {
      random = _f['default'];
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

      blip.loadSamples = loadSamples;

      blip.sampleLibrary = sampleLibrary;

      _export('default', blip);
    }
  };
});

$__System.register('1', ['51'], function (_export) {
  'use strict';

  var blip;
  return {
    setters: [function (_) {
      blip = _['default'];
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