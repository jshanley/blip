blip.sampleLoader()
  .samples({
    'bass': 'sounds/bassdrum.wav',
    'cymbal': 'sounds/cymbal.wav',
    'guitar': 'sounds/guitar.wav'
  })
  .done(loaded)
  .load();

function loaded() {

  // set base tempo var
  var TEMPO = 160;

  // create clips
  var bass = blip.clip().sample('bass');
  var cymbal = blip.clip().sample('cymbal');
  var guitar = blip.clip().sample('guitar');

  /* ====================== LOOPS ====================== */
  var bassLoop = blip.loop()
    .tempo(TEMPO)
    .data([1, 0, 1, 0, 0, 1, 1, 0])
    .tick(function(t,d) {
      if (d) bass.play(t, { rate: d, gain: 0.4 });
    })

  var cymbalLoop = blip.loop()
    .tempo(TEMPO)
    .data([0, 1, 1, 0, 1, 0, 1, 0])
    .tick(function(t,d) {
      if (d) cymbal.play(t, { rate: d, gain: 0.7 });
    })

  var guitarLoop = blip.loop()
    .tempo(TEMPO)
    .data([1/2, 1/3, 1, 1/4, 1/4, 1, 1])
    .tick(function(t, d) {
      if(blip.chance(3/5)) guitar.play(t, { rate: d, gain: 0.4 });
    })

  /* click events */
  document.getElementById('example2-play').addEventListener('click', function() {
    if(window.currentBlips){
      var blipLength = window.currentBlips.length;
      for (var blipIndex = 0; blipIndex < blipLength; blipIndex++){
        window.currentBlips[blipIndex].stop();
      }
    }
    $('.play-button').show();
    $('.pause-button').hide();
    $('#example2-play').hide();
    $('#example2-pause').show();
    bassLoop.start();
    cymbalLoop.start()
    guitarLoop.start()
    window.currentBlips = [bassLoop, cymbalLoop, guitarLoop];
  });
  document.getElementById('example2-pause').addEventListener('click', function() {
    if(window.currentBlips){
      var blipLength = window.currentBlips.length;
      for (var blipIndex = 0; blipIndex < blipLength; blipIndex++){
        window.currentBlips[blipIndex].stop();
      }
    }
    $('#example2-play').show();
    $('#example2-pause').hide();
  });
}
