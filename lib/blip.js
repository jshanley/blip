import ctx from 'lib/context';
import destination from 'lib/destination';
import BlipNode from 'lib/blip-node';
import clipFactory from 'lib/clip-factory';
import chainFactory from 'lib/chain-factory';
import loopFactory from 'lib/loop-factory';
import envelopeFactory from 'lib/envelope-factory';
import sampleLoader from 'lib/sample-loader';
import sampleLibrary from 'lib/sample-library';
import time from 'lib/time';
import random from 'lib/random';
import chance from 'lib/chance';

// public api
let blip = {};

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

blip.getContext = function() { return ctx; };

blip.sampleLoader = sampleLoader;

// TODO: deprecate
blip.getLoadedSamples = sampleLibrary.dump;
blip.sample = sampleLibrary.get;

export default blip;
