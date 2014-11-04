import "context";
import "node";

blip.envelope = function() {

  var attack = 0,
      decay = 0,
      sustain = 0.8,
      release = 0;

  var gain = ctx.createGain();

  // wrap the GainNode, giving it BlipNode methods
  var envelope = specialBlipNode(gain);

  // initialize the gain at 0
  envelope.param('gain', 0);

  // ADSR setter/getters
  envelope.attack = function(a) {
    if (!arguments.length) return attack;
    attack = a;
    return envelope;
  };
  envelope.decay = function(d) {
    if (!arguments.length) return decay;
    decay = d;
    return envelope;
  };
  envelope.sustain = function(s) {
    if (!arguments.length) return sustain;
    sustain = s;
    return envelope;
  };
  envelope.release = function(r) {
    if (!arguments.length) return release;
    release = r;
    return envelope;
  };
  envelope.noteOn = function(t) {
    t = typeof t === 'number' ? t : now();
    envelope.param('gain', function() {
      this.cancelScheduledValues(t);
      this.setValueAtTime(0, t);
      this.linearRampToValueAtTime(1, t + attack);
      this.setTargetAtTime(sustain, t + attack, decay * 0.368);
      this.setValueAtTime(sustain, t + attack + decay);
    });
    return envelope;
  };
  envelope.noteOff = function(t) {
    t = typeof t === 'number' ? t : now();
    envelope.param('gain', function() {
      this.cancelScheduledValues(t);
      //this.setValueAtTime(sustain, t);
      this.setTargetAtTime(0, t, release * 0.368)
      this.setValueAtTime(0, t + release);
    });
    return envelope;
  };
  envelope.play = function(t, dur) {
    envelope.noteOn(t);
    envelope.noteOff(t + dur);
    return envelope;
  };

  return envelope;
}