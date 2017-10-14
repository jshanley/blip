import ctx from './context';
import destination from './destination';
import BlipNode from './blip-node';
import clipFactory from './clip-factory';
import chainFactory from './chain-factory';
import loopFactory from './loop-factory';
import sampleLibrary from './sample-library';
import loadSamples from './load-samples';
import time from './time';
import random from './random';
import chance from './chance';

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

blip.destination = destination;
blip.listener = BlipNode.fromAudioNode(ctx.listener);

blip.getContext = function() { return ctx; };

blip.loadSamples = loadSamples;

blip.sampleLibrary = sampleLibrary;

export default blip;
