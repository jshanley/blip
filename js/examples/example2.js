blip.sampleLoader()
  .samples({
    'bass': 'sounds/bassdrum.wav',
    'cymbal': 'sounds/cymbal.wav'
  })
  .done(loaded)
  .load();

function loaded() {

  // set base tempo var
  var TEMPO = 86;

  // create clips
  var bass = blip.clip().sample('bass');
  var cymbal = blip.clip().sample('cymbal');

  /* ====================== LOOPS ====================== */
  var bassLoop = blip.loop()
    .tempo(TEMPO)
    .data([1, 1, 1, 0, 0, 1, 1])
    .tick(function(t,d) {
      if (d) bass.play(t, { rate: d });
    })

  /* click events */
  document.getElementById('example2-play').addEventListener('click', function() {
    if(window.currentBlips){
      var blipLength = window.currentBlips.length;
      for (var blipIndex = 0; blipIndex < blipLength; blipIndex++){
        window.currentBlips[blipIndex].stop();
      }
    }
    $('#example2-play').hide();
    $('#example2-pause').show();
    bassLoop.start();
    window.currentBlips = [bassLoop];
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
