blip.sampleLoader()
  .samples({
    'glass': 'sounds/glass.wav',
    'plastic': 'sounds/plastic.wav',
    'can': 'sounds/cokecan.wav'
  })
  .done(loaded)
  .load();

function loaded() {

  var glass = blip.clip().sample('glass');
  var plastic = blip.clip().sample('plastic');
  var can = blip.clip().sample('can');

  var loop = blip.loop()
    .tempo(410)
    .data([0.2,0.3,0.4,0.5,0.75,0.4])
    .tick(function(t,d) {
      if (blip.chance(4/5)) glass.play(t, { rate: d, gain: 0.6 });
      if (blip.chance(2/5)) plastic.play(t, { rate: blip.random(0.4, 0.6), gain: 0.8 });
      if (blip.chance(1/5)) can.play(t, { rate: blip.random(0.4, 0.8) });
      if (blip.chance(1/24)) {
        var factor = blip.chance(0.5) ? 3/2 : 2/3;
        this.data(this.data().map(function(d) {
          return d * factor;
        }));
      }
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
    loop.start();
    window.currentBlips = [loop];
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
