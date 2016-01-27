import ctx from 'lib/context';

let loopFactory = function() {
  let lookahead = 25.0, // ms
      scheduleAheadTime = 0.1; // s

  let tempo; // ticks per minute

  let tickInterval; // seconds per tick

  let data = [];

  let currentTick = 0,
      nextTickTime = 0;

  let tick = function(t,d,i) {};
  let each = function(t,i) {};

  let iterations = 0,
      limit = 0;

  let timer;

  let loop = {};

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

  loop.tempo = function(bpm) {
    if (!arguments.length) return tempo;
    tempo = bpm;
    tickInterval = 60 / tempo;
    return loop;
  };
  loop.tickInterval = function(s) {
    if (!arguments.length) return tickInterval;
    tickInterval = s;
    tempo = 60 / tickInterval;
    return loop;
  };
  loop.data = function(a) {
    if (!arguments.length) return data;
    data = a;
    return loop;
  };
  loop.lookahead = function(ms) {
    if (!arguments.length) return lookahead;
    lookahead = ms;
    return loop;
  };
  loop.scheduleAheadTime = function(s) {
    if (!arguments.length) return scheduleAheadTime;
    scheduleAheadTime = s;
    return loop;
  };
  loop.limit = function(n) {
    if (!arguments.length) return limit;
    limit = n;
    return loop;
  };
  loop.tick = function(f) {
    if (!arguments.length) return tick;
    tick = f;
    return loop;
  };
  loop.each = function(f) {
    if (!arguments.length) return each;
    each = f;
    return loop;
  }
  loop.start = function(t) {
    nextTickTime = t || ctx.currentTime;
    scheduler();
    return loop;
  };
  loop.stop = function() {
    window.clearTimeout(timer);
    return loop;
  };
  loop.reset = function() {
    currentTick = 0;
    iterations = 0;
    return loop;
  };

  return loop;
}

export default loopFactory;
