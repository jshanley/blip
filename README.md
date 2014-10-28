# [blip](http://jshanley.github.io/blip/)

**blip** is a lightweight JavaScript library that wraps the Web Audio API, abstracting away the AudioContext, and simplifying node creation and audio routing. It also provides some extremely powerful and flexible methods for looping and manipulating samples that allow for both temporal precision and musical expressiveness.

> Visit the [**site**](http://jshanley.github.io/blip/) >>

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
var bassDrum = blip.clip()
  .sample('bassDrum');

// play the clip immediately
bassDrum.play(0);

// play the clip again in 5 seconds
bassDrum.play(5);
```

## Looping

Blip enables you to create precise loops for playing samples, controlling audio parameters, or just about anything else you can think of by letting you deal directly with time, and providing an simple and elegant scheduling mechanism.

A loop simply provides markers for points in time, to which you can assign arbitrary data, and fire playback events. 

These examples assume the variable `clip` is a blip clip.

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

*Loops can take an array of arbitrary data to loop over, and the current datum is passed as the second argument to the tick callback.*

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
  .data([0.3,0.4,0.5,0.6])
  .tick(function(t,d) {
    clip.play(t, { 'rate': d });
  })

melodic.start();
```

### Add some randomness

Blip provides helper functions to add elements of randomness and chance to your compositions.

This loop has a 1/3 chance to play a clip on each tick, and assigns it a random rate between 0.2 and 1.4

``` javascript
var entropic = blip.loop()
  .tempo(110)
  .tick(function(t,d) {
    if (blip.chance(1/3)) clip.play(t, { 'rate': blip.random(0.2, 1.4) });
  })

entropic.start();
```

Visit the [**site**](http://jshanley.github.io/blip/) for more examples.


