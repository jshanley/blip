blip.node = function() {

  var reference,
      id;

  var inputs = [],
      outputs = [];

  function node() {}

  function rewireInputs(a) {
    inputs.forEach(function(d) { d.node().disconnect(); })
    a.forEach(function(d) { d.node().connect(reference); })
    inputs = a;
  }
  function rewireOutputs(a) {
    reference.disconnect();
    a.forEach(function(d) { reference.connect(d.node())})
    outputs = a;
  }

  node.wrap = function(audionode) {
    reference = audionode;
    return node;
  };
  node.create = function(f) {
    reference = f.call(node, ctx);
    return node;
  }
  node.connect = function(blipnode) {
    outputs.push(blipnode);
    reference.connect(blipnode.node())
    return node;
  };
  node.inputs = function(a) {
    if (!arguments.length) return inputs;
    rewireInputs(a);
    return node;
  };
  node.outputs = function(a) {
    if (!arguments.length) return outputs;
    outputs = a;
    rewire();
    return node;
  };
  node.param = function(name, value) {
    if (!arguments.length) return node;
    if (arguments.length === 2) {
      reference[name].value = value;
    } else {
      return reference[name].value;
    }
    return node;
  };
  node.node = function() {
    return reference;
  }

  return node;

}
