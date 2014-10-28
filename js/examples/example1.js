blip.sampleLoader()
  .samples({
    'uke': 'sounds/ukeC.wav'
  })
  .done(loaded)
  .load();

function loaded() {

  // set base tempo var
  var TEMPO = 86;

  // create clips
  var uke1 = blip.clip().sample('uke');
  var uke2 = blip.clip().sample('uke');

  /* ====================== LOOPS ====================== */
  var bass = blip.loop()
    .tempo(TEMPO)
    .data([1/2, 1/2, 3/4, 1/2, 1/3])
    .tick(function(t,d) {
      if (blip.chance(4/5)) uke1.play(t, { rate: d, gain: 0.5 / Math.sqrt(d) });
    })

  var melody = blip.loop()
    .tempo(TEMPO * 2)
    .data([3/2, 2, 3, 5/4, 5/2, 5/8])
    .tick(function(t,d) {
      if (blip.chance(1/3)) uke2.play(t, { rate: d, gain: 0.4 })
      if (blip.chance(1/6)) uke2.play(t, { rate: d * 3/2, gain: 0.4})
    });

  /* click events */
  document.getElementById('example1-play').addEventListener('click', function() {
    if(window.currentBlips){
      var blipLength = window.currentBlips.length;
      for (var blipIndex = 0; blipIndex < blipLength; blipIndex++){
        window.currentBlips[blipIndex].stop();
      }
    }
    $('.play-button').show();
    $('.pause-button').hide();
    $('#example1-play').hide();
    $('#example1-pause').show();
    bass.start();
    melody.start();
    window.currentBlips = [bass, melody];
  });
  document.getElementById('example1-pause').addEventListener('click', function() {
    if(window.currentBlips){
      var blipLength = window.currentBlips.length;
      for (var blipIndex = 0; blipIndex < blipLength; blipIndex++){
        window.currentBlips[blipIndex].stop();
      }
    }
    $('#example1-play').show();
    $('#example1-pause').hide();
  });
}
