# blip

Sweet, sugary goodness for looping and sampling with the Web Audio API

## Getting Started

### Loading Samples

*Blip helps you load samples asynchronously, and gives you a simple callback mechanism to ensure that your samples are ready to use.*

``` javascript
blip.sampleLoader()
  .samples({
    'kick', 'path/to/your/kick_sound.wav',
    'snare', 'path/to/your/snare_sound.wav',
    'kazoo', 'path/to/your/kazoo_sound.wav'
  })
  .done(callback)
  .load();

function callback() {
  // now your samples are available
  blip.sample('snare') // is an AudioBuffer
}
```

### Creating Clips

*A clip is a wrapper for a sample, which handles creating and wiring up a BufferSource each time the sound is played.*

``` javascript
var snare = blip.clip()
  .sample('snare');

// play the clip immediately
snare.play();

// play the clip again in 5 seconds
snare.play(5);
```

## Looping

### Basic Looping

*A loop generates "ticks" at a specific tempo, and allows you to schedule events based on the time of each tick.*
``` javascript
var monotonous = blip.loop()
  .tempo(110)
  .tick(function(t) {
    clip.play(t)
  });

monotonous.start();
```

### Better Looping

*Loops can take an array of arbitrary data to loop over, and the current datum is passed to the tick callback.*

``` javascript
var rhythmic = blip.loop()
  .tempo(130)
  .data([1,0,1,1,0])
  .tick(function(t,d) {
    if (d) {
      clip.play(t)
    }
  });

rhythmic.start();
```

### Awesome Looping

*The data passed in can represent anything you want it to. In this case it is being used to set the playback rate of the clip.*

``` javascript
var melodic = blip.loop()
  .tempo(120)
  .data(0.3,0.4,0.5,0.6)
  .tick(function(t,d) {
    clip.play(t, { 'rate': d });
  })

melodic.start();
```
