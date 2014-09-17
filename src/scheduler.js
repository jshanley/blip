import "context";

/*
* Precise scheduling for audio events
* Based on the method described in this article by Chris Wilson:
*   http://www.html5rocks.com/en/tutorials/audio/scheduling/
*/
blip.scheduler = function() {

  var lookahead = 25.0, // ms
      scheduleAheadTime = 0.1, // s
      tickQueue = [];

  var tempo, // ticks per minute
      ticks; // number of ticks per cycle

  var currentTick = 0,
      nextTickTime = 0;

  var action = function(tickNum, time) {};

  var timer = 0;

  function my() {}

  function nextTick() {
    var secondsPerTick = 60 / tempo;
    nextTickTime += secondsPerTick;

    // cycle through ticks
    if (currentTick < ticks) {
      currentTick += 1;
    } else {
      currentTick = 0;
    }
  }

  function scheduleTick(tickNum, time) {
    //tickQueue.push({ tick: tickNum, time: when });
    action.call(my, tickNum, time);
  }

  function scheduler() {
    while (nextTickTime < ctx.currentTime + scheduleAheadTime) {
      scheduleTick(currentTick, nextTickTime);
      nextTick();
    }
    timer = window.setTimeout(scheduler, lookahead);
  }

  my.tempo = function(bpm) {
    if (!arguments.length) return tempo;
    tempo = bpm;
    return my;
  };
  my.ticks = function(n) {
    if (!arguments.length) return ticks;
    ticks = n;
    return my;
  };
  my.lookahead = function(ms) {
    if (!arguments.length) return lookahead;
    lookahead = ms;
    return my;
  };
  my.scheduleAheadTime = function(s) {
    if (!arguments.length) return scheduleAheadTime;
    scheduleAheadTime = s;
    return my;
  };
  my.action = function(f) {
    if (!arguments.length) return action;
    action = f;
    return my;
  };
  my.start = function() {
    nextTickTime = ctx.currentTime;
    timer = window.setTimeout(scheduler, lookahead);
  };
  my.stop = function() {
    window.clearTimeout(timer);
  };
  my.reset = function() {
    currentTick = 0;
  }

  return my;

};
